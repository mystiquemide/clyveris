import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

const briefs = [
  ["01", "THE WEEK IN VIEW", "Four movements that changed the conversation."],
  ["02", "WHAT'S FORMING", "A closer read on the signals gaining force."],
  ["03", "THE OPEN QUESTION", "The decision worth keeping in view."],
]

export default function Home() {
  return (
    <main className="min-h-screen">
      <nav className="mx-auto flex max-w-[1440px] items-center justify-between border-b px-5 py-4 sm:px-8">
        <Link href="/" className="font-mono text-sm font-bold tracking-[-0.08em]">CLYVERIS</Link>
        <div className="hidden items-center gap-7 font-mono text-[10px] uppercase tracking-[0.14em] sm:flex">
          <a href="#brief">The brief</a>
          <a href="#method">Method</a>
        </div>
        <Link href="/dashboard" className="bg-[var(--ink)] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--paper)] transition-colors hover:bg-[var(--croo)]">
          Enter desk
        </Link>
      </nav>

      <section className="mx-auto grid max-w-[1440px] border-b lg:grid-cols-[1fr_2.05fr_1fr]">
        <div className="hidden border-r p-8 lg:block">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--croo)]">Issue No. 001</p>
          <p className="mt-24 max-w-[14rem] text-sm leading-6">A signal desk for people who need to notice the shift before it becomes obvious.</p>
        </div>
        <div className="px-5 py-20 sm:px-10 sm:py-28 lg:px-14">
          <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--croo)]">Independent intelligence</p>
          <h1 className="max-w-4xl text-[clamp(3.6rem,9vw,9rem)] font-semibold leading-[0.82] tracking-[-0.085em]">Make the next move with context.</h1>
          <p className="mt-10 max-w-xl text-lg leading-7 text-[#53564d]">Clyveris turns fragmented signals into a clear editorial view, so teams can see what matters, discuss it properly, and act without chasing noise.</p>
          <div className="mt-10 flex items-center gap-4">
            <Link href="/dashboard" className="inline-flex items-center gap-5 bg-[var(--croo)] px-5 py-3 font-mono text-xs uppercase tracking-[0.12em] text-white hover:bg-[var(--croo-dark)]">Open the desk <ArrowUpRight size={16} /></Link>
            <a href="#brief" className="font-mono text-xs uppercase tracking-[0.12em] underline underline-offset-4">Read the brief</a>
          </div>
        </div>
        <aside className="border-l p-5 sm:p-8">
          <div className="flex items-center justify-between border-b pb-3 font-mono text-[10px] uppercase tracking-[0.14em]"><span>Field note</span><span className="text-[var(--croo)]">Live</span></div>
          <p className="mt-8 text-3xl font-medium leading-[1.02] tracking-[-0.06em]">Clarity isn&apos;t more information. It&apos;s a point of view.</p>
          <div className="mt-16 border-t pt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-[#65685e]">Built for the people in the room when decisions get made.</div>
        </aside>
      </section>

      <section id="brief" className="mx-auto max-w-[1440px] border-b px-5 py-16 sm:px-8 sm:py-24">
        <div className="mb-12 flex items-end justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--croo)]">The Clyveris brief</p><h2 className="mt-3 text-4xl font-medium tracking-[-0.065em] sm:text-5xl">A tighter reading.</h2></div><span className="hidden font-mono text-[10px] uppercase tracking-[0.14em] sm:block">Updated weekly</span></div>
        <div className="grid border-t md:grid-cols-3">
          {briefs.map(([number, title, copy]) => <article key={number} className="group border-b p-6 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 sm:p-8"><p className="font-mono text-[10px] text-[var(--croo)]">{number}</p><h3 className="mt-16 text-xl font-medium tracking-[-0.04em]">{title}</h3><p className="mt-3 max-w-xs leading-6 text-[#65685e]">{copy}</p><ArrowUpRight className="mt-12 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" size={18} /></article>)}
        </div>
      </section>

      <section id="method" className="mx-auto grid max-w-[1440px] border-b lg:grid-cols-[1fr_2fr]">
        <div className="border-b p-5 sm:p-8 lg:border-b-0 lg:border-r"><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--croo)]">The method</p></div>
        <div className="p-5 sm:p-8"><p className="max-w-3xl text-3xl leading-[1.05] tracking-[-0.06em] sm:text-5xl">Clyveris keeps the original source close, separates the signal from the take, and leaves room for a team to disagree before a decision hardens.</p><div className="mt-16 grid gap-0 border-t sm:grid-cols-3">{["Source", "Context", "Decision"].map((step, index) => <div key={step} className="border-b py-5 sm:border-b-0 sm:border-r sm:px-5 sm:first:pl-0 sm:last:border-r-0"><span className="font-mono text-[10px] text-[var(--croo)]">0{index + 1}</span><p className="mt-8 text-lg">{step}</p></div>)}</div></div>
      </section>

      <section className="mx-auto grid max-w-[1440px] border-b lg:grid-cols-[1fr_2fr]">
        <div className="border-b p-5 sm:p-8 lg:border-b-0 lg:border-r"><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--croo)]">Also on CROO</p></div>
        <div className="p-5 sm:p-8">
          <p className="max-w-3xl text-2xl leading-[1.15] tracking-[-0.05em] sm:text-3xl">Clyveris is also a paid research agent other AI agents can hire directly: source facts and editorial take kept separate, settled on-chain in USDC.</p>
          <a href="https://agent.croo.network/agents/1298c200-e1f7-48d3-a154-4cee6c8f8df1" target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-5 bg-[var(--croo)] px-5 py-3 font-mono text-xs uppercase tracking-[0.12em] text-white hover:bg-[var(--croo-dark)]">Hire Clyveris on CROO <ArrowUpRight size={16} /></a>
        </div>
      </section>

      <footer className="mx-auto flex max-w-[1440px] flex-col justify-between gap-8 px-5 py-8 font-mono text-[10px] uppercase tracking-[0.12em] sm:flex-row sm:px-8"><span>© 2026 Clyveris</span><span className="text-[#65685e]">Clearer signals, better rooms.</span></footer>
    </main>
  )
}
