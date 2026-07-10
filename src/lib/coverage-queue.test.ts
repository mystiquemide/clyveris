import { describe, expect, it } from "vitest"
import {
  QUEUE_LIMIT,
  enqueueTopic,
  parseQueue,
  readQueueSnapshot,
} from "./coverage-queue"

// Node has no sessionStorage, so these tests exercise the in-memory
// fallback path, the same one a storage-blocked browser uses.
describe("coverage queue", () => {
  it("parses garbage and non-arrays to an empty queue", () => {
    expect(parseQueue("not json")).toEqual([])
    expect(parseQueue('{"a":1}')).toEqual([])
    expect(parseQueue('[1,2,"keep"]')).toEqual(["keep"])
  })

  it("keeps the newest topic first and dedupes case-insensitively", () => {
    enqueueTopic("Quantum submarine logistics")
    enqueueTopic("Underwater basket weaving")
    enqueueTopic("quantum submarine logistics")

    const queue = parseQueue(readQueueSnapshot())
    expect(queue[0]).toBe("quantum submarine logistics")
    expect(queue[1]).toBe("Underwater basket weaving")
    expect(queue.filter((t) => t.toLowerCase() === "quantum submarine logistics").length).toBe(1)
  })

  it("caps the queue at the limit", () => {
    for (let i = 0; i < QUEUE_LIMIT + 3; i++) {
      enqueueTopic(`unverifiable topic ${i}`)
    }
    expect(parseQueue(readQueueSnapshot()).length).toBe(QUEUE_LIMIT)
  })
})
