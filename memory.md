# memory.md

## PROJECT OVERVIEW
- Clyveris is pivoting from a standalone editorial signal desk into a paid Research & Intelligence Agent on CROO, submitting to the CROO Agent Hackathon.
- Deadline: 2026-07-12 10:00 (submission window closes; confirmed live on DoraHacks 2026-07-10, "2 days left").
- Track: Research & Intelligence Agents, "paid research with verifiable sources."
- Current status: backend agent is live on CROO Agent Store. Frontend now has one small addition (a "Hire Clyveris on CROO" section on the landing page linking to the live listing); otherwise still the pre-pivot desk MVP. User explicitly asked for "both" backend and frontend work to continue, no longer backend-only.
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
- [x] Agent registered on CROO Dashboard as "Clyveris" (Google sign-in account; avatar upload is manual, CAP's automated file upload path is broken, see Known Bugs).
- [x] `CROO_SDK_KEY` generated and stored in local `.env` (gitignored). `npm run agent` now uses `tsx --env-file=.env` since tsx does not auto-load `.env`.
- [x] `npm run agent` connects live: WebSocket handshake succeeds, agent shows online and listening for negotiations. Provider logger now redacts the SDK key (the raw key was briefly written in plaintext to two log files during the first connection test; both were deleted before any git operation, nothing was ever committed or pushed).
- [x] Added the paid Service "Clyveris Research Brief" via the Configure page's schema field-builder (not raw JSON, a flat name/type/description form): $0.10 USDC, SLA 30min, Deliverable=Schema (brief, status, sources, editorialTake, decisionQuestion, tags, generatedAt), Requirements=Schema (topic required; tags, maxSources optional), matching `agent/types.ts` and `agent/briefSchema.ts` exactly.
- [x] Confirmed live at `agent.croo.network/agents/1298c200-e1f7-48d3-a154-4cee6c8f8df1` — status LIVE, service listed, "Try this" button present. Agent Store listing requirement is met.
- [x] Funded the agent's own AA wallet with $0.10 USDC. This did NOT unblock a real test order, the Navigator "Try this" checkout uses a separate buyer/Navigator balance ($0.00), not the agent's own wallet, distinct balances for seller vs. buyer roles.
- [~] Live negotiate -> pay -> deliver -> settle test blocked on two fronts: (1) registering a second SDK-based requester agent fails with a CROO-side bug (`Origin https://agent.croo.network not found on Allowlist - update configuration on cloud.reown.com`), reproduced twice, not transient; (2) the Navigator buyer-balance top-up path works but user has no more USDC to fund it right now. Order form is filled and waiting (topic: "What is the cost of delaying a decision when the context feels incomplete?", matches signal-001 for a `covered` result) for whenever funding is available.
- [x] Added a small "Hire Clyveris on CROO" section to the landing page (`src/app/page.tsx`), links to the live Agent Store listing. First frontend change since the pivot, per explicit user request to work on "both" frontend and backend now.
- [ ] Deploy the agent (`agent/provider.ts`) to Railway so it runs as an always-on service, not just locally on the user's machine. Railway CLI is installed and already authenticated (`railway whoami` → MystiqueMide), but no project is linked yet (`railway status` → "No linked project found").
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
- The Claude-in-Chrome `file_upload` MCP tool cannot upload the agent avatar to the CROO Dashboard, it errors "no longer accepts host filesystem paths" and expects a `files` param the exposed schema doesn't have. Avatar upload on agent.croo.network has to be done by hand (drag-and-drop), the generated mark is at `~/Downloads/clyveris-agent-avatar.png`.
- CROO's registration flow (Biconomy Nexus `K1Validator`) rejects a connecting wallet address that already has on-chain code (e.g. an EIP-7702 delegation, common now with wallets like Phantom that auto-upgrade EOAs for gas sponsorship/session keys). It needs a plain, never-delegated EOA. Fixed by connecting a fresh Phantom account instead of debugging the delegation.
- `tsx` does not auto-load `.env`; `npm run agent` must pass `--env-file=.env` explicitly (Node >= 20.6 native flag) or the SDK key never reaches `process.env`.
- The Configure page's Schema mode for Deliverable/Requirements is a flat field-by-field builder (name, format, type, required, description), not a raw-JSON-schema paste box, and does not support nested object shapes. `sources` is declared as a top-level `array` field with the nested `{publisher,url,publishedAt,facts}` shape only described in text, the real nested contract is enforced by `agent/types.ts` and `agent/briefSchema.ts`, the Dashboard schema is documentation for buyers, not a runtime contract.

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
- The agent's identity on CROO is named exactly "Clyveris" (not a new brand), to keep the GitHub repo, frontend, Agent Store listing, and demo video all recognizable as the same product to hackathon judges.
- The CAP provider's SDK logger is wrapped to redact the raw `CROO_SDK_KEY` from every log line (the default SDK logger prints it in the WebSocket connection URL). Any process output must go to files outside the repo (the session scratchpad), never to a file inside the project, even gitignored ones, to minimize the chance of a secret ever touching a location git could pick up.

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

### Session 3 - 2026-07-10
- Recommended keeping the CAP agent name as "Clyveris" for brand consistency; confirmed via the live Agent Store (953 agents, browsed via Claude in Chrome, already signed in on this machine) that nothing in the visible leaderboard/trending/new listings collided.
- Generated a design-token-consistent avatar (`~/Downloads/clyveris-agent-avatar.png`) since `public/` had no existing brand assets.
- Registered the agent on the CROO Dashboard via Claude in Chrome. Avatar auto-upload failed (MCP tool limitation, see Known Bugs); name-only registration went through after two blockers: a stuck Phantom extension port (user reconnected it), then a Nexus `K1Validator` rejection because the connected address had EIP-7702 delegation code (user switched to a fresh Phantom account).
- User signed in with Google for the CROO Dashboard itself; generated a `CROO_SDK_KEY` and stored it in a local `.env` (gitignored, confirmed with `git check-ignore`).
- Fixed `npm run agent` to pass `--env-file=.env` (tsx/Node do not auto-load `.env`). First run succeeded: WebSocket connects, agent goes online, listening for negotiations.
- Caught and fixed a real secret leak: the SDK's default logger printed the raw `CROO_SDK_KEY` in the WebSocket URL to two log files created in the repo root during testing. Deleted both files and confirmed via `git status`/`git check-ignore` that neither was ever staged or committed. Added a redacting logger wrapper in `agent/provider.ts` so this can't recur, and moved all future agent process logs to the session scratchpad, outside the repo entirely.
- Filled out and submitted the agent's Configure page via Claude in Chrome per user request ("check the tab opened in chrome and fill it yourself"): description, two tags (Research & Report, Data & Analytics), and the paid Service "Clyveris Research Brief" ($0.10, SLA 30min, Schema deliverable/requirements matching `agent/types.ts` exactly, built field-by-field through the Dashboard's schema builder UI, not a JSON paste box). Confirmed live and orderable at `agent.croo.network/agents/1298c200-e1f7-48d3-a154-4cee6c8f8df1`. Agent Store listing requirement is now met.

