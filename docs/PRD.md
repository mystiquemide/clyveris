# Clyveris MVP PRD

## Research

Clyveris sits between a feed reader and a decision-intelligence workspace. Feedly already collects news, blogs, newsletters, journals, and social sources, then uses AI to filter weak signals. Rival Signals focuses on auto-classifying competitor changes and distributing weekly briefs. The gap Clyveris can own is a calm, editorial workspace where a small team sees the original source, a clear human take, and the decision that follows. The first version should prove that workflow with a small, curated source set before building broad crawling or opaque scoring. Search-interest data is useful as one input, but Google says it is sampled, normalized, and should not be treated as a direct measure of popularity. Sources need visible provenance and editorial claims need a clear distinction from source facts.

Sources: [Feedly Market Intelligence](https://feedly.com/market-intelligence?src=bl-po), [Rival Signals](https://www.rivalsignals.com/), [Google Trends data FAQ](https://support.google.com/trends/answer/4365533?hl=en).

## Product overview

Clyveris helps a small strategy or leadership team turn a curated set of external sources into a weekly decision brief. Each signal preserves its source, adds concise editorial context, and records the question or decision it informs.

## Users

- Editor, who adds sources, writes briefs, and publishes a desk.
- Team member, who reads the desk, saves signals, and adds a perspective.
- Workspace owner, who manages members and source coverage in a later release.

## MVP scope

1. A public landing page that explains the product and leads to a demo desk.
2. A desk with a dated, curated list of signals.
3. A signal detail view with source URL, source facts, editorial take, tags, and decision question.
4. Local saving and filtering in the demo experience.
5. A simple editorial data model that can later move from seed data to a database.

## User stories and acceptance criteria

| User story | Acceptance criteria |
| --- | --- |
| As a team member, I can scan today’s selected signals. | The desk shows title, category, source, date, summary, and reading state for each signal. |
| As a team member, I can inspect the evidence behind a take. | A detail page links to the original source and separates source facts from the editorial take. |
| As a team member, I can keep useful items for later. | Saving and unsaving updates the UI immediately and persists during the browser session. |
| As an editor, I can publish a coherent brief from structured entries. | Seed entries include source metadata, editorial context, tags, and a decision question. |
| As a reader, I can narrow the desk. | Category and saved-state filters work without a page reload. |

## Backlog

| Item | Reach | Impact | Confidence | Effort | RICE | Priority |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Structured seed signals and detail pages | 50 | 3 | 0.9 | 2 | 67.5 | 1 |
| Save and filters | 40 | 2 | 0.8 | 2 | 32 | 2 |
| Editor intake workflow | 20 | 3 | 0.6 | 4 | 9 | 3 |
| Auth and workspaces | 20 | 2 | 0.5 | 5 | 4 | 4 |
| Automated source ingestion | 100 | 3 | 0.3 | 13 | 6.9 | Later |

## KPIs

- Weekly active readers per published desk.
- Percentage of signals opened from the desk.
- Saves per active reader.
- Percentage of published signals with a verified source URL.
- Time from source discovery to brief publication.

## Out of scope for MVP

- Web3 features, wallet connections, and smart contracts.
- Automated scraping, large-scale crawling, and black-box signal scoring.
- Paid billing, permissions beyond a demo, and production analytics.
- A mobile-native app.

## Decisions needed before architecture

1. Who is the first customer, internal strategy teams, founders, or investors?
2. Is the first release a demo desk, a single-editor tool, or a multi-user workspace?
3. Which source types must be supported first?
