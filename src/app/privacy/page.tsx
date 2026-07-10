import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Clyveris",
  description: "How Clyveris handles data on the desk and in the research agent.",
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <header className="mx-auto flex max-w-[1440px] items-center justify-between border-b px-5 py-4 sm:px-8">
        <Link href="/" className="font-mono text-sm font-bold tracking-[-0.08em]">CLYVERIS</Link>
        <Link href="/" className="font-mono text-[11px] uppercase tracking-[0.12em] underline underline-offset-4">Home</Link>
      </header>
      <article className="mx-auto max-w-[760px] px-5 py-14 sm:px-8 sm:py-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--croo)]">Privacy Policy</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">We collect almost nothing. Here is the almost.</h1>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--muted)]">Effective 10 July 2026</p>

        <div className="mt-10 space-y-8 leading-7">
          <section>
            <h2 className="text-xl font-semibold tracking-[-0.03em]">The desk</h2>
            <p className="mt-3 text-[var(--muted)]">
              The Clyveris site has no accounts or sign-up. The sample brief form runs entirely in your browser and sends
              nothing to Clyveris. We do not collect names, email addresses, or other personal information from visitors.
              We currently run no analytics and set no tracking cookies.
            </p>
            <p className="mt-3 text-[var(--muted)]">
              When you bookmark a signal, that choice is stored in your browser&apos;s session storage on your own device. It
              never leaves your browser, and it clears when your session ends.
            </p>
            <p className="mt-3 text-[var(--muted)]">
              Our hosting provider (Vercel) processes standard technical request data, such as IP addresses and browser
              user agents, to serve and secure the site. We do not use this data to identify visitors.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.03em]">The research agent</h2>
            <p className="mt-3 text-[var(--muted)]">
              When another party orders research through the CROO Agent Protocol, we process the content of the brief and
              generate a deliverable in order to fulfil that order. Order records, including the brief, order identifiers,
              and transaction references, are retained by the agent to track delivery and resolve disputes.
            </p>
            <p className="mt-3 text-[var(--muted)]">
              Payments settle on Base, a public blockchain. Transactions there are public, permanent, and outside our
              control. Do not include personal, confidential, or sensitive information in a research brief.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.03em]">Third parties</h2>
            <p className="mt-3 text-[var(--muted)]">
              The desk links to original source publications. Following those links takes you to sites governed by their
              own privacy policies. The agent service operates on infrastructure run by CROO, whose own terms and policies
              apply to the marketplace itself.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.03em]">Changes and contact</h2>
            <p className="mt-3 text-[var(--muted)]">
              If this policy changes, the new version will be posted here with an updated effective date. Questions go to
              splashmediahub@gmail.com.
            </p>
          </section>
        </div>
      </article>
      <SiteFooter />
    </main>
  )
}
