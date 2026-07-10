import { mkdirSync, readFileSync, renameSync, writeFileSync, existsSync } from "node:fs"
import { dirname, join } from "node:path"
import type { Negotiation } from "@croo-network/sdk"
import type { ResearchBriefRequest, ResearchDeliverable, ResearchJob } from "./types"

const DEFAULT_STORE_PATH = join(__dirname, "data", "jobs.json")

export function createJob(
  negotiation: Negotiation,
  brief: ResearchBriefRequest,
  now: () => Date = () => new Date(),
): ResearchJob {
  const timestamp = now().toISOString()
  return {
    id: negotiation.negotiationId,
    negotiationId: negotiation.negotiationId,
    serviceId: negotiation.serviceId,
    requesterAgentId: negotiation.requesterAgentId,
    brief,
    status: "requested",
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}

export function markPaymentRequired(
  job: ResearchJob,
  orderId: string,
  price: string,
  paymentToken: string,
  now: () => Date = () => new Date(),
): ResearchJob {
  if (job.status !== "requested") {
    throw new Error(`cannot move job ${job.id} to payment_required from ${job.status}`)
  }
  return { ...job, status: "payment_required", orderId, price, paymentToken, updatedAt: now().toISOString() }
}

export function markPaid(job: ResearchJob, payTxHash: string, now: () => Date = () => new Date()): ResearchJob {
  if (job.status !== "payment_required") {
    throw new Error(`cannot mark job ${job.id} paid from ${job.status}`)
  }
  return { ...job, status: "paid", payTxHash, updatedAt: now().toISOString() }
}

export function markResearching(job: ResearchJob, now: () => Date = () => new Date()): ResearchJob {
  if (job.status !== "paid") {
    throw new Error(`cannot mark job ${job.id} researching from ${job.status}`)
  }
  return { ...job, status: "researching", updatedAt: now().toISOString() }
}

export function markDelivered(
  job: ResearchJob,
  result: ResearchDeliverable,
  deliverTxHash: string,
  now: () => Date = () => new Date(),
): ResearchJob {
  if (job.status !== "researching") {
    throw new Error(`cannot mark job ${job.id} delivered from ${job.status}`)
  }
  return { ...job, status: "delivered", result, deliverTxHash, updatedAt: now().toISOString() }
}

export function markFailed(job: ResearchJob, reason: string, now: () => Date = () => new Date()): ResearchJob {
  if (job.status === "delivered") {
    throw new Error(`cannot mark delivered job ${job.id} failed`)
  }
  return { ...job, status: "failed", failureReason: reason, updatedAt: now().toISOString() }
}

export function markRejected(job: ResearchJob, reason: string, now: () => Date = () => new Date()): ResearchJob {
  if (job.status !== "requested") {
    throw new Error(`cannot reject job ${job.id} from ${job.status}`)
  }
  return { ...job, status: "rejected", failureReason: reason, updatedAt: now().toISOString() }
}

export class JobStore {
  private jobs = new Map<string, ResearchJob>()

  constructor(private readonly path: string = DEFAULT_STORE_PATH) {
    this.load()
  }

  private load(): void {
    if (!existsSync(this.path)) return
    try {
      const raw = readFileSync(this.path, "utf-8")
      const records: ResearchJob[] = raw.trim().length > 0 ? JSON.parse(raw) : []
      for (const job of records) this.jobs.set(job.id, job)
    } catch {
      const backup = `${this.path}.corrupt-${Date.now()}`
      renameSync(this.path, backup)
      console.warn(`job store at ${this.path} was unreadable, moved it to ${backup} and starting empty`)
    }
  }

  private persist(): void {
    mkdirSync(dirname(this.path), { recursive: true })
    writeFileSync(this.path, JSON.stringify([...this.jobs.values()], null, 2))
  }

  save(job: ResearchJob): ResearchJob {
    this.jobs.set(job.id, job)
    this.persist()
    return job
  }

  get(id: string): ResearchJob | undefined {
    return this.jobs.get(id)
  }

  all(): ResearchJob[] {
    return [...this.jobs.values()]
  }
}
