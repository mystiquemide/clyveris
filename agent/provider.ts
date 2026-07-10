import { AgentClient, DeliverableType, EventType } from "@croo-network/sdk"
import { signals } from "../src/lib/signals"
import { parseBriefRequest } from "./briefSchema"
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

  stream.on(EventType.NegotiationCreated, async (event) => {
    const negotiationId = event.negotiation_id
    if (!negotiationId) return

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
  })

  stream.on(EventType.OrderPaid, async (event) => {
    const orderId = event.order_id
    if (!orderId) return

    let job = store.all().find((candidate) => candidate.orderId === orderId)
    if (!job) return

    try {
      const order = await client.getOrder(orderId)
      job = markPaid(job, order.payTxHash)
      store.save(job)

      job = markResearching(job)
      store.save(job)

      const result = researchBrief(job.brief, signals)
      const delivery = await client.deliverOrder(orderId, {
        deliverableType: DeliverableType.Schema,
        deliverableSchema: JSON.stringify(result),
      })

      job = markDelivered(job, result, delivery.txHash)
      store.save(job)
      console.info(`delivered order ${orderId}: ${result.status}`)
    } catch (error) {
      const reason = error instanceof Error ? error.message : "unknown delivery failure"
      store.save(markFailed(job, reason))
      await client.rejectOrder(orderId, reason).catch(() => undefined)
      console.error(`failed to deliver order ${orderId}: ${reason}`)
    }
  })

  stream.on(EventType.OrderExpired, (event) => {
    const orderId = event.order_id
    const job = orderId ? store.all().find((candidate) => candidate.orderId === orderId) : undefined
    if (job) store.save(markFailed(job, "order expired before payment"))
  })

  stream.on(EventType.OrderRejected, (event) => {
    const orderId = event.order_id
    const job = orderId ? store.all().find((candidate) => candidate.orderId === orderId) : undefined
    if (job) store.save(markFailed(job, event.reason ?? "order rejected"))
  })

  process.on("SIGINT", () => {
    stream.close()
    process.exit(0)
  })

  console.info("Clyveris research agent online, listening for CAP negotiations")
}

startProvider().catch((error) => {
  console.error("provider failed to start", error)
  process.exit(1)
})
