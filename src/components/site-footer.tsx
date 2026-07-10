import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 border-t px-5 py-6 font-mono text-[11px] uppercase tracking-[0.12em] sm:px-8">
      <span className="text-[var(--muted)]">© 2026 Clyveris · MIT licensed</span>
      <nav className="flex flex-wrap gap-5" aria-label="Site">
        <Link href="/dashboard" className="transition-colors hover:text-[var(--croo)]">The desk</Link>
        <Link href="/docs" className="transition-colors hover:text-[var(--croo)]">Docs</Link>
        <a
          href="https://agent.croo.network/agents/1298c200-e1f7-48d3-a154-4cee6c8f8df1"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-[var(--croo)]"
        >
          CROO Agent Store
        </a>
        <a
          href="https://github.com/mystiquemide/clyveris"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-[var(--croo)]"
        >
          GitHub
        </a>
      </nav>
    </footer>
  )
}
