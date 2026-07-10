import type { ResearchDeliverable } from "./types"

export type CrooResearchDeliverable = Omit<ResearchDeliverable, "sources"> & {
  sources: string[]
}

export function toCrooDeliverable(result: ResearchDeliverable): CrooResearchDeliverable {
  return {
    ...result,
    sources: result.sources.map((source) => JSON.stringify(source)),
  }
}
