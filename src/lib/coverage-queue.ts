// The coverage queue collects briefs that came back no_coverage this
// session. Same external-store pattern as saved signals: sessionStorage
// with an in-memory fallback, so SSR, hydration, and reloads agree.
export const QUEUE_STORAGE_KEY = "clyveris:coverage-queue"
export const QUEUE_LIMIT = 6

let queueMemoryFallback = "[]"
const queueListeners = new Set<() => void>()

export function subscribeQueue(listener: () => void) {
  queueListeners.add(listener)
  return () => queueListeners.delete(listener)
}

export function readQueueSnapshot(): string {
  try {
    return sessionStorage.getItem(QUEUE_STORAGE_KEY) ?? queueMemoryFallback
  } catch {
    return queueMemoryFallback
  }
}

export function getServerQueueSnapshot(): string {
  return "[]"
}

export function parseQueue(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : []
  } catch {
    return []
  }
}

export function enqueueTopic(topic: string) {
  const current = parseQueue(readQueueSnapshot())
  const next = [
    topic,
    ...current.filter((item) => item.toLowerCase() !== topic.toLowerCase()),
  ].slice(0, QUEUE_LIMIT)
  const raw = JSON.stringify(next)
  queueMemoryFallback = raw
  try {
    sessionStorage.setItem(QUEUE_STORAGE_KEY, raw)
  } catch {
    // Storage full or blocked, the in-memory fallback still works for this view.
  }
  for (const listener of queueListeners) listener()
}
