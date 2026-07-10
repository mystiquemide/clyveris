import { AgentClient, DeliverableType, EventType } from "@croo-network/sdk"
import { signals } from "../src/lib/signals"
import { parseBriefRequest } from "./briefSchema"
import { toCrooDeliverable } from "./deliverable"
import { researchBrief } from "./research"
import {
  JobStore,
  createJob,
  markDelivered,
  markFailed,
  markPaid,
  markPaymentRequired,
  markRejected,
  markResearching,
  recoverPaymentRequiredJob,
} from "./jobStore"

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`missing required env var ${name}`)
  return value
}

function redact(value: unknown, sdkKey: string): unknown {
  if (typeof value === "string") return value.split(sdkKey).join("[REDACTED]")
  if (value instanceof Error) return redact(value.message, sdkKey)
  if (Array.isArray(value)) return value.map((item) => redact(item, sdkKey))
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, redact(v, sdkKey)]))
  }
  return value
}

function redactingLogger(sdkKey: string) {
  const scrubMessage = (message: string) => redact(message, sdkKey) as string
  const scrub = (args: unknown[]) => args.map((arg) => redact(arg, sdkKey))
  return {
    info: (message: string, ...args: unknown[]) => console.info(scrubMessage(message), ...scrub(args)),
    warn: (message: string, ...args: unknown[]) => console.warn(scrubMessage(message), ...scrub(args)),
    error: (message: string, ...args: unknown[]) => console.error(scrubMessage(message), ...scrub(args)),
    debug: (message: string, ...args: unknown[]) => console.debug(scrubMessage(message), ...scrub(args)),
  }
}

export async function startProvider() {
  const baseURL = requireEnv("CROO_API_URL")
  const wsURL = requireEnv("CROO_WS_URL")
  const sdkKey = requireEnv("CROO_SDK_KEY")

  const client = new AgentClient({ baseURL, wsURL, logger: redactingLogger(sdkKey) }, sdkKey)
  const store = new JobStore()
  const stream = await client.connectWebSocket()
  const processingOrderIds = new Set<string>()

  stream.on(EventType.NegotiationCreated, async (event) => {
    const negotiationId = event.negotiation_id
    if (!negotiationId) return

    try {
      const negotiation = await client.getNegotiation(negotiationId)
      const parsed = parseBriefRequest(negotiation.requirements)

      if (!parsed.ok) {
        await client.rejectNegotiation(negotiationId, `invalid brief: ${parsed.reason}`)
        const job = createJob(negotiation, { topic: negotiation.requirements })
        store.save(markRejected(job, parsed.reason))
        console.warn(`rejected negotiation ${negotiationId}: ${parsed.reason}`)
        return
      }

      let job = createJob(negotiation, parsed.brief)
      store.save(job)

      const accepted = await client.acceptNegotiation(negotiationId)
      job = markPaymentRequired(job, accepted.order.orderId, accepted.order.price, accepted.order.paymentToken)
      store.save(job)
      console.info(`order ${accepted.order.orderId} created for negotiation ${negotiationId}, awaiting payment`)
    } catch (error) {
      const reason = error instanceof Error ? error.message : "unknown negotiation failure"
      console.error(`failed to handle negotiation ${negotiationId}: ${reason}`)
      await client
        .rejectNegotiation(negotiationId, "provider hit an internal error while reviewing this brief")
        .catch(() => undefined)
    }
  })

  stream.on(EventType.OrderPaid, async (event) => {
    const orderId = event.order_id
    if (!orderId) return
    if (processingOrderIds.has(orderId)) {
      console.warn(`ignoring duplicate paid event while order ${orderId} is already processing`)
      return
    }

    processingOrderIds.add(orderId)
    let job = store.all().find((candidate) => candidate.orderId === orderId)

    try {
      const order = await client.getOrder(orderId)

      if (!job) {
        const negotiation = await client.getNegotiation(order.negotiationId)
        const parsed = parseBriefRequest(negotiation.requirements)
        if (!parsed.ok) {
          await client.rejectOrder(orderId, `stored brief is invalid: ${parsed.reason}`)
          console.error(`cannot recover paid order ${orderId}: ${parsed.reason}`)
          return
        }

        job = recoverPaymentRequiredJob(negotiation, parsed.brief, order)
        store.save(job)
        console.warn(`recovered paid order ${orderId} from CROO after local state was unavailable`)
      }

      if (job.status === "delivered") {
        console.info(`ignoring duplicate paid event for delivered order ${orderId}`)
        return
      }
      if (job.status === "requested") {
        job = markPaymentRequired(job, order.orderId, order.price, order.paymentToken)
        store.save(job)
      }
      if (job.status === "payment_required") {
        job = markPaid(job, order.payTxHash)
        store.save(job)
      }
      if (job.status === "paid") {
        job = markResearching(job)
        store.save(job)
      }
      if (job.status !== "researching") {
        throw new Error(`cannot resume paid order ${orderId} from ${job.status}`)
      }

      const result = researchBrief(job.brief, signals)
      const deliverable = toCrooDeliverable(result)
      const delivery = await client.deliverOrder(orderId, {
        deliverableType: DeliverableType.Schema,
        deliverableSchema: JSON.stringify(deliverable),
      })

      job = markDelivered(job, result, delivery.txHash)
      store.save(job)
      console.info(`delivered order ${orderId}: ${result.status}`)
    } catch (error) {
      const reason = error instanceof Error ? error.message : "unknown delivery failure"
      if (job && job.status !== "delivered") store.save(markFailed(job, reason))
      await client.rejectOrder(orderId, reason).catch(() => undefined)
      console.error(`failed to deliver order ${orderId}: ${reason}`)
    } finally {
      processingOrderIds.delete(orderId)
    }
  })

  stream.on(EventType.OrderExpired, (event) => {
    const orderId = event.order_id
    const job = orderId ? store.all().find((candidate) => candidate.orderId === orderId) : undefined
    if (job && job.status !== "delivered") store.save(markFailed(job, "order expired before payment"))
  })

  stream.on(EventType.OrderRejected, (event) => {
    const orderId = event.order_id
    const job = orderId ? store.all().find((candidate) => candidate.orderId === orderId) : undefined
    if (job && job.status !== "delivered") store.save(markFailed(job, event.reason ?? "order rejected"))
  })

  const shutdown = () => {
    stream.close()
    process.exit(0)
  }
  process.on("SIGINT", shutdown)
  process.on("SIGTERM", shutdown)

  console.info("Clyveris research agent online, listening for CAP negotiations")
}

startProvider().catch((error) => {
  console.error("provider failed to start", error)
  process.exit(1)
})
