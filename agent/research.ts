import type { Signal } from "../src/lib/signals"
import type { ParsedBriefRequest } from "./briefSchema"
import type { ResearchDeliverable, ResearchSource } from "./types"

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2)
}

function signalMatchesBrief(signal: Signal, brief: ParsedBriefRequest): boolean {
  const briefTokens = new Set([
    ...tokenize(brief.topic),
    ...(brief.tags ?? []).flatMap((tag) => tokenize(tag)),
  ])

  const signalTokens = new Set([
    ...tokenize(signal.title),
    ...tokenize(signal.summary),
    ...tokenize(signal.category),
    ...signal.tags.flatMap((tag) => tokenize(tag)),
  ])

  // One shared generic token ("market", "cost") is too weak to sell as coverage.
  const requiredOverlap = Math.min(2, briefTokens.size)
  if (requiredOverlap === 0) return false

  let overlap = 0
  for (const token of briefTokens) {
    if (signalTokens.has(token)) {
      overlap += 1
      if (overlap >= requiredOverlap) return true
    }
  }
  return false
}

function toSource(signal: Signal): ResearchSource {
  return {
    publisher: signal.source.publisher,
    url: signal.source.url,
    publishedAt: signal.source.publishedAt,
    facts: signal.sourceFacts,
  }
}

export function researchBrief(
  brief: ParsedBriefRequest,
  corpus: Signal[],
  now: () => Date = () => new Date(),
): ResearchDeliverable {
  const maxSources = brief.maxSources ?? 3
  const matches = corpus.filter((signal) => signalMatchesBrief(signal, brief)).slice(0, maxSources)

  if (matches.length === 0) {
    return {
      brief: brief.topic,
      status: "no_coverage",
      sources: [],
      editorialTake:
        "Clyveris has no verified source on file for this brief yet. Delivering no result rather than an unverifiable one.",
      decisionQuestion: "Should this brief be added to the next source-curation pass?",
      tags: brief.tags ?? [],
      generatedAt: now().toISOString(),
    }
  }

  const editorialTake = matches
    .map((signal) => signal.editorialTake)
    .join(" ")
  const decisionQuestion = matches[0]?.decisionQuestion ?? ""
  const tags = Array.from(new Set(matches.flatMap((signal) => signal.tags)))

  return {
    brief: brief.topic,
    status: "covered",
    sources: matches.map(toSource),
    editorialTake,
    decisionQuestion,
    tags,
    generatedAt: now().toISOString(),
  }
}
