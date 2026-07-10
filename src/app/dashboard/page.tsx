import Link from "next/link"
import { SignalDesk } from "@/components/signals/signal-desk"

export default function DashboardPage() {
  return <main className="min-h-screen"><header className="mx-auto flex max-w-[1440px] items-center justify-between border-b px-5 py-4 sm:px-8"><Link href="/" className="font-mono text-sm font-bold tracking-[-0.08em]">CLYVERIS</Link><span className="font-mono text-[10px] uppercase tracking-[0.12em]">Your desk</span></header><SignalDesk /></main>
}