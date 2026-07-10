import { describe, expect, it } from "vitest"
import { filterSignals, getSignalBySlug, signals } from "./signals"

describe("signal domain", () => {
  it("returns a signal by its stable slug", () => {
    expect(getSignalBySlug("waiting-cost")).toMatchObject({
      id: "signal-001",
      slug: "waiting-cost",
    })
  })

  it("returns no result for an unknown slug", () => {
    expect(getSignalBySlug("unknown-signal")).toBeUndefined()
  })

  it("filters signals by category without changing the source list", () => {
    const result = filterSignals(signals, "category-watch", new Set())

    expect(result).toHaveLength(1)
    expect(result[0]?.category).toBe("category-watch")
    expect(signals).toHaveLength(3)
  })

  it("keeps exact first-party URLs and publication dates for the curated corpus", () => {
    expect(signals.map((signal) => signal.source)).toEqual([
      { publisher: "Gartner", url: "https://www.gartner.com/en/documents/7363830", publishedAt: "2026-01-26" },
      { publisher: "Feedly", url: "https://feedly.com/changelog/add-specific-context-to-your-market-intelligence-queries", publishedAt: "2026-04-01" },
      { publisher: "Google Trends", url: "https://developers.google.com/search/blog/2025/07/trends-api", publishedAt: "2025-07-24" },
    ])
  })

  it("filters saved signals using supplied ids", () => {
    const result = filterSignals(signals, "saved", new Set(["signal-002"]))

    expect(result.map((signal) => signal.id)).toEqual(["signal-002"])
  })
})
