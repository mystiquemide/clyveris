# Clyveris Public Release Audit

Audit date: 2026-07-10

## Executive Summary

Clyveris earns an A-minus for hackathon public release after fixes. No real secret is tracked in the repository or its history, all local env files are ignored, and both dependency scans report zero known vulnerabilities. The audit found three high-risk issues: inaccurate source provenance, unbounded CAP requirements, and paid-order failure after local state loss. All three are fixed and covered by tests. Medium findings in event idempotency, file persistence, privacy copy, stale docs, and browser headers are also fixed. The remaining release risks are operational: Railway storage is ephemeral, the corpus has only three sources, and the final on-chain order still needs live proof. There are no open critical or high findings.

## Repo Map

- `src/app/`: Next.js 16 App Router pages for the landing page, desk, docs, policies, signal details, and 404 handling.
- `src/components/`: client interaction, saved signals, sample brief execution, reveal effects, and shared footer.
- `src/lib/`: the three-signal editorial corpus and browser-session saved state.
- `agent/`: standalone CAP provider, input schema, research matching, job state machine, and JSON persistence.
- `.github/workflows/`: lint, tests, build, and CodeQL gates.
- `docs/`: deployment, design system, demo script, this audit, and clearly labeled historical planning files.

The frontend has no API routes. The only network-facing application process is the CAP WebSocket provider on Railway.

## Audit Report

### Critical

None.

### High, fixed

| Finding | Evidence | Consequence | Fix |
| --- | --- | --- | --- |
| Source provenance used invented July dates and one unsupported Gartner fact | `src/lib/signals.ts:31-58` | Public claims couldn't be verified from the linked publishers | Replaced all three records with dated first-party Gartner, Feedly, and Google pages and facts supported by those pages. Exact metadata is locked by `src/lib/signals.test.ts`. |
| CAP requirements allowed oversized raw JSON, long tags, and undeclared fields | `agent/briefSchema.ts:3-24` | A public caller could waste memory or submit data the service never promised to process | Added a 16 KB raw limit, 64-character tag limit, ten-tag cap, and strict object validation. |
| A restart between acceptance and payment caused rejection of a valid paid order | `agent/provider.ts:98-112`, `agent/jobStore.ts:26-34` | A buyer could pay, then lose the expected delivery after ephemeral local state disappeared | The provider now reloads the order and negotiation from CROO, rebuilds payment-required state, and continues delivery. |

### Medium, fixed

| Finding | Evidence | Consequence | Fix |
| --- | --- | --- | --- |
| Duplicate paid events could enter invalid state transitions | `agent/provider.ts:52`, `agent/provider.ts:89-149` | Reconnects or repeated events could trigger a second delivery path or an unhandled error | Added an in-flight order set, delivered-order short circuit, and resumable paid/researching states. |
| Job files were written directly | `agent/jobStore.ts:107-112` | Process interruption could leave truncated JSON and lose pending work | Writes now go to a temporary file and rename atomically. |
| Privacy copy said the site had no forms | `src/app/privacy/page.tsx:24-28` | The claim contradicted the visible sample brief form | Copy now explains that the form runs locally and sends nothing to Clyveris. |
| Public planning and handoff documents contradicted current deployment | `docs/PRD.md:1`, `docs/ARCHITECTURE.md:1`, `HANDOFF.md:26-40` | Judges and contributors could follow the wrong architecture or Railway command | Historical files now carry a clear banner, and HANDOFF describes the real Vercel and Railway setup. |
| Response headers lacked CSP, HSTS, and opener isolation | `next.config.ts:17-21` | The browser had weaker protection against injection, downgrade, framing, and cross-window abuse | Added CSP, HSTS, and COOP alongside the existing content-type, frame, referrer, and permissions headers. |
| Next.js resolved a vulnerable PostCSS version after a new advisory landed | `package.json`, `package-lock.json` | PostCSS below 8.5.10 can emit an unescaped closing style tag in affected stringification flows | Added an npm override for PostCSS 8.5.10 and regenerated the lockfile. `npm ls postcss` confirms every branch resolves 8.5.10. |

### Low, fixed

