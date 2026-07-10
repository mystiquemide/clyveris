"use client"

import Link from "next/link"
import { Bookmark, SlidersHorizontal } from "lucide-react"
import { useMemo, useState } from "react"
import { filterSignals, signals, type SignalCategory } from "@/lib/signals"

const filters: { value: SignalCategory | "all" | "saved"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "operating-environment", label: "Operating" },
  { value: "category-watch", label: "Category" },
  { value: "people-signal", label: "People" },
  { value: "saved", label: "Saved" },
]

export function SignalDesk() {
  const [filter, setFilter] = useState<(typeof filters)[number]["value"]>("all")
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const visibleSignals = useMemo(() => filterSignals(signals, filter, savedIds), [filter, savedIds])

  function toggleSaved(id: string) {
    setSavedIds((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[220px_1fr]">
      <aside className="border-b p-5 lg:min-h-[calc(100vh-57px)] lg:border-b-0 lg:border-r">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--croo)]">Thursday<br />July 10</p>
        <nav className="mt-12 space-y-1 font-mono text-[10px] uppercase tracking-[0.12em]">
          <a className="block bg-[var(--croo)] px-3 py-3 text-white" href="#top">Today&apos;s read</a>
          <a className="block px-3 py-3" href="#watchlist">Watchlist</a>
        </nav>
      </aside>
      <section className="p-5 sm:p-8 lg:p-12" id="top">
        <div className="flex items-end justify-between border-b pb-7"><div><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--croo)]">Your signal desk</p><h1 className="mt-3 text-4xl font-medium tracking-[-0.065em] sm:text-6xl">Today&apos;s read.</h1></div><span className="hidden font-mono text-[10px] uppercase tracking-[0.12em] text-[#65685e] sm:block">{visibleSignals.length} items selected</span></div>
        <div className="mt-5 flex flex-wrap gap-2" aria-label="Filter signals"><SlidersHorizontal size={16} className="mt-2 text-[var(--croo)]" />{filters.map((item) => <button key={item.value} aria-pressed={filter === item.value} onClick={() => setFilter(item.value)} className="min-h-11 border px-3 font-mono text-[10px] uppercase tracking-[0.1em] aria-pressed:bg-[var(--croo)] aria-pressed:text-white">{item.label}</button>)}</div>
        <div className="divide-y">{visibleSignals.map((signal, index) => <article key={signal.id} className="group grid gap-5 py-8 md:grid-cols-[70px_1fr_auto]"><span className="font-mono text-[10px] text-[var(--croo)]">0{index + 1}</span><div><p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#65685e]">{signal.label} · {signal.source.publisher}</p><Link href={`/signals/${signal.slug}`} className="mt-3 block max-w-2xl text-2xl font-medium tracking-[-0.05em] underline-offset-4 hover:underline sm:text-3xl">{signal.title}</Link><p className="mt-3 max-w-xl leading-6 text-[#65685e]">{signal.summary}</p></div><button onClick={() => toggleSaved(signal.id)} aria-label={`${savedIds.has(signal.id) ? "Remove" : "Save"} ${signal.title}`} aria-pressed={savedIds.has(signal.id)} className="min-h-11 min-w-11 self-start"><Bookmark fill={savedIds.has(signal.id) ? "currentColor" : "none"} size={18} /></button></article>)}</div>
        {visibleSignals.length === 0 && <div className="border-b py-12"><p className="text-xl">Nothing matches this view.</p><button onClick={() => setFilter("all")} className="mt-4 min-h-11 font-mono text-[10px] uppercase tracking-[0.12em] underline underline-offset-4">Show all signals</button></div>}
        <section id="watchlist" className="mt-10 border-t py-6"><p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--croo)]">Watchlist</p><p className="mt-4 text-lg tracking-[-0.035em]">{savedIds.size ? `${savedIds.size} saved signal${savedIds.size === 1 ? "" : "s"} for this session.` : "Save a signal to keep it in this browser session."}</p></section>
      </section>
    </div>
  )
}
