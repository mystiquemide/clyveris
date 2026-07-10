import { mkdtempSync, readFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import type { Negotiation } from "@croo-network/sdk"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
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
import type { ResearchDeliverable } from "./types"

const fixedNow = () => new Date("2026-07-10T12:00:00.000Z")

function fakeNegotiation(overrides: Partial<Negotiation> = {}): Negotiation {
  return {
    negotiationId: "neg-1",
    serviceId: "service-1",
    requesterAgentId: "requester-1",
    providerAgentId: "provider-1",
    requirements: JSON.stringify({ topic: "pricing pressure" }),
    status: "pending",
    rejectReason: "",
    metadata: "",
    expiresAt: "2026-07-11T00:00:00.000Z",
    createdTime: "2026-07-10T12:00:00.000Z",
    updatedTime: "2026-07-10T12:00:00.000Z",
    ...overrides,
  }
}

const sampleResult: ResearchDeliverable = {
  brief: "pricing pressure",
  status: "covered",
  sources: [{ publisher: "Test Wire", url: "https://example.com", publishedAt: "2026-07-01", facts: ["fact one"] }],
  editorialTake: "take",
  decisionQuestion: "question?",
  tags: ["pricing"],
  generatedAt: "2026-07-10T12:00:00.000Z",
}

describe("job state machine", () => {
  it("starts a new job as requested with no payment or result", () => {
    const job = createJob(fakeNegotiation(), { topic: "pricing pressure" }, fixedNow)

    expect(job.status).toBe("requested")
    expect(job.orderId).toBeUndefined()
    expect(job.result).toBeUndefined()
  })

  it("gates delivery behind payment: order creation only reaches payment_required", () => {
    const job = createJob(fakeNegotiation(), { topic: "pricing pressure" }, fixedNow)
    const withOrder = markPaymentRequired(job, "order-1", "1000000", "USDC", fixedNow)

    expect(withOrder.status).toBe("payment_required")
    expect(withOrder.orderId).toBe("order-1")
    expect(withOrder.result).toBeUndefined()
  })

  it("rejects skipping straight from payment_required to delivered", () => {
    const job = createJob(fakeNegotiation(), { topic: "pricing pressure" }, fixedNow)
    const withOrder = markPaymentRequired(job, "order-1", "1000000", "USDC", fixedNow)

    expect(() => markDelivered(withOrder, sampleResult, "0xdeadbeef", fixedNow)).toThrow()
  })

  it("settles a job through paid -> researching -> delivered with the result and tx hash attached", () => {
    const job = createJob(fakeNegotiation(), { topic: "pricing pressure" }, fixedNow)
    const withOrder = markPaymentRequired(job, "order-1", "1000000", "USDC", fixedNow)
    const paid = markPaid(withOrder, "0xpay", fixedNow)
    const researching = markResearching(paid, fixedNow)
    const delivered = markDelivered(researching, sampleResult, "0xdeliver", fixedNow)

    expect(delivered.status).toBe("delivered")
    expect(delivered.payTxHash).toBe("0xpay")
    expect(delivered.deliverTxHash).toBe("0xdeliver")
    expect(delivered.result).toEqual(sampleResult)
  })

  it("marks a job failed when payment never arrives, without a result", () => {
    const job = createJob(fakeNegotiation(), { topic: "pricing pressure" }, fixedNow)
    const withOrder = markPaymentRequired(job, "order-1", "1000000", "USDC", fixedNow)
    const failed = markFailed(withOrder, "order expired before payment", fixedNow)

    expect(failed.status).toBe("failed")
    expect(failed.failureReason).toBe("order expired before payment")
    expect(failed.result).toBeUndefined()
  })

  it("rejects an invalid brief before any order is created", () => {
    const job = createJob(fakeNegotiation(), { topic: "pricing pressure" }, fixedNow)
    const rejected = markRejected(job, "invalid brief: topic too short", fixedNow)

    expect(rejected.status).toBe("rejected")
    expect(rejected.orderId).toBeUndefined()
  })
})

describe("JobStore persistence", () => {
  let dir: string
  let path: string

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "clyveris-jobs-"))
    path = join(dir, "jobs.json")
  })

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true })
  })

  it("persists a settled job to disk and reloads it in a new store instance", () => {
    const store = new JobStore(path)
    const job = createJob(fakeNegotiation(), { topic: "pricing pressure" }, fixedNow)
    const withOrder = markPaymentRequired(job, "order-1", "1000000", "USDC", fixedNow)
    const paid = markPaid(withOrder, "0xpay", fixedNow)
    const researching = markResearching(paid, fixedNow)
    const delivered = markDelivered(researching, sampleResult, "0xdeliver", fixedNow)
    store.save(delivered)

    const onDisk = JSON.parse(readFileSync(path, "utf-8"))
    expect(onDisk).toHaveLength(1)
    expect(onDisk[0].status).toBe("delivered")

    const reloaded = new JobStore(path)
    expect(reloaded.get("neg-1")?.status).toBe("delivered")
    expect(reloaded.get("neg-1")?.result).toEqual(sampleResult)
  })
})
