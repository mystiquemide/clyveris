import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Compass, Layers, Newspaper } from "lucide-react"
import { IntroSplash } from "@/components/intro-splash"
import { Reveal } from "@/components/reveal"
import { WordReveal } from "@/components/word-reveal"
import { signals } from "@/lib/signals"

const cta =
  "inline-flex items-center gap-2 rounded-full px-5 py-3 font-mono text-[11px] uppercase tracking-[0.12em] transition-all duration-300 hover:scale-[1.04] active:scale-95"

const AGENT_URL = "https://agent.croo.network/agents/1298c200-e1f7-48d3-a154-4cee6c8f8df1"
const REPO_URL = "https://github.com/mystiquemide/clyveris"

const method = [
  {
    icon: Newspaper,
    title: "The source stays close",
    copy: "Every signal carries its publisher, link, and publication date. You can always check the original before you act on it.",
  },
  {
    icon: Layers,
    title: "Facts split from the take",
    copy: "What the source says and what Clyveris thinks live in separate fields and separate sections. The line never blurs.",
  },
  {
    icon: Compass,
    title: "A question to decide with",
    copy: "Each signal ends in one decision question, so the reading turns into a conversation your team can actually close.",
  },
]

function PillNav() {
  return (
    <nav className="fixed left-1/2 top-4 z-50 flex -translate-x-1/2 items-center gap-6 rounded-full bg-white/90 py-2.5 pl-5 pr-2.5 shadow-lg shadow-black/5 backdrop-blur">
      <Link href="/" className="font-mono text-sm font-bold tracking-[-0.08em] text-[var(--ink)]">CLYVERIS</Link>
      <div className="hidden items-center gap-5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--muted)] sm:flex">
        <a href="#method" className="transition-colors hover:text-[var(--ink)]">Method</a>
        <a href="#agent" className="transition-colors hover:text-[var(--ink)]">Agent</a>
        <a href="#signals" className="transition-colors hover:text-[var(--ink)]">Signals</a>
      </div>
      <Link
        href="/dashboard"
        className="rounded-full bg-[var(--ink)] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-white transition-colors hover:bg-[var(--croo)]"
      >
        Open desk
      </Link>
    </nav>
  )
}

function Hero() {
  return (
    <header className="relative flex min-h-[94vh] flex-col justify-end overflow-hidden">
      <Image
        src="/hero-desk.jpg"
        alt="A reader enjoying the morning paper by a sunny window"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/35" />
      <div className="relative mx-auto w-full max-w-[1440px] px-5 pb-40 pt-44 text-center sm:px-8">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">Independent intelligence</p>
        </Reveal>
        <Reveal delay={120}>
          <h1 className="mx-auto mt-6 max-w-5xl text-[clamp(3.2rem,8.5vw,7.5rem)] font-semibold leading-[0.9] tracking-[-0.05em] text-white">
            See the shift before it becomes obvious
          </h1>
        </Reveal>
        <Reveal delay={240}>
          <p className="mx-auto mt-8 max-w-xl text-lg leading-7 text-white/80">
            Clyveris is an editorial signal desk that keeps the original source, the take, and the decision in one place.
          </p>
        </Reveal>
      </div>
      <Reveal delay={360} className="absolute inset-x-0 bottom-8 flex justify-center px-5">
        <div className="flex flex-col items-center gap-3 rounded-full bg-black/55 p-2 pl-2 backdrop-blur sm:flex-row sm:gap-5 sm:pl-6">
          <p className="px-4 pt-2 text-center text-sm text-white/90 sm:px-0 sm:pt-0">
            Source facts. Editorial take. One decision question.
          </p>
          <Link href="/dashboard" className={`${cta} bg-white text-[var(--ink)] hover:bg-[var(--croo)] hover:text-white`}>
            Open the desk <ArrowUpRight size={14} />
          </Link>
        </div>
      </Reveal>
    </header>
  )
}

