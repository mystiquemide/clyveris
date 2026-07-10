# Clyveris

Clyveris is an editorial signal desk that keeps original sources, editorial context, and decision questions in one place. It ships in two parts:

- **`src/`** — the reader-facing Next.js desk (landing page, dashboard, signal detail pages).
- **`agent/`** — a paid, callable Research & Intelligence agent on [CROO](https://croo.network), built on the CROO Agent Protocol (CAP). Other agents or humans send a research brief, pay USDC, and get back a result with verifiable source provenance, settled on-chain. Built for the CROO Agent Hackathon.

## Run the frontend locally

Requires Node.js 20.9 or newer and npm.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Run the CAP research agent

The agent is a standalone, long-running Node process, it holds a CAP WebSocket connection open and can't run as a serverless function.

1. Sign in at [agent.croo.network](https://agent.croo.network) with a wallet, Google, or email.
2. **My Agents → Register Agent.** Copy the generated API key, it's shown once.
3. On the Configure page, add a service:
   - Service name: `Clyveris Research Brief`
   - Price: set your own (USDC)
   - SLA: e.g. `0h 30m`
   - Deliverable: `Schema` (structured JSON)
   - Requirements: `Schema` — `{ "topic": string, "tags"?: string[], "maxSources"?: number }`
4. Fund the agent's AA wallet address (shown on the Configure page, not the controller address) with a small amount of USDC on Base for order fees. Gas is sponsored by CROO.
5. Copy `.env.example` to `.env` and fill in `CROO_API_URL`, `CROO_WS_URL`, and `CROO_SDK_KEY` from step 2.
6. Start the provider:

```bash
npm run agent
```

The agent listens for negotiations, validates the brief, accepts the order, and only calls `deliverOrder` after `OrderPaid` confirms payment on-chain. See `agent/provider.ts` for the full lifecycle and `AGENTS.md` for the module breakdown.

### SDK methods used

`AgentClient.connectWebSocket`, `getNegotiation`, `acceptNegotiation`, `rejectNegotiation`, `getOrder`, `deliverOrder`, `rejectOrder` from [`@croo-network/sdk`](https://github.com/CROO-Network/node-sdk), listening for `NegotiationCreated`, `OrderPaid`, `OrderExpired`, and `OrderRejected` events.

## Checks

```bash
npm run lint
npm test
npm run build
```

`npm test` covers both the frontend signal data and the agent's brief validation, source-provenance rules, and payment-gated job state machine.

## Deployment

- Vercel runs `npm ci` and `npm run build` for the Next.js frontend.
- Railway runs the same build for the frontend and separately hosts the CAP agent as a persistent process (`npm run agent`).

## Environment variables

See `.env.example`. `CROO_API_URL`, `CROO_WS_URL`, and `CROO_SDK_KEY` are required to run the CAP agent; the frontend needs none.
