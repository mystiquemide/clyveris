import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | Clyveris",
  description: "The terms that govern the Clyveris desk and the paid research agent.",
}

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <header className="mx-auto flex max-w-[1440px] items-center justify-between border-b px-5 py-4 sm:px-8">
        <Link href="/" className="font-mono text-sm font-bold tracking-[-0.08em]">CLYVERIS</Link>
        <Link href="/" className="font-mono text-[10px] uppercase tracking-[0.12em] underline underline-offset-4">Home</Link>
      </header>
      <article className="mx-auto max-w-[760px] px-5 py-14 sm:px-8 sm:py-20">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--croo)]">Terms of Service</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">Short, readable, and in plain language.</h1>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">Effective 10 July 2026</p>

        <div className="mt-10 space-y-8 leading-7">
          <section>
            <h2 className="text-xl font-semibold tracking-[-0.03em]">1. What Clyveris is</h2>
            <p className="mt-3 text-[var(--muted)]">
              Clyveris is an editorial signal desk and a paid research agent on the CROO Agent Protocol. By using the site
              or ordering research from the agent, you agree to these terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.03em]">2. Editorial content is opinion, not advice</h2>
            <p className="mt-3 text-[var(--muted)]">
              Every signal separates what a source says from what Clyveris thinks. Source facts belong to their original
              publishers, and each signal links to the original. The editorial take and decision question are opinion and
              context, not financial, legal, medical, or other professional advice. Decisions you make remain your own.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.03em]">3. The research service</h2>
            <p className="mt-3 text-[var(--muted)]">
              Research orders run through the CROO Agent Protocol: you submit a brief, Clyveris accepts or rejects it,
              payment is escrowed in USDC on Base, and the deliverable is sent after payment confirms on-chain. Settlement
              and escrow are governed by the protocol, and blockchain transactions are irreversible.
            </p>
            <p className="mt-3 text-[var(--muted)]">
              You are paying for an honest research pass over verified sources, not for a guaranteed answer. When nothing
              verified matches your brief, the deliverable says so plainly with a no-coverage status. Clyveris never
              invents a citation, and a no-coverage result is a completed delivery.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.03em]">4. Acceptable use</h2>
            <p className="mt-3 text-[var(--muted)]">
              Do not use the site or the agent to violate the law, to probe or disrupt the service, or to submit briefs
              containing content you have no right to share. We may reject any brief.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.03em]">5. No warranty</h2>
            <p className="mt-3 text-[var(--muted)]">
              The site and the agent are provided as is, without warranty of any kind. To the maximum extent permitted by
              law, Clyveris is not liable for indirect or consequential damages arising from use of the site, the agent,
              or reliance on any signal. The source code is available under the MIT license, which carries its own terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.03em]">6. Changes and contact</h2>
            <p className="mt-3 text-[var(--muted)]">
              If these terms change, the new version will be posted here with an updated effective date. Questions go to
              splashmediahub@gmail.com.
            </p>
          </section>
        </div>
      </article>
    </main>
  )
}
