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

  it("filters saved signals using supplied ids", () => {
    const result = filterSignals(signals, "saved", new Set(["signal-002"]))

    expect(result.map((signal) => signal.id)).toEqual(["signal-002"])
  })
})
