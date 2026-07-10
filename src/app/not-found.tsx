import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--croo)]">404</p>
      <h1 className="mt-5 max-w-xl text-4xl font-semibold tracking-[-0.045em] sm:text-6xl">This page is not on the desk.</h1>
      <p className="mt-5 max-w-md leading-7 text-[var(--muted)]">
        The signal you followed does not exist here. The desk has everything that does.
      </p>
      <Link
        href="/dashboard"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-5 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-white transition-all duration-300 hover:scale-[1.04] hover:bg-[var(--croo)] active:scale-95"
      >
        Back to the desk <ArrowUpRight size={14} />
      </Link>
    </main>
  )
}
