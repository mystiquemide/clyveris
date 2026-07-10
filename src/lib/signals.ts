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
    source: { publisher: "Clyveris research desk", url: "https://www.gartner.com/en/documents/7363830", publishedAt: "2026-07-10" },
    sourceFacts: ["Decision intelligence brings decision modelling, analytics, and AI into one discipline.", "Market conditions make delayed decisions costly when assumptions are left untested."],
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
    source: { publisher: "Feedly", url: "https://feedly.com/market-intelligence?src=bl-po", publishedAt: "2026-07-09" },
    sourceFacts: ["Market-intelligence teams monitor sources across news, blogs, newsletters, research, and social channels.", "Weak signals become more useful when teams compare them with their own category context."],
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
    source: { publisher: "Google Trends", url: "https://support.google.com/trends/answer/4365533?hl=en", publishedAt: "2026-07-08" },
    sourceFacts: ["Search interest is sampled and normalized rather than an absolute count.", "A rise in search interest alone does not establish demand or intent."],
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
