export const signalCategories = [
  "operating-environment",
  "category-watch",
  "people-signal",
] as const

export type SignalCategory = (typeof signalCategories)[number]

export type Signal = {
  id: string
  slug: string
  category: SignalCategory
  label: string
  title: string
  summary: string
  source: { publisher: string; url: string; publishedAt: string }
  sourceFacts: string[]
  editorialTake: string
  decisionQuestion: string
  tags: string[]
}

export const signals: Signal[] = [
  {
    id: "signal-001",
    slug: "waiting-cost",
    category: "operating-environment",
    label: "Operating environment",
    title: "The cost of waiting has changed shape.",
    summary: "A closer look at the small decisions showing up in larger outcomes.",
    source: { publisher: "Gartner", url: "https://www.gartner.com/en/documents/7363830", publishedAt: "2026-01-26" },
    sourceFacts: ["Decision intelligence platforms combine decision modelling, analytics, and AI to augment and automate decision-making.", "Gartner says leaders can use these platform insights to guide investment in decision intelligence and strengthen decision-centricity."],
    editorialTake: "The hidden cost is rarely a single missed moment. It compounds through small decisions that stay unchallenged for too long.",
    decisionQuestion: "Which decision are we delaying because the context feels incomplete?",
    tags: ["Decision-making", "Operating model"],
  },
  {
    id: "signal-002",
    slug: "pressure-surface",
    category: "category-watch",
    label: "Category watch",
    title: "Where the next pressure is starting to surface.",
    summary: "Three sources worth reading alongside each other this week.",
    source: { publisher: "Feedly", url: "https://feedly.com/changelog/add-specific-context-to-your-market-intelligence-queries", publishedAt: "2026-04-01" },
    sourceFacts: ["Feedly added AI Feeds, Boards, and All Team Feeds as sources for Ask AI Research and Analyze.", "The release added embedded retrieval-augmented generation in Analyze to surface context based on a user prompt."],
    editorialTake: "The useful early signal is usually a cluster, not a headline. Compare source types before calling it a trend.",
    decisionQuestion: "What would we need to see twice before we change our category view?",
    tags: ["Market intelligence", "Category"],
  },
  {
    id: "signal-003",
    slug: "language-budget-gap",
    category: "people-signal",
    label: "The people signal",
    title: "A growing gap between what teams say and what they fund.",
    summary: "The language changes early. The budget tends to follow later.",
    source: { publisher: "Google Trends", url: "https://developers.google.com/search/blog/2025/07/trends-api", publishedAt: "2025-07-24" },
    sourceFacts: ["The Google Trends website scales results from 0 to 100 for each request.", "Google says Trends values represent search interest rather than absolute search counts."],
    editorialTake: "Language is an early prompt for investigation, not a conclusion. The stronger signal appears when language, budgets, and hiring move together.",
    decisionQuestion: "Where does our language imply a priority that our spending does not support?",
    tags: ["Teams", "Capital allocation"],
  },
]

export function getSignalBySlug(slug: string) {
  return signals.find((signal) => signal.slug === slug)
}

export function filterSignals(
  items: Signal[],
  filter: SignalCategory | "all" | "saved",
  savedIds: Set<string>,
) {
  if (filter === "saved") return items.filter((signal) => savedIds.has(signal.id))
  if (filter === "all") return items
  return items.filter((signal) => signal.category === filter)
}
