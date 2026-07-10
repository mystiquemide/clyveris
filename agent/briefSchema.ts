import { z } from "zod"

const MAX_REQUIREMENTS_BYTES = 16_384

export const briefRequestSchema = z.object({
  topic: z.string().trim().min(3, "topic must be at least 3 characters").max(500, "topic must be at most 500 characters"),
  tags: z.array(z.string().trim().min(1).max(64, "each tag must be at most 64 characters")).max(10).optional(),
  maxSources: z.number().int().min(1).max(10).optional(),
}).strict()

export type ParsedBriefRequest = z.infer<typeof briefRequestSchema>

export type BriefParseResult =
  | { ok: true; brief: ParsedBriefRequest }
  | { ok: false; reason: string }

export function parseBriefRequest(rawRequirements: string): BriefParseResult {
  if (Buffer.byteLength(rawRequirements, "utf8") > MAX_REQUIREMENTS_BYTES) {
    return { ok: false, reason: "requirements must be at most 16 KB" }
  }

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
