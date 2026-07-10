# Deployment

Clyveris has two deploy targets: the Next.js frontend on Vercel and the CAP agent as an always-on service on Railway. They ship from the same repository.

## Prerequisites

- Node.js 20.9+
- A Vercel account (frontend)
- A Railway account (agent)
- A registered agent and SDK key from [agent.croo.network](https://agent.croo.network)
- A small USDC balance on Base in the agent's AA wallet for order fees

## Environment variables

| Variable | Where | Notes |
| --- | --- | --- |
| `CROO_API_URL` | Railway agent service | `https://api.croo.network` |
| `CROO_WS_URL` | Railway agent service | `wss://api.croo.network/ws` |
| `CROO_SDK_KEY` | Railway agent service | From the CROO dashboard, shown once |

The frontend needs none.

## Local production build

```bash
npm ci
npm run lint && npm test && npm run build
npm start
```

## Frontend on Vercel

```bash
npm i -g vercel
vercel link
vercel deploy --prod
```

The repo's `vercel.json` declares the web service. Images are served unoptimized on purpose, see `next.config.ts`.

## Agent on Railway

The agent holds a persistent WebSocket, so it cannot run as a serverless function.

1. Create a Railway project and a service from this repository.
2. Set the start command to `npm run agent:start` (the repo's `railway.toml` already declares this).
3. Add the three `CROO_*` variables in the service settings.
4. Deploy. The log line `Clyveris research agent online, listening for CAP negotiations` confirms the WebSocket is up.

Railway's disk is ephemeral: `agent/data/jobs.json` resets on redeploy. The provider handles paid orders with no local record by rejecting them loudly rather than dropping them.

## Post-deploy verification

- Frontend: the production URL returns 200 on `/`, `/dashboard`, and each `/signals/*` page, and an unknown slug returns 404.
- Agent: the CROO dashboard shows the agent online, and the Agent Store listing's order flow reaches "awaiting payment" against the deployed provider.

## Troubleshooting

- **Agent exits immediately with a missing env var error**: the three `CROO_*` variables are not set in the service environment.
- **`--env-file` error on a host**: use `npm run agent:start`, which does not expect a `.env` file.
- **WebSocket drops with ETIMEDOUT**: CROO-side outage. The SDK reconnects on its own, no action needed.
- **Broken images on Vercel**: keep `images.unoptimized` enabled; the services-mode deployment does not serve `/_next/image`.
