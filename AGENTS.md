# Clyveris engineering rules

## Stack

- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4 for the reader-facing site.
- `agent/` is a standalone Node/TypeScript process (run via `npm run agent`, `tsx`), separate from the Next.js app. It hosts the CROO Agent Protocol (CAP) provider that makes Clyveris a paid, callable research agent on CROO Agent Store. It must run as a persistent process (holds a CAP WebSocket connection), so it deploys to Railway, not Vercel.
- Use TypeScript strict mode and functional React components.
- Keep product data in `src/lib` and display components in `src/components`.
- Use server components by default. Add client components only for browser state or user interaction.

## CAP agent (agent/)

- `agent/types.ts` — job and deliverable types.
- `agent/briefSchema.ts` — zod validation for the incoming research brief (the CAP negotiation `requirements` JSON).
- `agent/research.ts` — pure matching pipeline over `src/lib/signals.ts`. Never fabricates a source: if nothing in the corpus matches, it returns `status: "no_coverage"` instead of inventing one.
- `agent/jobStore.ts` — job state machine (`requested -> payment_required -> paid -> researching -> delivered`, or `rejected`/`failed`) plus JSON-file persistence to `agent/data/jobs.json` (gitignored, local run state only).
- `agent/provider.ts` — wires `@croo-network/sdk`'s `AgentClient` to the pipeline above. Requires `CROO_API_URL`, `CROO_WS_URL`, `CROO_SDK_KEY` (see `.env.example`). Registering the agent, wallet, and service happens in the CROO Dashboard (agent.croo.network), not in code.
- Delivery is always gated behind `EventType.OrderPaid`. Never call `deliverOrder` before payment is confirmed on-chain.

## Editorial integrity

- Every signal needs a publisher, source URL, published date, source facts, editorial take, and decision question.
- Keep source facts and editorial interpretation in separate fields and separate UI sections.
- Never invent source claims or treat popularity data as evidence by itself.
- External links must use safe new-tab attributes when they open in a new tab.

## Product scope

- Clyveris is pivoting to a paid Research & Intelligence Agent on CROO (CAP), for the CROO Agent Hackathon (Research & Intelligence track, deadline 2026-07-12 10:00 UTC). This is backend-only for now: the CAP agent in `agent/`. Do not add Web3, wallets, or on-chain UI to the Next.js frontend (`src/`) until explicitly asked.
- The reader-facing Next.js app otherwise keeps its prior MVP scope: no auth, no database beyond the seed signal data.
- Do not add vendors, paid services, telemetry, or environment variables beyond what's already approved (CAP SDK) without explicit approval.
- Keep browser persistence limited to non-sensitive UI state until accounts are approved.

## Quality

- Add or update tests for every behavior change.
- Run lint, tests, and production build before calling a task complete.
- Maintain keyboard access, visible focus, 44px touch targets, and responsive layouts.
- Never commit secrets, generated build output, or dependency directories.

## Project memory

- Update `memory.md` after every meaningful project change, including planning, build, QA, deployment, and material fixes.