| Finding | Evidence | Consequence | Fix |
| --- | --- | --- | --- |
| Footer headline reveal translated into the card, and the hero eyebrow added unwanted copy | `src/app/page.tsx:67-78`, `src/app/page.tsx:281-289` | Mobile and intermediate reveal states produced a visible collision | Removed the eyebrow and made the footer headline static above the card with zero collision pixels on mobile. |
| Demo plan exceeded the requested structure and duration | `docs/DEMO_VIDEO_PLAN.md:5-45` | Recording could bury the sponsor proof and run long | Rewritten to two minutes in problem, solution, walkthrough, sponsor integration, and why-it-matters order. |

### Passed

- Secret scan: only the placeholder `croo_sk_...` appears in tracked history. `.env` and `.env.local` are ignored.
- Dependencies: the full `npm audit` reports zero vulnerabilities, and every PostCSS branch resolves to patched version 8.5.10.
- Routes: `/`, `/dashboard`, `/docs`, `/privacy`, `/terms`, and all three signal pages return 200. An unknown signal slug returns 404.
- Endpoints: no Next.js API or route-handler endpoints exist.
- External links: all new-tab links use safe relationship attributes.
- Editorial separation: source facts, editorial take, and decision question remain separate in data and UI.
- Quality gate: ESLint passes, 30 Vitest tests pass, and the Next.js production build passes.
- Browser gate: desktop and 390-pixel mobile checks show no horizontal overflow, footer collision, framework overlay, or console error. The no-coverage sample flow works after hydration.

## Strengths

- Payment-gated delivery is explicit in the state machine and provider event flow.
- No-coverage is a first-class paid deliverable, which prevents fabricated citations.
- The repo is small, typed, testable, and free of unused database or wallet UI surface.
- CI and CodeQL run on pushes and pull requests.
- Public policies explain blockchain permanence and warn users not to submit sensitive briefs.

## Improvement Strategy

1. Keep provenance exact. Every source claim needs a first-party URL, real publication date, and a fact visible on that page.
2. Treat CAP as a hostile public boundary. Bound raw payload size, validate exact schemas, make events idempotent, and recover from host restarts.
3. Keep public status truthful. README, HANDOFF, memory, demo claims, and deployment state must move together.
4. Preserve the lean hackathon scope. A database, auth system, analytics vendor, and frontend wallet remain out of scope until real usage justifies them.

Done means zero open critical or high findings, a green local and CI gate, all public routes healthy, the audited agent online on Railway, and one real paid order with both transaction hashes captured.

## Task Plan

| Milestone | Task | Status | Acceptance criteria | Effort | Change risk |
| --- | --- | --- | --- | --- | --- |
| Safety net | Add input, recovery, persistence, and source metadata tests | Done | 30 tests pass | S | Low |
| Critical fixes | Correct provenance and bound CAP input | Done | First-party dates match and oversized payloads fail | S | Low |
| Critical fixes | Recover paid orders after local state loss | Done | Reconstructed job reaches payment-required state and provider resumes | M | Medium |
| Quality | Add security headers and truthful privacy copy | Done | Headers present on HTTP response and copy matches behavior | S | Low |
| Quality | Verify every public route and responsive layout | Done | Eight 200 responses, one expected 404, no browser errors | S | Low |
| Operations | Deploy audited agent to Railway and run paid settlement | Pending | Railway log shows CAP connection, order delivers, two hashes saved | M | Medium |
| Submission | Record the two-minute demo and file the BUIDL | Pending | Video shows real hashes and DoraHacks entry is submitted | M | Low |

Top implementation sketches:

1. Paid-order recovery: fetch the CROO order, fetch its negotiation, revalidate stored requirements, reconstruct payment-required state, and resume only valid state transitions.
2. Provenance repair: replace undated or unsupported pages with dated first-party documents, then lock URL and date pairs in tests.
3. Deployment proof: deploy the audited workspace to Railway, confirm the WebSocket online log, complete the funded Navigator order, and record payment and delivery hashes from BaseScan.

## Remaining Trade-offs

- Railway's local disk is ephemeral. CROO recovery now protects paid orders, but long-term order history still resets on redeploy. A durable volume or database can wait until after the hackathon.
- The corpus contains three sources. Honest no-coverage protects integrity, but coverage remains intentionally narrow.
- The CSP permits inline scripts and styles because Next.js emits them. Other directives remain restrictive.
- Browser interaction is verified manually, but CI has no end-to-end browser suite yet.

## Open Questions

None block release. The remaining work is operational proof and submission, not an unresolved product decision.
