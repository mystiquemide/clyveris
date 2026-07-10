import { z } from "zod"

export const briefRequestSchema = z.object({
  topic: z.string().trim().min(3, "topic must be at least 3 characters").max(500, "topic must be at most 500 characters"),
  tags: z.array(z.string().trim().min(1)).max(10).optional(),
  maxSources: z.number().int().min(1).max(10).optional(),
})

export type ParsedBriefRequest = z.infer<typeof briefRequestSchema>

export type BriefParseResult =
  | { ok: true; brief: ParsedBriefRequest }
  | { ok: false; reason: string }

export function parseBriefRequest(rawRequirements: string): BriefParseResult {
  let json: unknown
  try {
    json = JSON.parse(rawRequirements)
  } catch {
    return { ok: false, reason: "requirements must be valid JSON" }
  }

  const parsed = briefRequestSchema.safeParse(json)
  if (!parsed.success) {
    return { ok: false, reason: parsed.error.issues.map((issue) => issue.message).join("; ") }
  }

  return { ok: true, brief: parsed.data }
}
