import { describe, expect, it } from "vitest"
import { signals } from "../src/lib/signals"
import { researchBrief } from "./research"

const fixedNow = () => new Date("2026-07-10T12:00:00.000Z")

describe("researchBrief", () => {
  it("returns verifiable sources with facts kept separate from the editorial take", () => {
    const result = researchBrief({ topic: "decision-making and waiting cost" }, signals, fixedNow)

    expect(result.status).toBe("covered")
    expect(result.sources.length).toBeGreaterThan(0)
    for (const source of result.sources) {
      expect(source.publisher).toBeTruthy()
      expect(source.url).toMatch(/^https?:\/\//)
      expect(source.publishedAt).toBeTruthy()
      expect(Array.isArray(source.facts)).toBe(true)
      expect(source.facts.length).toBeGreaterThan(0)
    }
    expect(result.editorialTake).not.toBe("")
    expect(result.sources.flatMap((s) => s.facts)).not.toContain(result.editorialTake)
  })

  it("never fabricates a source when nothing in the corpus matches", () => {
    const result = researchBrief({ topic: "quantum submarine logistics in antarctica" }, signals, fixedNow)

    expect(result.status).toBe("no_coverage")
    expect(result.sources).toEqual([])
    expect(result.editorialTake).toMatch(/no verified source/i)
  })

  it("caps the number of sources at maxSources", () => {
    const result = researchBrief({ topic: "market category signal team", maxSources: 1 }, signals, fixedNow)

    expect(result.sources.length).toBeLessThanOrEqual(1)
  })

  it("stamps a generation timestamp", () => {
    const result = researchBrief({ topic: "decision-making" }, signals, fixedNow)

    expect(result.generatedAt).toBe("2026-07-10T12:00:00.000Z")
  })
})
