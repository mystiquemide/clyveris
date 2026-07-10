# Clyveris

An editorial signal desk, and a paid research agent other AI agents can hire.

[![CI](https://github.com/mystiquemide/clyveris/actions/workflows/ci.yml/badge.svg)](https://github.com/mystiquemide/clyveris/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6)](https://www.typescriptlang.org)
[![Live on CROO Agent Store](https://img.shields.io/badge/CROO_Agent_Store-live-426b35)](https://agent.croo.network/agents/1298c200-e1f7-48d3-a154-4cee6c8f8df1)

**Clyveris is research with receipts.** One product, two faces:

| | What | Where |
| --- | --- | --- |
| For people | An editorial desk: every signal keeps its original source, the take, and one decision question | [clyveris.vercel.app](https://clyveris.vercel.app) |
| For agents | A paid research service on the CROO Agent Protocol | [Live on the Agent Store](https://agent.croo.network/agents/1298c200-e1f7-48d3-a154-4cee6c8f8df1) |

The flow: an agent sends a brief, Clyveris validates it, the buyer pays USDC into escrow on Base, and only after payment confirms on-chain does Clyveris deliver sources the buyer can check themselves.

The one rule: **never fabricate a source.** No verified match means an honest `no_coverage`, not an invented citation. That rule is enforced in code and covered by tests.

![Clyveris landing page](docs/assets/landing.png)

## What it does

- **The desk** ([clyveris.vercel.app](https://clyveris.vercel.app)) is the reader-facing site: a landing page, a signal dashboard with category filters and session bookmarks, and a detail page per signal that keeps source facts and the editorial take in separate sections.
- **The agent** ([Clyveris on CROO](https://agent.croo.network/agents/1298c200-e1f7-48d3-a154-4cee6c8f8df1)) is a paid Research and Intelligence service on the CROO Agent Protocol (CAP). It validates incoming briefs, matches them against the curated signal corpus, and delivers a structured result with full source provenance. Payment settles on Base before anything is delivered.

One rule governs both: never fabricate a source. If nothing verified matches a brief, the agent returns `no_coverage` instead of inventing a citation.

![The signal desk](docs/assets/desk.png)

Try the agent's exact matching pipeline without a wallet: the landing page has a live sample-brief runner, and the desk is fully responsive.

<img src="docs/assets/mobile-landing.png" alt="Clyveris on mobile" width="280">

## Verify it on-chain

Clyveris has completed a real paid order over CAP, settled in USDC on Base. Every step of the lifecycle has a public receipt:

| Step | What happened | Receipt |
| --- | --- | --- |
| Lock | Buyer escrowed 0.10 USDC | [BaseScan](https://basescan.org/tx/0x090d35093893ad88f5ce6e01af9313fcbe31f0074184a0284585cfcd15ba224c) |
| Deliver | Clyveris delivered the research brief | [BaseScan](https://basescan.org/tx/0x88033c7e2ad3dc5320ba5156ff075a42acf822e8383e8c19a3b6a87a244d056c) |
| Clear | Escrow released 0.10 USDC to Clyveris | [BaseScan](https://basescan.org/tx/0x9e9c480ab7074e47fc5539cb95ffa33d50ee7c35212596ad83818f9620501e69) |

Order `4a036acf-cfd8-4501-a731-a5dcf1d87503`, completed 2026-07-10. The brief asked *"What is the cost of delaying a decision when the context feels incomplete?"* and resolved to `covered`: two sources with publisher, URL, publish date, and the exact facts each one supports, plus the editorial take and a decision question, delivered only after payment confirmed on-chain.

You can reproduce the same flow yourself from the [live Agent Store listing](https://agent.croo.network/agents/1298c200-e1f7-48d3-a154-4cee6c8f8df1): hire Clyveris, send a brief, and check the sources in the deliverable against the URLs it cites.

## Architecture

```mermaid
flowchart LR
  subgraph Reader
    R[Browser] --> W[Next.js desk on Vercel]
  end
  subgraph CAP[CROO Agent Protocol]
    B[Buyer agent] -->|negotiation| P[provider.ts]
    P -->|validate| S[briefSchema.ts]
    P -->|OrderPaid on Base| D[deliverOrder]
  end
  P --> M[research.ts]
  M --> C[(signals corpus)]
  W --> C
  P --> J[(jobStore.ts)]
```

The agent is a standalone long-running Node process. It holds a persistent CAP WebSocket, so it deploys as an always-on service (Railway), separate from the serverless frontend (Vercel).

The delivery lifecycle is a strict state machine: `requested -> payment_required -> paid -> researching -> delivered`, with `rejected` and `failed` as terminal branches. `deliverOrder` is only ever called after the `OrderPaid` event confirms payment on-chain, and a delivered job can never be overwritten by a late failure event.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 16 (App Router), React 19, Tailwind CSS 4, Lucide icons |
| Agent | Node.js 20+, TypeScript strict, `@croo-network/sdk`, zod |
| Settlement | USDC on Base via CAP escrow |
| Tests | Vitest (32 tests across schema, matching, state machine, recovery, persistence, and the CAP delivery boundary) |
| CI | GitHub Actions: lint, test, build on every push and PR |

## Quick start

Requires Node.js 20.9 or newer.

```bash
git clone https://github.com/mystiquemide/clyveris.git
cd clyveris
npm install
npm run dev
```

Open `http://localhost:3000`. The frontend needs no environment variables.

## Running the agent

1. Sign in at [agent.croo.network](https://agent.croo.network) and register an agent. Copy the SDK key, it is shown once.
2. Add a service. Clyveris ships as `Clyveris Research Brief`: requirements are `{ "topic": string, "tags"?: string[], "maxSources"?: number }`, the deliverable is a structured JSON schema with `brief`, `status`, `sources`, `editorialTake`, `decisionQuestion`, `tags`, and `generatedAt`.
3. Fund the agent's AA wallet (shown on the Configure page) with a small amount of USDC on Base for order fees. Gas is sponsored by CROO.
4. Copy `.env.example` to `.env` and fill in the three values.
5. Start the provider:

```bash
npm run agent
```

The agent listens for negotiations, validates each brief, accepts or rejects, and delivers only after `OrderPaid` confirms on-chain. On a host that injects environment variables directly (no `.env` file), use `npm run agent:start` instead.

### CAP SDK surface used

`AgentClient.connectWebSocket`, `getNegotiation`, `acceptNegotiation`, `rejectNegotiation`, `getOrder`, `deliverOrder`, and `rejectOrder` from [`@croo-network/sdk`](https://github.com/CROO-Network/node-sdk), listening for `NegotiationCreated`, `OrderPaid`, `OrderExpired`, and `OrderRejected` events.

## Environment variables

| Variable | Required by | Purpose |
| --- | --- | --- |
| `CROO_API_URL` | agent | CAP REST endpoint |
| `CROO_WS_URL` | agent | CAP WebSocket endpoint |
| `CROO_SDK_KEY` | agent | Agent-scoped SDK key from the CROO dashboard |

The frontend requires none. See `.env.example`.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Frontend dev server |
| `npm run build` | Production build |
| `npm test` | Vitest suite |
| `npm run lint` | ESLint |
| `npm run agent` | CAP provider, loading `.env` |
| `npm run agent:start` | CAP provider, platform env vars |

## Verification

`npm run lint`, `npm test` (32 passing), and `npm run build` are all green locally and enforced in CI on every push and pull request.

## Deployment

The frontend deploys to Vercel and is live at [clyveris.vercel.app](https://clyveris.vercel.app). The agent runs as an always-on service. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for the full walkthrough.

## Repository layout

```
src/            Next.js desk: landing, dashboard, signal pages
src/lib/        Signal corpus and filtering, shared by desk and agent
agent/          CAP provider: schema, matching, job state machine, wiring
docs/           Design system, deployment guide, product documents
.github/        CI, CodeQL, Dependabot, issue and PR templates
```

## Contributing

Contributions are welcome. Start with [CONTRIBUTING.md](CONTRIBUTING.md).

## Security

See [SECURITY.md](SECURITY.md) for how to report a vulnerability.

## License

[MIT](LICENSE)
