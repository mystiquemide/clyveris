> Historical planning document. It describes the pre-CAP desk MVP and isn't the current deployment source of truth. Use [README.md](../README.md), [HANDOFF.md](../HANDOFF.md), and [memory.md](../memory.md) for the live Clyveris architecture and status.

# Clyveris build tasks

## Setup

### Task 1: Repair the project baseline
Owner: DevOps

Complexity: S

Depends on: none

CRITICAL PATH: Yes, this blocks build verification and deployment.

Done when: README, local setup steps, a working production build command, and CI lint and build checks exist.

### Task 2: Define the editorial domain module
Owner: Backend

Complexity: S

Depends on: none

CRITICAL PATH: Yes, this blocks the desk, detail views, filters, and tests.

Done when: typed seed data exports signals with source metadata, facts, take, tags, and decision question.

## Frontend

### Task 3: Build the signal detail route
Owner: Frontend

Complexity: M

Depends on: Task 2

Done when: every desk signal opens a detail route with a source link, visibly separated facts and take, tags, and decision question.

### Task 4: Make the desk interactive
Owner: Frontend

Complexity: M

Depends on: Task 2

Done when: category and saved-state filters update the visible list without a reload and saving persists for the browser session.

### Task 5: Finish responsive and accessible UI states
Owner: Frontend

Complexity: S

Depends on: Tasks 3 and 4

Done when: interactive controls have keyboard access, clear labels, focus states, empty states, and usable layouts at 320px, 768px, and 1280px widths.

## Testing and quality

### Task 6: Test the domain and user flows
Owner: QA

Complexity: M

Depends on: Tasks 2, 3, and 4

Done when: tests cover signal lookup, filtering, saving, and the source-to-take separation on a detail page.

### Task 7: Add privacy-safe product analytics
Owner: Data Analyst

Complexity: S

Depends on: Tasks 3 and 4

Done when: the agreed event adapter records the documented events without titles, source URLs, user content, or identifiers by default.

### Task 8: Review the finished MVP
Owner: Security and QA

Complexity: S

Depends on: Tasks 1 through 7

Done when: lint, build, tests, accessibility checks, and the security checklist pass with no high-severity finding.

## Deferred after MVP validation

### Task 9: Editor intake and publishing
Owner: Backend and Frontend

Complexity: L

Depends on: Task 8

Done when: an editor can create, review, and publish a signal without source code edits.

### Task 10: Accounts and workspaces
Owner: Backend and Frontend

Complexity: L

Depends on: Task 9

Done when: users can sign in, join a workspace, and only access its content.
