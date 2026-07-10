# Security Policy

## Reporting a vulnerability

Please do not open a public issue for security problems.

Report privately through [GitHub Security Advisories](https://github.com/mystiquemide/clyveris/security/advisories/new) or by email to splashmediahub@gmail.com. Include steps to reproduce and the potential impact. You'll get a response within 72 hours.

## Scope

The areas that matter most:

- The CAP agent's payment gating (`agent/provider.ts`, `agent/jobStore.ts`): delivery must never happen before on-chain payment confirms, and a paid order must never be silently dropped.
- Brief validation (`agent/briefSchema.ts`): untrusted input from the network is parsed here.
- Secret handling: the SDK key must never appear in logs (there is a redacting logger wrapper) or in the repository.

The frontend is static and takes no user input beyond client-side filtering, but reports are welcome there too.

## Supported versions

Only the latest `main` is supported.
