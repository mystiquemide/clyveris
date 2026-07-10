# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-07-10

### Added

- Editorial signal desk: landing page, filterable dashboard with session bookmarks, and per-signal detail pages that keep source facts separate from the editorial take
- CAP research agent: brief validation, provenance-preserving matching over the curated corpus, payment-gated delivery with on-chain settlement on Base, and a persisted job state machine
- Redacting logger that scrubs the SDK key from all agent output
- 25 Vitest tests covering schema validation, matching, payment gating, and persistence
- CI (lint, test, build), CodeQL analysis, and Dependabot updates
- Deployment guide, contributing guide, security policy, and design system documentation
