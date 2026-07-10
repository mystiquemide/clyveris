# Clyveris architecture

## C4 view

### Context

Editors curate external sources into signals. Team readers use Clyveris in a browser to scan a desk, inspect source evidence, and save items. Original publishers remain the source of truth.

### Container

One Next.js application serves the landing page, desk, signal details, and future route handlers. Vercel hosts the application. The MVP reads versioned TypeScript seed data, with no database, authentication provider, or third-party analytics vendor.

### Components

- `src/lib/signals.ts` owns the typed seed data and signal lookup.
- `src/components/signals/` owns display and interaction components.
- `src/app/dashboard/` renders the desk and passes query state to client controls.
- `src/app/signals/[slug]/` renders a single signal from the domain module.
- `src/lib/analytics.ts` exposes a no-op, privacy-safe event interface until a provider is approved.

## Stack

| Layer | Choice | Reason |
| --- | --- | --- |
| UI and routing | Next.js App Router | Existing framework with file-based routes and server rendering. |
| Language | TypeScript strict mode | Prevents malformed editorial records and route lookups. |
| Styling | Tailwind CSS 4 | Existing visual implementation. |
| Icons | Lucide React | Existing dependency. |
| Data | Versioned TypeScript seed module | Fast, reviewable MVP data without pretending a database exists. |
| Hosting | Vercel | Existing configuration and direct Next.js support. |
| CI | GitHub Actions | Runs the same lint, test, and build commands on pull requests. |

## Folder structure

```text
src/
  app/
    dashboard/             # desk route
    signals/[slug]/        # signal detail route
    layout.tsx             # shared metadata and fonts
  components/
    signals/               # cards, filters, source evidence, save button
  lib/
    signals.ts             # seed data and domain helpers
    analytics.ts           # vendor-neutral event adapter
  types/
    signal.ts              # editorial domain types
docs/                      # product, design, task, and analytics specs
```

## Data model

```ts
type Source = {
  publisher: string
  url: string
  publishedAt: string
  author?: string
}

type Signal = {
  id: string
  slug: string
  title: string
  category: "operating-environment" | "category-watch" | "people-signal"
  summary: string
  source: Source
  sourceFacts: string[]
  editorialTake: string
  decisionQuestion: string
  tags: string[]
  selectedFor: string
}
```

The future relational model keeps the same boundaries: `Workspace -> Membership`, `Workspace -> Signal`, and `Signal -> Source`. Add persistence only when editor intake is approved.

## API contracts

The MVP has no network API because all data is versioned in the app. These contracts reserve the boundary for the next release.

| Method and path | Request | Response | Failure cases |
| --- | --- | --- | --- |
| `GET /api/signals` | `category?`, `saved?` | `200 { data: Signal[] }` | `400` invalid filter |
| `GET /api/signals/:slug` | none | `200 { data: Signal }` | `404` unknown slug |
| `POST /api/signals/:id/save` | none | `204` | `401` unauthenticated after accounts exist, `404` unknown id |

## Failure behavior

- Unknown slugs render a Next.js not-found page.
- Missing optional source author shows no author field.
- Storage access failure keeps the current save action in memory and shows a non-blocking message.
- Analytics failure never blocks reading, filtering, saving, or navigation.
- A failed deployment is rejected before promotion because CI runs lint, tests, and build.

## ADRs

### ADR 001: Start with curated seed data

Context: the MVP proves whether readers value the editorial workflow. Options were seed data, database-backed editor tooling, or automated ingestion. Decision: ship seed data first. Consequence: content updates need code changes, but the product can validate the reading flow quickly and transparently.

### ADR 002: Keep facts and editorial take as separate fields

Context: readers need to distinguish evidence from interpretation. Options were a single summary field or structured fields. Decision: store separate `sourceFacts` and `editorialTake` fields. Consequence: editorial entry takes slightly longer but improves trust and auditability.

### ADR 003: No Web3 scope

Context: Clyveris has no approved wallet, onchain, or token user need. Decision: remove Web3 infrastructure from the MVP. Consequence: lower complexity and no wallet or transaction attack surface.

### ADR 004: Add vendors only after the workflow proves value

Context: analytics, auth, and database vendors cause cost and lock-in. Decision: use vendor-neutral interfaces and local behavior until there is a validated need. Consequence: the MVP does less operationally, but its data boundaries remain clean.
