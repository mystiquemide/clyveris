// Saved signals live in sessionStorage (with an in-memory fallback when
// storage is blocked), exposed as an external store so SSR, hydration,
// and reloads all agree on the value.
export const SAVED_STORAGE_KEY = "clyveris:saved-signals"

let savedMemoryFallback = "[]"
const savedListeners = new Set<() => void>()

export function subscribeSaved(listener: () => void) {
  savedListeners.add(listener)
  return () => savedListeners.delete(listener)
}

export function readSavedSnapshot(): string {
  try {
    return sessionStorage.getItem(SAVED_STORAGE_KEY) ?? savedMemoryFallback
  } catch {
    return savedMemoryFallback
  }
}

export function getServerSavedSnapshot(): string {
  return "[]"
}

export function parseSaved(raw: string): Set<string> {
  try {
    return new Set<string>(JSON.parse(raw))
  } catch {
    return new Set<string>()
  }
}

export function writeSaved(ids: Set<string>) {
  const raw = JSON.stringify([...ids])
  savedMemoryFallback = raw
  try {
    sessionStorage.setItem(SAVED_STORAGE_KEY, raw)
  } catch {
    // Storage full or blocked, the in-memory fallback still works for this view.
  }
  for (const listener of savedListeners) listener()
}
