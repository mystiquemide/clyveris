"use client"

import { useMemo, useState, useSyncExternalStore } from "react"
import { ArrowUpRight, Bookmark, Copy, Link2 } from "lucide-react"
import {
  getServerSavedSnapshot,
  parseSaved,
  readSavedSnapshot,
  subscribeSaved,
  writeSaved,
} from "@/lib/saved-signals"

const AGENT_URL = "https://agent.croo.network/agents/1298c200-e1f7-48d3-a154-4cee6c8f8df1"

type Props = {
  id: string
  title: string
  question: string
  slug: string
}

const actionClass =
  "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 font-mono text-xs uppercase tracking-[0.1em] transition-all duration-300 hover:border-[var(--croo)] hover:text-[var(--croo)] active:scale-95"

export function SignalActions({ id, title, question, slug }: Props) {
  const savedRaw = useSyncExternalStore(subscribeSaved, readSavedSnapshot, getServerSavedSnapshot)
  const savedIds = useMemo(() => parseSaved(savedRaw), [savedRaw])
  const saved = savedIds.has(id)
  const [copied, setCopied] = useState<"question" | "link" | null>(null)

  function toggleSaved() {
    const next = new Set(savedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    writeSaved(next)
  }

  async function copy(kind: "question" | "link") {
    const url = `${window.location.origin}/signals/${slug}`
    const text = kind === "question" ? question : url
    try {
      if (kind === "link" && navigator.share) {
        await navigator.share({ title, url })
        return
      }
      await navigator.clipboard.writeText(text)
      setCopied(kind)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      // Clipboard blocked, nothing to clean up.
    }
  }

  return (
    <section className="mt-12 border-t pt-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--croo)]">Take it with you</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button onClick={toggleSaved} aria-pressed={saved} className={actionClass}>
          <Bookmark size={14} fill={saved ? "currentColor" : "none"} />
          {saved ? "Saved to watchlist" : "Save to watchlist"}
        </button>
        <button onClick={() => copy("question")} className={actionClass}>
          <Copy size={14} />
          {copied === "question" ? "Question copied" : "Copy decision question"}
        </button>
        <button onClick={() => copy("link")} className={actionClass}>
          <Link2 size={14} />
          {copied === "link" ? "Link copied" : "Share this signal"}
        </button>
        <a
          href={AGENT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--ink)] px-5 font-mono text-xs uppercase tracking-[0.1em] text-white transition-all duration-300 hover:scale-[1.03] hover:bg-[var(--croo)] active:scale-95"
        >
          Research this deeper on CROO <ArrowUpRight size={14} />
        </a>
      </div>
    </section>
  )
}
