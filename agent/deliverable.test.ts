import { describe, expect, it } from "vitest"
import { toCrooDeliverable } from "./deliverable"
import type { ResearchDeliverable } from "./types"

describe("toCrooDeliverable", () => {
  it("encodes structured sources as strings for CROO's flat schema builder", () => {
    const result: ResearchDeliverable = {
      brief: "Test brief",
      status: "covered",
      sources: [
        {
          publisher: "Test Wire",
          url: "https://example.com/source",
          publishedAt: "2026-07-01",
          facts: ["A verified fact"],
        },
      ],
      editorialTake: "A separate interpretation",
      decisionQuestion: "What follows?",
      tags: ["test"],
      generatedAt: "2026-07-10T16:00:00.000Z",
    }

    const deliverable = toCrooDeliverable(result)

    expect(deliverable.sources).toHaveLength(1)
    expect(typeof deliverable.sources[0]).toBe("string")
    expect(JSON.parse(deliverable.sources[0])).toEqual(result.sources[0])
    expect(deliverable.editorialTake).toBe(result.editorialTake)
  })

  it("keeps no-coverage sources as an empty array", () => {
    const result: ResearchDeliverable = {
      brief: "Unknown topic",
      status: "no_coverage",
      sources: [],
      editorialTake: "No verified coverage.",
      decisionQuestion: "What should we verify next?",
      tags: [],
      generatedAt: "2026-07-10T16:00:00.000Z",
    }

    expect(toCrooDeliverable(result).sources).toEqual([])
  })
})