function SplitSection() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-20 sm:py-28">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--croo)]">The desk</p>
        <h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-6xl">Less noise in. More conviction out.</h2>
      </Reveal>
      <Reveal delay={150} className="relative mt-12 overflow-hidden rounded-[40px]">
        <div className="relative min-h-[70vh]">
          <Image
            src="/signal-review.jpg"
            alt="A reader holding a broadsheet open against a bright window"
            fill
            sizes="(max-width: 1440px) 100vw, 1440px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-x-5 bottom-8 space-y-3 sm:inset-x-12 sm:bottom-12">
            <div className="max-w-2xl overflow-hidden rounded-2xl bg-black/45 backdrop-blur">
              <div className="bar-fill flex items-center justify-between gap-6 rounded-2xl bg-white/85 px-5 py-4">
                <span className="font-semibold text-[var(--ink)]">What the source says</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">Verified, linked, dated</span>
              </div>
            </div>
            <div className="max-w-xl overflow-hidden rounded-2xl bg-black/45 backdrop-blur">
              <div className="bar-fill flex items-center justify-between gap-6 rounded-2xl bg-[var(--croo)]/90 px-5 py-4 text-white">
                <span className="font-semibold">The Clyveris take</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/70">Clearly labelled opinion</span>
              </div>
            </div>
            <p className="pt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/80">Kept separate. Always.</p>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

