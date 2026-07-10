import { describe, expect, it } from "vitest"
import { parseBriefRequest } from "./briefSchema"

describe("parseBriefRequest", () => {
  it("accepts a well-formed brief", () => {
    const result = parseBriefRequest(JSON.stringify({ topic: "pricing pressure in Q3", tags: ["pricing"] }))

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.brief.topic).toBe("pricing pressure in Q3")
      expect(result.brief.tags).toEqual(["pricing"])
    }
  })

  it("rejects requirements that are not valid JSON", () => {
    const result = parseBriefRequest("not json")

    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason).toMatch(/valid JSON/)
  })

  it("rejects a brief with a topic that is too short", () => {
    const result = parseBriefRequest(JSON.stringify({ topic: "ab" }))

    expect(result.ok).toBe(false)
  })

  it("rejects a brief with a topic longer than 500 characters", () => {
    const result = parseBriefRequest(JSON.stringify({ topic: "x".repeat(501) }))

    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason).toMatch(/at most 500/)
  })

  it("rejects a brief missing the required topic field", () => {
    const result = parseBriefRequest(JSON.stringify({ tags: ["pricing"] }))

    expect(result.ok).toBe(false)
  })

  it("rejects maxSources outside the allowed range", () => {
    const result = parseBriefRequest(JSON.stringify({ topic: "pricing pressure", maxSources: 50 }))

    expect(result.ok).toBe(false)
  })
})
