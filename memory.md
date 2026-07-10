# memory.md

## PROJECT OVERVIEW
- Clyveris is pivoting from a standalone editorial signal desk into a paid Research & Intelligence Agent on CROO, submitting to the CROO Agent Hackathon.
- Deadline: 2026-07-12 10:00 (submission window closes; confirmed live on DoraHacks 2026-07-10, "2 days left").
- Track: Research & Intelligence Agents, "paid research with verifiable sources."
- Current status: backend-only build in progress. Frontend (`src/`) is frozen as-is until explicitly asked to change it.
- Primary language and framework: TypeScript. Frontend: Next.js 16, React 19, Tailwind CSS 4. Agent: standalone Node process using `@croo-network/sdk`.
- Hard submission requirements (all five, verified from the hackathon detail page): listed on CROO Agent Store, integrated with CAP with real on-chain settlement, public repo with permissive license, README + max-5-min demo video with SDK methods used, BUIDL filed on DoraHacks.

## PROJECT STRUCTURE
- `src/app/` - Next.js routes, layout, styles, landing page, and dashboard (unchanged, frontend frozen for now).
- `src/lib/signals.ts` - curated signal seed data; doubles as the research agent's source corpus.
- `agent/` - the CAP research agent, a standalone Node/TS process, not part of the Next.js build.
  - `agent/types.ts` - job and deliverable types.
  - `agent/briefSchema.ts` - zod validation for incoming research briefs (CAP negotiation `requirements`).
  - `agent/research.ts` - pure matching pipeline over `src/lib/signals.ts`; returns `status: "no_coverage"` instead of fabricating a source when nothing matches.
  - `agent/jobStore.ts` - job state machine (`requested -> payment_required -> paid -> researching -> delivered`, or `rejected`/`failed`) plus JSON-file persistence to `agent/data/jobs.json` (gitignored).
  - `agent/provider.ts` - wires `AgentClient` (CAP SDK) to the pipeline; entry point for `npm run agent`.
- `docs/` - product and technical documents (written for the pre-pivot desk MVP; not yet updated for the CAP pivot).

## DATABASE / DATA MODELS
- No relational database. Frontend uses the seed `Signal` model (publisher, source URL, published date, source facts, editorial take, decision question, tags, category).
- Agent job state persists to a local JSON file (`agent/data/jobs.json`), not committed. `ResearchJob` includes negotiation/order ids, brief, status, price, tx hashes, and the delivered result.

## APIs & INTEGRATIONS
| Service | Purpose | Auth Method |
| --- | --- | --- |
| CROO Agent Protocol (CAP), `@croo-network/sdk` | Makes Clyveris a callable, paid agent: negotiation, USDC escrow/payment, delivery, on-chain settlement on Base | `CROO_SDK_KEY` (agent-scoped SDK key from agent.croo.network Dashboard) |

## ENVIRONMENT VARIABLES
- `CROO_API_URL`, `CROO_WS_URL`, `CROO_SDK_KEY` - required to run `agent/provider.ts`. See `.env.example`.
- Frontend still needs none.

## ACTIVE WORK & IN-PROGRESS
- [x] Research CAP SDK contract and hackathon submission rules directly (docs.croo.network, github.com/CROO-Network/node-sdk, DoraHacks detail page).
- [x] Build agent backend: brief validation, provenance-preserving research pipeline, job state machine, CAP provider wiring.
- [x] Tests: request validation, source provenance, payment-required gating, settled-job persistence, failed-payment handling (16 new tests, all passing).
- [x] Lint, typecheck, and `next build` all pass with the new `agent/` code present.
- [ ] User registers the agent + service + wallet in the CROO Dashboard (agent.croo.network) and funds it with USDC on Base — this step needs their login/wallet, not something done in code.
- [ ] Run `npm run agent` against a live CROO account and confirm a real negotiate -> pay -> deliver -> settle cycle end to end.
- [ ] List on CROO Agent Store (happens via the Dashboard once the service is configured).
- [ ] Record the max-5-min demo video.
- [ ] File the BUIDL on DoraHacks before 2026-07-12 10:00.
- [ ] Decide whether to update `docs/PRD.md` / `docs/ARCHITECTURE.md` for the pivot, or leave them as historical record of the pre-pivot MVP (currently untouched).

## COMPLETED FEATURES
- Branded landing page, static signal-desk interface, Vercel/Railway build config (pre-pivot, still intact).
- CAP research agent backend: brief intake, provenance-preserving matching against curated signals, payment-gated delivery, on-chain settlement wiring, job persistence.

