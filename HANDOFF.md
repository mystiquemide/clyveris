# Clyveris Handoff

Last updated 2026-07-10. Hackathon deadline: 2026-07-12 10:00 (DoraHacks, CROO Agent Hackathon, Research & Intelligence track).

## What this project is

Two parts in one repo:

- `src/` - the Next.js editorial signal desk (landing page, dashboard, signal detail pages). No env vars needed.
- `agent/` - the paid CAP research agent, a standalone Node process. Live on the CROO Agent Store at [agent.croo.network/agents/1298c200-e1f7-48d3-a154-4cee6c8f8df1](https://agent.croo.network/agents/1298c200-e1f7-48d3-a154-4cee6c8f8df1) as "Clyveris Research Brief" ($0.10 USDC, SLA 30min).

## Current state

Done and verified:

- Repo is public at `github.com/mystiquemide/clyveris` with an MIT license.
- Agent registered, configured, and listed LIVE on the CROO Agent Store.
- Full CAP lifecycle wired: negotiation validation -> accept -> wait for `OrderPaid` on-chain -> research -> `deliverOrder`. Delivery is never called before payment confirms.
- Hardened for unattended running: event handlers catch and reject on internal errors, paid orders with no local record get rejected instead of silently dropped, SIGTERM/SIGINT both shut down cleanly, a corrupt job store file is set aside instead of crash-looping.
- 25 tests, lint, and production build all pass (`npm run lint && npm test && npm run build`).
- Agent's own AA wallet holds $0.10 USDC (that covers seller-side order fees, gas is sponsored).

Not done yet, in priority order:

1. Live settle test. No order has actually been negotiated, paid, and settled on-chain yet. Blocked on buyer-side funds: the Navigator "Try this" checkout uses a separate buyer balance (~$0.15 needed), distinct from the agent's own wallet. The order form was prepared with the topic "What is the cost of delaying a decision when the context feels incomplete?" which matches signal-001 and returns a `covered` result. Fund the Navigator balance, run that order, save both tx hashes (pay + deliver) for the video and BUIDL.
2. Keep the agent online 24/7. It currently runs from a laptop via `npm run agent`. Deploy notes below.
3. Demo video, max 5 minutes, must name the SDK methods used (they're listed in README.md).
4. File the BUIDL on DoraHacks before 2026-07-12 10:00. Do not leave it for the last hour.

## Running things

- Frontend: `npm install && npm run dev` -> localhost:3000.
- Agent locally: copy `.env.example` to `.env`, fill `CROO_API_URL`, `CROO_WS_URL`, `CROO_SDK_KEY`, then `npm run agent` (it passes `--env-file=.env` because tsx does not auto-load .env).
- Agent on a host (Railway etc.): set the three env vars in the platform and use `npm run agent:start` (no .env file needed, reads platform env). `tsx` is a regular dependency so a pruned production install still works.

## Deploy notes

- Frontend -> Vercel. `vercel.json` is already set (`npm ci` + `npm run build`).
- Agent -> Railway as its own service (it holds a persistent WebSocket, so it can't be serverless). Railway CLI is authenticated as MystiqueMide. Create a service from this repo, set start command to `npm run agent:start`, and add the three `CROO_*` env vars in the service settings. Heads up: Railway's disk is ephemeral, so `agent/data/jobs.json` resets on redeploy. That's acceptable for the hackathon window, and the unknown-paid-order handling in `agent/provider.ts` covers the gap.
- `railway.toml` in the repo root describes the frontend service (`npm start`), not the agent.

## Known platform quirks (CROO side, not this codebase)

- Registering a second SDK-based agent fails with a Reown allowlist error (`Origin https://agent.croo.network not found on Allowlist`). Reproduced twice, their bug.
- The dashboard's schema builder is flat, so the nested `sources` shape is documented in text there. The real contract is enforced by `agent/types.ts` and `agent/briefSchema.ts`.
- CROO registration rejects wallets with EIP-7702 delegation code. Use a fresh, never-delegated EOA.
- CROO had a brief outage on 2026-07-10 (WebSocket ETIMEDOUT). The SDK's reconnect handled it without intervention.

## Where the deeper context lives

- `memory.md` - full project memory: decisions, session logs, bug history.
- `AGENTS.md` - engineering rules and module breakdown.
- `README.md` - setup, CAP lifecycle, SDK methods used.
