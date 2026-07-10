# memory.md

## PROJECT OVERVIEW
- Clyveris is pivoting from a standalone editorial signal desk into a paid Research & Intelligence Agent on CROO, submitting to the CROO Agent Hackathon.
- Deadline: 2026-07-12 10:00 (submission window closes; confirmed live on DoraHacks 2026-07-10, "2 days left").
- Track: Research & Intelligence Agents, "paid research with verifiable sources."
- Current status: the redesigned frontend is live through Vercel Git integration, and the paid agent is listed on CROO. The current audited agent build is ready for Railway deployment, followed by the funded settlement test.
- Primary language and framework: TypeScript. Frontend: Next.js 16, React 19, Tailwind CSS 4. Agent: standalone Node process using `@croo-network/sdk`.
- Hard submission requirements (all five, verified from the hackathon detail page): listed on CROO Agent Store, integrated with CAP with real on-chain settlement, public repo with permissive license, README + max-5-min demo video with SDK methods used, BUIDL filed on DoraHacks.

## PROJECT STRUCTURE
- `src/app/` - Next.js routes, branded landing page, dashboard, signal details, docs, privacy, terms, and 404 page.
- `src/lib/signals.ts` - curated signal seed data; doubles as the research agent's source corpus.
- `agent/` - the CAP research agent, a standalone Node/TS process, not part of the Next.js build.
  - `agent/types.ts` - job and deliverable types.
  - `agent/briefSchema.ts` - zod validation for incoming research briefs (CAP negotiation `requirements`).
  - `agent/research.ts` - pure matching pipeline over `src/lib/signals.ts`; returns `status: "no_coverage"` instead of fabricating a source when nothing matches.
  - `agent/jobStore.ts` - job state machine (`requested -> payment_required -> paid -> researching -> delivered`, or `rejected`/`failed`) plus JSON-file persistence to `agent/data/jobs.json` (gitignored).
  - `agent/provider.ts` - wires `AgentClient` (CAP SDK) to the pipeline; entry point for `npm run agent`.