## KNOWN BUGS / TECH DEBT
- The Git remote is still named for the prior Web3 boilerplate (`boilerplate-web3`).
- Legacy Vercel and Railway build commands run `prisma generate`, but Prisma is no longer configured.
- `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN.md`, `docs/TASKS.md`, `docs/ANALYTICS.md` describe the pre-pivot standalone-desk product; not yet reconciled with the CAP pivot.
- The agent's research corpus is the same 3-signal seed dataset as the frontend; real hackathon usage will expose thin coverage (by design, it returns `no_coverage` rather than fabricating, but that means most novel briefs won't resolve yet).
- No live end-to-end test against a real CROO account yet; only unit tests with a mocked/no SDK connection.

## KEY DEPENDENCIES
| Package | Version | Why |
| --- | --- | --- |
| `next` | 16.2.9 | Frontend app framework |
| `react` | 19.2.4 | UI runtime |
| `tailwindcss` | 4 | Styling |
| `lucide-react` | 1.21.0 | Icons |
| `@croo-network/sdk` | ^0.2.1 | CAP client for the research agent (negotiation, payment, delivery, settlement) |
| `zod` | ^4.4.3 | Brief request validation |
| `tsx` | ^4.23.0 (dev) | Runs the standalone `agent/` TypeScript process |

## IMPORTANT DECISIONS MADE
- Pivoted from a standalone editorial desk to a paid Research & Intelligence agent on CROO, driven by the CROO Agent Hackathon's track requirements (CAP integration, on-chain USDC settlement, Agent Store listing).
- Scope this pivot to backend only for now; the Next.js frontend stays untouched until explicitly requested.
- The agent's research corpus reuses the existing curated `src/lib/signals.ts` seed data rather than adding a live web-scraping/search vendor, fastest to demo within the 2-day deadline and consistent with the existing editorial-integrity rule of never fabricating sources.
- The CAP provider runs as its own standalone Node process (`agent/`, started via `npm run agent`), separate from the Next.js app, because it must hold a persistent WebSocket connection, which Vercel serverless functions can't do. It deploys to Railway (already configured in this repo).
- Job state is persisted to a local JSON file, not a database, to avoid adding a DB vendor under hackathon time pressure.
- Claude will never generate, hold, or fund a real CROO agent wallet, or move real USDC. The user runs the CAP Dashboard setup (account, agent registration, service config, wallet funding) themselves and hands over only the resulting env vars.
- Per explicit user instruction: after every edit/change, commit and push to GitHub, with commits co-authored as `MystiqueMide <splashmediahub@gmail.com>`, never the Claude default co-author line.

## SESSION LOG
### Session 1 - 2026-07-10
- Audited the initial frontend prototype.
- Confirmed the current branch is a static Next.js desk after Web3, auth, Prisma, and API boilerplate were removed.
- Created the Phase 1 PRD and persistent project memory.
- Created implementation tasks, architecture, design, analytics, and engineering rules for the approval gate.
- QA approved. Lint passes, 4 Vitest tests pass, and the Next.js production build passes.
- MVP build completed: typed signal data, interactive filters, browser-session saves, signal detail pages, CI, README, and corrected Vercel and Railway build commands.

### Session 2 - 2026-07-10
- User redirected the product: Clyveris becomes a paid Research & Intelligence Agent on CROO (CAP), for the CROO Agent Hackathon, not a standalone desk.
- Researched the real CAP SDK contract and hackathon rules directly (cap.croo.network, docs.croo.network/developer-docs/quick-start, github.com/CROO-Network/node-sdk, DoraHacks detail page) rather than guessing from training data. Confirmed deadline 2026-07-12 10:00, all five submission requirements, and the exact `AgentClient` API surface installed (`@croo-network/sdk@0.2.1`).
- Built `agent/`: brief schema validation, provenance-preserving research pipeline over the existing signal corpus, a payment-gated job state machine, and the CAP provider wiring (`negotiateOrder` -> `acceptNegotiation` -> gate on `OrderPaid` -> `deliverOrder`).
- Added 16 new tests covering request validation, source provenance (no fabricated sources), payment-required gating, settled-job persistence, and failed-payment handling. Full suite (20 tests), typecheck, lint, and `next build` all pass.
- Updated `AGENTS.md`, `README.md`, `.env.example` for the pivot. Scope is backend-only; frontend is untouched per explicit instruction.
- User set standing instructions: keep `memory.md` auto-updated, backend-only work for now, and commit+push to GitHub after every change with co-author `MystiqueMide` (never Claude's default).

## CURRENT BUILD STATE
- Backend (`agent/`) built, tested, lint-clean, typechecked. Not yet run against a live CROO account, no real negotiate/pay/deliver/settle cycle has happened yet.
- Frontend unchanged from the 2026-07-10 MVP build, still lint/test/build clean.
- Deployment (Railway for the agent, Vercel for the frontend) is pending: needs the user's CROO Dashboard setup (account, agent registration, service config, funded wallet) before the agent can go live.
- Update `memory.md` after every meaningful project change.