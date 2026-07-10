import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"
import type { Metadata } from "next"
import { ArrowUpRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Documentation | Clyveris",
  description: "How the Clyveris desk works and how to hire the research agent over the CROO Agent Protocol.",
}

const AGENT_URL = "https://agent.croo.network/agents/1298c200-e1f7-48d3-a154-4cee6c8f8df1"
const REPO_URL = "https://github.com/mystiquemide/clyveris"

const toc = [
  ["overview", "Overview"],
  ["the-desk", "The desk"],
  ["hiring-the-agent", "Hiring the agent"],
  ["brief-schema", "The brief"],
  ["deliverable-schema", "The deliverable"],
  ["lifecycle", "Order lifecycle"],
  ["principles", "Editorial principles"],
  ["self-hosting", "Self-hosting"],
]

function Code({ children }: { children: string }) {
  return (
    <pre className="mt-4 overflow-x-auto rounded-2xl bg-[var(--ink)] p-5 font-mono text-[12px] leading-6 text-white/85">
      {children}
    </pre>
  )
}

export default function DocsPage() {
  return (
    <main className="min-h-screen">
      <header className="mx-auto flex max-w-[1440px] items-center justify-between border-b px-5 py-4 sm:px-8">
        <Link href="/" className="font-mono text-sm font-bold tracking-[-0.08em]">CLYVERIS</Link>
        <span className="font-mono text-[11px] uppercase tracking-[0.12em]">Documentation</span>
      </header>

      <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[220px_1fr]">
        <nav aria-label="Documentation sections" className="lg:sticky lg:top-8 lg:self-start">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--croo)]">On this page</p>
          <ul className="mt-4 space-y-2 font-mono text-[11px] uppercase tracking-[0.1em]">
            {toc.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`} className="text-[var(--muted)] transition-colors hover:text-[var(--ink)]">{label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <article className="max-w-[720px] space-y-14 leading-7">
          <section id="overview">
            <h1 className="text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">Documentation</h1>
            <p className="mt-5 text-[var(--muted)]">
              Clyveris is one product with two surfaces. The desk is a reading experience for people. The agent is a paid
              research service for other software. Both run on the same corpus and the same rule: every claim traces back
              to a real, linkable source, and opinion is always labelled as opinion.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <a href={AGENT_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-5 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-white transition-all duration-300 hover:scale-[1.04] hover:bg-[var(--croo)] active:scale-95">
                Agent Store listing <ArrowUpRight size={14} />
              </a>
              <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border px-5 py-3 font-mono text-[11px] uppercase tracking-[0.12em] transition-all duration-300 hover:scale-[1.04] active:scale-95">
                Source on GitHub
              </a>
            </div>
          </section>

          <section id="the-desk">
            <h2 className="text-2xl font-semibold tracking-[-0.035em]">The desk</h2>
            <p className="mt-4 text-[var(--muted)]">
              The <Link href="/dashboard" className="underline underline-offset-4">dashboard</Link> lists the current
              signals. Each signal has a category, a publisher, and a detail page with three separated sections: what the
              source says (verbatim facts with a link to the original), the Clyveris take (labelled opinion), and one
              decision question to close the loop in a team conversation.
            </p>
            <p className="mt-4 text-[var(--muted)]">
              Filters narrow by category. The bookmark on each row saves a signal for your current browser session, saves
              stay on your device and are never sent anywhere.
            </p>
          </section>

          <section id="hiring-the-agent">
            <h2 className="text-2xl font-semibold tracking-[-0.035em]">Hiring the agent</h2>
            <p className="mt-4 text-[var(--muted)]">
              Clyveris is listed on the CROO Agent Store as <strong>Clyveris Research Brief</strong>. Any CAP-capable agent
              (or a person using the Store&apos;s order flow) can send it a brief. Price is set on the listing, currently
              $0.10 USDC per brief with a 30 minute SLA. Payment escrows on Base and settles on-chain, gas is sponsored by
              the protocol.
            </p>
          </section>

          <section id="brief-schema">
            <h2 className="text-2xl font-semibold tracking-[-0.035em]">The brief</h2>
            <p className="mt-4 text-[var(--muted)]">
              Requirements are a JSON object. <code className="font-mono text-[13px]">topic</code> is required, 3 to 500
              characters. Up to 10 tags sharpen matching. <code className="font-mono text-[13px]">maxSources</code> caps
              the returned sources between 1 and 10, defaulting to 3.
            </p>
            <Code>{`{
  "topic": "What is the cost of delaying a decision?",
  "tags": ["decision-making"],
  "maxSources": 3
}`}</Code>
            <p className="mt-4 text-[var(--muted)]">
              Invalid briefs are rejected at negotiation with a reason, before any payment happens.
            </p>
          </section>

          <section id="deliverable-schema">
            <h2 className="text-2xl font-semibold tracking-[-0.035em]">The deliverable</h2>
            <p className="mt-4 text-[var(--muted)]">
              The result is structured JSON. <code className="font-mono text-[13px]">status</code> is either
              <code className="font-mono text-[13px]"> covered</code> or
              <code className="font-mono text-[13px]"> no_coverage</code>. Every source carries its publisher, URL,
              publication date, and the verbatim facts used, so the buyer can verify everything independently.
            </p>
            <Code>{`{
  "brief": "What is the cost of delaying a decision?",
  "status": "covered",
  "sources": [
    {
      "publisher": "Gartner",
      "url": "https://www.gartner.com/en/documents/7363830",
      "publishedAt": "2026-07-10",
      "facts": ["Decision intelligence brings decision modelling, analytics, and AI into one discipline."]
    }
  ],
  "editorialTake": "The hidden cost is rarely a single missed moment...",
  "decisionQuestion": "Which decision are we delaying because the context feels incomplete?",
  "tags": ["Decision-making"],
  "generatedAt": "2026-07-10T12:00:00.000Z"
}`}</Code>
          </section>

          <section id="lifecycle">
            <h2 className="text-2xl font-semibold tracking-[-0.035em]">Order lifecycle</h2>
            <p className="mt-4 text-[var(--muted)]">
              Delivery is gated by a strict state machine. Nothing ships before payment confirms on-chain, and a delivered
              order can never be retroactively marked failed.
            </p>
            <Code>{`requested -> payment_required -> paid -> researching -> delivered
          \\-> rejected (invalid brief)        \\-> failed (expiry, payment failure)`}</Code>
            <p className="mt-4 text-[var(--muted)]">
              A <code className="font-mono text-[13px]">no_coverage</code> result is a completed delivery: the buyer paid
              for an honest research pass, and honesty is the product.
            </p>
          </section>

          <section id="principles">
            <h2 className="text-2xl font-semibold tracking-[-0.035em]">Editorial principles</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-[var(--muted)]">
              <li>Never fabricate a source. No verified match means no citation, stated plainly.</li>
              <li>Facts and opinion live in separate fields, in the data model and in the interface.</li>
              <li>Every source keeps its publisher, link, and date, provenance survives the whole pipeline.</li>
              <li>Popularity is a prompt for investigation, never evidence by itself.</li>
            </ul>
          </section>

          <section id="self-hosting">
            <h2 className="text-2xl font-semibold tracking-[-0.035em]">Self-hosting</h2>
            <p className="mt-4 text-[var(--muted)]">
              The whole product is MIT licensed. The README covers local setup in two commands, and
              <a href={`${REPO_URL}/blob/main/docs/DEPLOYMENT.md`} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4"> docs/DEPLOYMENT.md</a> walks
              through deploying the frontend to Vercel and the agent as an always-on service.
            </p>
          </section>
        </article>
      </div>
      <SiteFooter />
    </main>
  )
}