- `docs/` - current deployment, design-system, demo, and audit documents. Pre-CAP planning files are labeled historical.

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
- [x] Full audit (elite-hackathon-audit + repo-audit) run 2026-07-10: code healthy, submission blockers were the private boilerplate-named repo, missing license, no video, no BUIDL, no settled order, agent undeployed.
- [x] Repo moved to `github.com/mystiquemide/clyveris` (public, MIT LICENSE via merge of the user's fresh repo baseline). Old `boilerplate-web3` remote removed entirely.
- [x] Hardened the agent for unattended running: try/catch around the NegotiationCreated handler (an SDK error no longer crashes the process), paid orders with no local job record are rejected loudly instead of silently dropped, SIGTERM handled alongside SIGINT, corrupt `jobs.json` is set aside instead of crash-looping, `markFailed` refuses to overwrite a delivered job, topic capped at 500 chars, matching now needs 2 overlapping tokens (or all tokens for one-word briefs) so a single generic word is never sold as coverage. 5 new tests, 25 total, all passing.
- [x] Frontend fixes: dashboard date is computed at render (was hardcoded "Thursday July 10"), saved signals now persist to sessionStorage via useSyncExternalStore (the copy's promise is finally true), landing brief cards link to /dashboard. Empty `prisma/` dir deleted. `tsx` moved to dependencies and `agent:start` script added so hosts without a `.env` file can run the agent.
- [x] `HANDOFF.md` added at repo root: current state, what's left, deploy notes, CROO platform quirks.
- [~] Railway project `clyveris-agent`, production service `agent`, is linked and online. Deploy the current audited workspace, verify the CAP WebSocket log, then run the settlement test.
- [x] Frontend is deployed through the existing Vercel Git integration at `clyveris.vercel.app`; pushes to `main` trigger production builds.
- [x] Frontend redesign completed, including full-height hero, brand mark, verified favicon, revised footer headline placement, responsive layouts, and CROO agent section.
- [~] Live settle test: user sent 0.3 USDC on Base to the Navigator buyer address `0x803230F998bea1D5C927801De1D89e7C5e08b87e` on 2026-07-10. Next: run the prepared order (topic matches signal-001) with the agent online, capture pay + deliver tx hashes for the demo video and BUIDL.
- [ ] Reward-eligibility note (not DQ): CROO flags <3 unique counterparty agents, <5 unique buyer wallets, and concentrated self-trading. One self-funded test order proves CAP integration but won't clear those thresholds; real third-party orders would need to come organically before judging.
- [ ] Record the max-5-min demo video.
- [ ] File the BUIDL on DoraHacks before 2026-07-12 10:00.
- [x] Pre-CAP planning documents are preserved as historical records and labeled clearly so public readers use README, HANDOFF, and memory as current sources.

## COMPLETED FEATURES
- Branded landing page, static signal-desk interface, Vercel/Railway build config (pre-pivot, still intact).
- CAP research agent backend: brief intake, provenance-preserving matching against curated signals, payment-gated delivery, on-chain settlement wiring, job persistence.

## KNOWN BUGS / TECH DEBT
- The pre-CAP PRD, architecture, design, tasks, and analytics files remain historical, with a clear banner pointing readers to current documentation.
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
| `tsx` | ^4.23.0 | Runs the standalone `agent/` TypeScript process in local and Railway production installs |
| `postcss` | 8.5.10 override | Forces the patched CSS stringifier across Next.js, Tailwind, and Vite dependency branches |

## IMPORTANT DECISIONS MADE
- Pivoted from a standalone editorial desk to a paid Research & Intelligence agent on CROO, driven by the CROO Agent Hackathon's track requirements (CAP integration, on-chain USDC settlement, Agent Store listing).
- The pivot started backend-only, then expanded to the reader-facing frontend after explicit approval on 2026-07-10.
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

### Session 5 - 2026-07-10
- Ran the full pre-submission audit (elite-hackathon-audit + repo-audit). Verified lint/tests/build green, then found the real blockers were all submission-side: the GitHub repo was PRIVATE, still named `boilerplate-web3` with the boilerplate description, and had no license, plus no video, no BUIDL, no settled order, agent undeployed.
- User created `github.com/mystiquemide/clyveris` (public, MIT). Merged its baseline into the project history (kept our README, took their LICENSE), pushed everything there, removed the old remote. User confirmed memory.md stays in the repo.
- Applied the audit's code fixes (backend hardening + frontend truthfulness, see ACTIVE WORK). The new `react-hooks/set-state-in-effect` lint rule pushed the saved-signals feature to a proper `useSyncExternalStore` external-store pattern instead of setState-in-effect.
- Added HANDOFF.md. All 25 tests, lint, and build pass.
- User queued next: deploy frontend to Vercel, keep backend deploy-ready (funding for the live settle test comes later), then redesign the frontend using a forensic teardown of fixaplan.com via Claude in Chrome, sourcing reference imagery from Pinterest.

### Session 5 addendum - 2026-07-10 (afternoon)
- Landing page fully redesigned using a forensic teardown of fixaplan.com (Framer + Lenis site; replicated the feel with CSS-only motion: intro splash, staggered reveals, word reveals, bar fills, hover micro-interactions, reduced-motion support). SR-71 section-by-section verification done against the live reference.
- Photography: licensed Unsplash originals in `public/` (bright morning-paper hero, broadsheet split section, night desk for the dark agent panel). Pinterest was requested but pins are rights-unknown and lower-res, so Unsplash originals were used and copies placed in ~/Downloads for review.
- Production fixes found by driving the deployed site: /_next/image 404s under the services-mode Vercel deployment (fixed with images.unoptimized), unknown signal slugs returned 500 (fixed with dynamicParams=false), hero gray flash on slow decode (smaller hero file + dark hero base), splash unmount fallback timer.
- Hostile-judge sweep: dead search icon removed from dashboard, signal-001 publisher corrected to Gartner (URL is a Gartner doc), branded 404 added, saves verified to persist via sessionStorage on the live site.
- Microcopy audit applied (consistent "Open" CTAs, "signals in view", actionable watchlist empty state, "See the code").
- GitHub launch polish: README rewritten product-first with real screenshots (docs/assets/, captured via Playwright + system Chrome), Mermaid architecture, truthful badges; added CONTRIBUTING, SECURITY, CHANGELOG, docs/DEPLOYMENT.md, docs/DESIGN-SYSTEM.md, CodeQL, Dependabot, issue/PR templates. Tagged v0.1.0.
- Railway agent deploy is prepped (railway.toml runs agent:start) but `railway up` was blocked by the permission classifier as an unrequested production deploy; user needs to run `railway up` or say the word.

### Session 6 - 2026-07-10
- Continued from the interrupted deployment queue and pushed landing-page polish, brand assets, the active SVG favicon, and the first demo plan in commit `41e1e6a`.
- Ran a public-release audit covering tracked history, ignored env files, dependencies, routes, headers, source integrity, CAP input boundaries, job recovery, persistence, and public copy. No real secret was found, and `npm audit` reported zero known vulnerabilities.
- Fixed inaccurate source dates and unsupported facts using dated first-party Gartner, Feedly, and Google pages.
- Hardened CAP input to 16 KB, capped tags at 64 characters, rejected unknown fields, recovered paid orders after local state loss, ignored duplicate paid events, and made job-store writes atomic.
- Corrected the privacy page, added CSP, HSTS, and COOP headers, labeled pre-CAP docs as historical, rewrote the demo to the requested two-minute structure, removed the hero eyebrow, and stabilized the footer headline above the card.
- Verification: lint clean, 30 tests pass, production build passes, all eight public routes return 200, unknown signal slug returns 404, security headers are present, and desktop/mobile browser checks show no overflow, collision, console error, or framework overlay.
- A newly published PostCSS advisory appeared during the final gate. Added an npm override to 8.5.10, regenerated the lockfile, and confirmed the full dependency audit returns zero vulnerabilities.
- Standing UI workflow: use the in-app Browser for web work and Computer Use for Windows apps outside the browser.

## CURRENT BUILD STATE
- Backend (`agent/`) is lint-clean, typechecked, and covered by 32 passing tests. It now recovers paid orders after local state loss, handles duplicate paid events, bounds public input, writes job state atomically, and converts rich source objects to JSON strings at the CROO boundary to satisfy the Store's flat array schema.
- Repo: public at github.com/mystiquemide/clyveris, MIT licensed, HANDOFF.md at root.
- Frontend: full branded redesign completed with audited first-party source metadata, active SVG favicon, stable footer headline, responsive desktop/mobile layouts, and hardened response headers.
- Deployment: Vercel Git integration is active and Railway `clyveris-agent/production/agent` is online. The first funded order locked 0.10 USDC on Base, then exposed a deliverable-schema mismatch and was rejected before settlement. The mapping fix is verified locally and needs deployment before a second funded test.
- Update `memory.md` after every meaningful project change.

### Session 7 - 2026-07-10
- Verified the Vercel production deployment from GitHub and deployed the CAP provider to Railway. Railway is online on commit `5f88e86`, holds a clean CROO WebSocket connection, and no longer competes with a local provider process for the same SDK key.
- Submitted funded CROO order `ee9716ec-e8c9-4954-9ba6-e91acb994e0b`. Escrow successfully locked 0.10 USDC on Base in transaction `0x8254066d4d28f3f5506197e1b1f2be24a7f34451e9c5eb3e3d4ef8c1ea14b15c`.
- The live paid event reached Railway, but CROO rejected the delivery with `INVALID_DELIVERABLE` because its dashboard schema builder validates `sources` as a flat string array while Clyveris sent source objects. CROO then rejected the order, so this attempt has no delivery transaction hash.
- Added a CAP-boundary serializer that JSON-encodes each structured source into a string without changing the internal research model. Added two regression tests. All 32 tests, lint, and the production build pass.