### Session 4 - 2026-07-10
- User funded the agent's own wallet with $0.10 USDC, but that's the seller-side wallet, the Navigator "Try this" checkout needed a separate buyer/Navigator balance (also $0.00), so it still couldn't complete a real order. Confirmed via the actual checkout UI, not assumed.
- Attempted the alternative path (SDK-based second requester agent) per user's choice. Blocked by a real CROO platform bug, not our code: registering any second agent fails with `Origin https://agent.croo.network not found on Allowlist - update configuration on cloud.reown.com` from their Reown/WalletConnect config, reproduced twice including on a bare page load with no user interaction, so confirmed not transient.
- Separately hit a real CROO outage mid-session (WebSocket dropping with `ETIMEDOUT`, Dashboard pages failing with "Could not load agent"). Backed off and polled in the background (Monitor tool) instead of hammering their API; recovered within ~5 minutes on its own. The CAP provider's own reconnect logic handled it gracefully throughout, no manual intervention needed.
- Filled the Navigator order form (topic matching signal-001, so it'll resolve to a `covered` result when actually run) and left it ready. User has no more USDC right now, so the live settle test is deferred, not abandoned, until they can fund the Navigator balance (~$0.15) or CROO fixes the second-agent registration bug.
- User asked to resume "both" backend and frontend work (previously backend-only). Added a small, contained "Hire Clyveris on CROO" section to the landing page linking to the live listing; otherwise frontend still untouched.
- Confirmed Railway CLI is installed and already authenticated as MystiqueMide, but no project is linked in this repo yet. Next: deploy `agent/provider.ts` there so it's not dependent on the user's machine staying on.

## CURRENT BUILD STATE
- Backend (`agent/`) built, tested, lint-clean, typechecked, running live against the real "Clyveris" CROO agent: WebSocket connected, listening for negotiations, Service configured and Store-listed at $0.10/call. Agent's own wallet holds $0.10 USDC. No real order has been negotiated/paid/delivered/settled yet, blocked on buyer-side funding and a CROO platform bug, not on anything in this codebase.
- Frontend: pre-pivot MVP desk plus one new landing-page section linking to the live CROO listing. Lint/test/build clean.
- Deployment: agent currently only runs locally via `npm run agent`. Railway CLI authenticated, no project linked yet, deploy in progress. Vercel deploy for the frontend not yet done either.
- Update `memory.md` after every meaningful project change.