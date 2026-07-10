# Contributing to Clyveris

Thanks for taking the time to contribute. Whether it's a bug report, a new curated signal, or a fix to the agent's delivery flow, it's appreciated.

## Getting set up

```bash
git clone https://github.com/mystiquemide/clyveris.git
cd clyveris
npm install
npm run dev
```

That's the whole setup for the frontend. To work on the CAP agent you'll need CROO credentials, see the README's "Running the agent" section.

## Before you open a PR

- Run `npm run lint`, `npm test`, and `npm run build`. CI runs the same three and will block a red build.
- Add or update tests for any behavior change. The agent's payment gating and source-provenance rules are tested on purpose, keep them that way.
- One rule is not negotiable: the agent never fabricates a source. If a change could cause an unverified citation to be delivered, it won't be merged.

## Conventions

- Branch names: `fix/short-description` or `feat/short-description`.
- Keep commits small and messages plain. Say what changed and why.
- Match the surrounding code style. TypeScript strict mode stays on.

## Not sure where to start?

Issues labeled `good first issue` are the easiest entry points. Expanding the signal corpus (with real, linkable sources) is always welcome and needs no agent setup.

This project follows the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). Be decent to each other.
