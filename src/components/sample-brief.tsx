"use client"

import { useMemo, useState } from "react"
import { ArrowUpRight, Play } from "lucide-react"
import { researchBrief } from "../../agent/research"
import { signals } from "@/lib/signals"

const examples = [
  "The cost of waiting on a decision",
  "What teams say versus what they fund",
  "Quantum submarine logistics",
]

export function SampleBrief({ agentUrl }: { agentUrl: string }) {
  const [topic, setTopic] = useState("")
  const [submitted, setSubmitted] = useState<string | null>(null)

  const result = useMemo(
    () => (submitted ? researchBrief({ topic: submitted }, signals) : null),
    [submitted],
  )

  function run(value: string) {
    const trimmed = value.trim()
    if (trimmed.length < 3) return
    setTopic(trimmed)
    setSubmitted(trimmed)
  }

  return (
    <div className="rounded-[32px] border bg-white/60 p-6 sm:p-10">
      <div className="flex flex-wrap gap-2">
        {examples.map((example) => (
          <button
            key={example}
            onClick={() => run(example)}
            className="rounded-full border px-4 py-2.5 font-mono text-xs uppercase tracking-[0.08em] transition-all duration-300 hover:border-[var(--croo)] hover:text-[var(--croo)] active:scale-95"
          >
            {example}
          </button>
        ))}
      </div>
      <form
        className="mt-5 flex flex-col gap-3 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault()
          run(topic)
        }}
      >
        <input
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
          maxLength={120}
          placeholder="Or type your own research topic"
          aria-label="Research topic"
          className="min-h-12 flex-1 rounded-full border bg-white px-5 font-mono text-sm outline-none transition-colors focus:border-[var(--croo)]"
        />
        <button
          type="submit"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--ink)] px-6 font-mono text-xs uppercase tracking-[0.12em] text-white transition-all duration-300 hover:scale-[1.03] hover:bg-[var(--croo)] active:scale-95"
        >
          Run the brief <Play size={13} />
        </button>
      </form>

      {result && (
        <div className="mt-8 rounded-3xl bg-[var(--ink)] p-6 font-mono text-[13px] leading-6 text-white/85 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[11px] uppercase tracking-[0.16em] text-white/50">Deliverable</p>
            <span
              className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.1em] ${
                result.status === "covered" ? "bg-[var(--croo)] text-white" : "bg-white/15 text-white"
              }`}
            >
              {result.status === "covered" ? "Covered" : "No coverage"}
            </span>
          </div>
          <div className="mt-5 space-y-4">
            {result.sources.map((source) => (
              <div key={source.url} className="rounded-2xl bg-white/5 p-4">
                <p className="text-[11px] uppercase tracking-[0.12em] text-white/50">
                  Source · {source.publisher} · {source.publishedAt}
                </p>
                <ul className="mt-2 space-y-1">
                  {source.facts.map((fact) => (
                    <li key={fact}>{fact}</li>
                  ))}
                </ul>
                <a href={source.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.1em] text-white/60 underline underline-offset-4 hover:text-white">
                  Verify the original <ArrowUpRight size={11} />
                </a>
              </div>
            ))}
            <p><span className="text-white/50">take · </span>{result.editorialTake}</p>
            <p><span className="text-white/50">decision question · </span>{result.decisionQuestion}</p>
          </div>
          <p className="mt-6 border-t border-white/10 pt-4 text-[12px] text-white/60">
            {result.status === "covered"
              ? "This ran the agent's real matching pipeline on the real corpus, right here in your browser. The paid version settles in USDC on Base."
              : "Nothing verified matches this topic, so Clyveris says so instead of inventing a citation. Honesty is the deliverable."}
          </p>
          <a
            href={agentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs uppercase tracking-[0.12em] text-[var(--ink)] transition-all duration-300 hover:scale-[1.04] hover:bg-[var(--croo)] hover:text-white active:scale-95"
          >
            Order the paid version on CROO <ArrowUpRight size={13} />
          </a>
        </div>
      )}
    </div>
  )
}