function MethodSection() {
  return (
    <section id="method" className="mx-auto max-w-[1440px] px-4 py-16 sm:px-8 sm:py-24">
      <Reveal>
        <h2 className="max-w-4xl text-[clamp(2.6rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.05em]">
          <WordReveal text="Most feeds add noise. Clyveris is built differently." />
        </h2>
      </Reveal>
      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {method.map((item, index) => (
          <Reveal key={item.title} delay={index * 120}>
            <article className="flex h-full flex-col rounded-3xl bg-[var(--card)] p-8">
              <item.icon size={26} className="text-[var(--ink)]" />
              <h3 className="mt-24 text-xl font-semibold tracking-[-0.03em]">{item.title}</h3>
              <p className="mt-3 leading-6 text-[var(--muted)]">{item.copy}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function AgentSection() {
  const example = signals[0]
  return (
    <section id="agent" className="mx-auto max-w-[1440px] px-4 pb-20 sm:pb-28">
      <div className="relative overflow-hidden rounded-[40px] bg-[var(--ink)]">
        <Image
          src="/agent-night.jpg"
          alt="A desk lit for late reading, seen through a night window"
          fill
          sizes="(max-width: 1440px) 100vw, 1440px"
          className="object-cover opacity-35"
        />
        <div className="relative grid gap-12 px-6 py-16 sm:px-12 sm:py-24 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <Reveal>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">Also on CROO</p>
              <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-white sm:text-6xl">
                A research agent other agents can hire
              </h2>
              <p className="mt-6 max-w-md leading-7 text-white/70">
                Send Clyveris a research brief over the CROO Agent Protocol and it returns sources you can check yourself,
                paid in USDC and settled on-chain. When it can&apos;t verify a source, it says so instead of inventing one.
              </p>
            </Reveal>
            <Reveal delay={150} className="mt-9 flex flex-wrap items-center gap-4">
              <a href={AGENT_URL} target="_blank" rel="noopener noreferrer" className={`${cta} bg-white text-[var(--ink)] hover:bg-[var(--croo)] hover:text-white`}>
                Hire Clyveris on CROO <ArrowUpRight size={14} />
              </a>
              <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className={`${cta} border border-white/25 text-white hover:border-white hover:bg-white/10`}>
                See the code
              </a>
            </Reveal>
          </div>
          <Reveal delay={220}>
            <div className="rounded-3xl border border-white/15 bg-white/5 p-6 font-mono text-[12px] leading-6 text-white/80 backdrop-blur">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/50">Example deliverable</p>
              <div className="mt-4 space-y-2">
                <p><span className="text-white/50">brief</span> {example.decisionQuestion}</p>
                <p><span className="text-white/50">status</span> covered</p>
                <p><span className="text-white/50">source</span> {example.source.publisher} · {example.source.publishedAt}</p>
                <p><span className="text-white/50">fact</span> {example.sourceFacts[0]}</p>
                <p><span className="text-white/50">take</span> {example.editorialTake}</p>
              </div>
              <p className="mt-5 border-t border-white/10 pt-4 text-[10px] uppercase tracking-[0.14em] text-white/50">
                Delivered after payment confirms on Base
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function SignalsSection() {
  return (
    <section id="signals" className="mx-auto max-w-[1440px] px-4 pb-24 sm:px-8">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--croo)]">On the desk now</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">This week&apos;s read</h2>
        </div>
        <Link href="/dashboard" className="font-mono text-[11px] uppercase tracking-[0.12em] underline underline-offset-4">
          Open the full desk
        </Link>
      </Reveal>
      <div className="mt-10 divide-y border-y">
        {signals.map((signal, index) => (
          <Reveal key={signal.id} delay={index * 100}>
            <Link href={`/signals/${signal.slug}`} className="group grid gap-4 py-8 md:grid-cols-[80px_1fr_auto] md:items-center">
              <span className="font-mono text-[10px] text-[var(--croo)]">0{index + 1}</span>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">
                  {signal.label} · {signal.source.publisher}
                </p>
                <h3 className="mt-2 max-w-2xl text-2xl font-medium tracking-[-0.035em] underline-offset-4 group-hover:underline sm:text-3xl">
                  {signal.title}
                </h3>
              </div>
              <ArrowUpRight size={20} className="hidden transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 md:block" />
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="relative px-4 pb-4">
      <Reveal>
        <p className="pointer-events-none mx-auto max-w-[1440px] text-center text-[clamp(3rem,9vw,9rem)] font-semibold leading-[0.9] tracking-[-0.05em] text-[var(--ghost)]">
          Clearer signals, better rooms
        </p>
      </Reveal>
      <div className="mx-auto -mt-6 max-w-[1440px] rounded-[32px] bg-[var(--ink)] px-6 py-12 text-white sm:px-12">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-mono text-lg font-bold tracking-[-0.08em]">CLYVERIS</p>
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/60">
              An editorial signal desk, and a paid research agent on the CROO Agent Store.
            </p>
            <Link href="/dashboard" className={`${cta} mt-7 bg-white text-[var(--ink)] hover:bg-[var(--croo)] hover:text-white`}>
              Open the desk <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="font-mono text-[11px] uppercase tracking-[0.12em]">
            <p className="text-white/40">Site</p>
            <ul className="mt-4 space-y-3">
              <li><Link href="/" className="transition-colors hover:text-[var(--croo)]">Home</Link></li>
              <li><Link href="/dashboard" className="transition-colors hover:text-[var(--croo)]">The desk</Link></li>
              <li><a href="#method" className="transition-colors hover:text-[var(--croo)]">Method</a></li>
            </ul>
          </div>
          <div className="font-mono text-[11px] uppercase tracking-[0.12em]">
            <p className="text-white/40">Agent</p>
            <ul className="mt-4 space-y-3">
              <li>
                <a href={AGENT_URL} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[var(--croo)]">
                  CROO Agent Store
                </a>
              </li>
              <li>
                <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[var(--croo)]">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-14 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 font-mono text-[10px] uppercase tracking-[0.12em] text-white/40 sm:flex-row">
          <span>© 2026 Clyveris. MIT licensed.</span>
          <span>Source. Context. Decision.</span>
        </div>
      </div>
    </footer>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <IntroSplash />
      <PillNav />
      <Hero />
      <SplitSection />
      <MethodSection />
      <AgentSection />
      <SignalsSection />
      <Footer />
    </main>
  )
}
