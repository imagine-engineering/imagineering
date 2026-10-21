# Implementation Plan: Product documentation

## Tasks

### Milestone 1: Deliver useful local documentation

- [x] 1. Extend the existing website
  - [x] 1.1. Inspect website and document ownership
    - _Requirements: 1.1, 3.3_
    - _Depends on: none_
    - _Reads: app/layout.tsx, next.config.mjs, .github/workflows/pages.yml_
    - _Writes: .agents/specs/product-documentation/design.md_
    - _Validation: Verify clean baseline, prior chat decisions, static export and no parallel framework._
    - _Evidence: validation.md records source review, successful build/type/export checks and 15 browser layout cases with keyboard journeys; lint dependency and public deployment remain explicitly excluded._
  - [x] 1.2. Add shared documentation layout and navigation
    - _Requirements: 1.1, 1.2, 3.2_
    - _Depends on: 1.1_
    - _Reads: components/header.tsx, components/footer-section.tsx_
    - _Writes: components/documentation-shell.tsx, components/documentation-navigation.tsx, lib/documentation.ts, app/docs/layout.tsx_
    - _Validation: Build; verify skip link, current page, constrained widths and responsive navigation._
    - _Evidence: validation.md records source review, successful build/type/export checks and 15 browser layout cases with keyboard journeys; lint dependency and public deployment remain explicitly excluded._
  - [x] 1.3. Add source-based documentation entry pages
    - _Requirements: 1.2, 2.1, 2.2_
    - _Depends on: 1.2_
    - _Reads: lib/content.ts_
    - _Writes: app/docs/page.tsx, app/docs/copper/page.tsx, app/docs/groovy/page.tsx, app/docs/build-and-run/page.tsx_
    - _Validation: Compare commands/status against application sources; validate static content and metadata._
    - _Evidence: validation.md records source review, successful build/type/export checks and 15 browser layout cases with keyboard journeys; lint dependency and public deployment remain explicitly excluded._
  - [x] 1.4. Add useful support routing without an invented mailbox
    - _Requirements: 1.2, 2.1, 2.3_
    - _Depends on: 1.3_
    - _Reads: lib/content.ts_
    - _Writes: app/support/page.tsx_
    - _Validation: Check reporting/troubleshooting instructions and absence of automatic diagnostic submission._
    - _Evidence: validation.md records source review, successful build/type/export checks and 15 browser layout cases with keyboard journeys; lint dependency and public deployment remain explicitly excluded._
  - [x] 1.5. Integrate website navigation across documentation routes
    - _Requirements: 1.1, 1.2, 3.2_
    - _Depends on: 1.2, 1.4_
    - _Reads: lib/documentation.ts_
    - _Writes: lib/content.ts, components/header.tsx, components/footer-section.tsx, components/faq-section.tsx_
    - _Validation: Verify desktop/mobile docs links and homepage fragments across routes; keyboard menu and focus._
    - _Evidence: validation.md records source review, successful build/type/export checks and 15 browser layout cases with keyboard journeys; lint dependency and public deployment remain explicitly excluded._
  - [x] 1.6. Extend static-export checks and local preview support
    - _Requirements: 3.1, 3.2, 3.3_
    - _Depends on: 1.5_
    - _Reads: next.config.mjs, .github/workflows/pages.yml_
    - _Writes: scripts/check-export.py, package.json_
    - _Validation: pnpm build, pnpm typecheck, pnpm check:export; all local links and preserved assets._
    - _Evidence: validation.md records source review, successful build/type/export checks and 15 browser layout cases with keyboard journeys; lint dependency and public deployment remain explicitly excluded._
  - [x] 1.7. Record publication cutover and validation evidence
    - _Requirements: 2.3, 3.3_
    - _Depends on: 1.6_
    - _Reads: DEPLOYMENT.md_
    - _Writes: DEPLOYMENT.md, .agents/specs/product-documentation/validation.md_
    - _Validation: Distinguish local success from public availability; record screenshots, keyboard and untouched Git publication state._
    - _Evidence: validation.md records source review, successful build/type/export checks and 15 browser layout cases with keyboard journeys; lint dependency and public deployment remain explicitly excluded._

  - [x] 1.8. Disclose verified private source access on documentation and support pages
    - _Requirements: 2.1, 2.3, 3.2_
    - _Depends on: 1.7_
    - _Reads: app/docs/page.tsx, app/docs/build-and-run/page.tsx, app/support/page.tsx_
    - _Writes: app/docs/page.tsx, app/docs/build-and-run/page.tsx, app/support/page.tsx, .agents/specs/product-documentation/validation.md_
    - _Validation: Replace uncertain access wording with the verified private repository requirement; preserve destinations and no-submission behavior. Rebuild, typecheck and check exported links. Inspect the changed copy at desktop/mobile widths, keyboard reachability and console errors. Do not deploy or imply public routes are available._
    - _Evidence: Read-only 2026-10-21 GitHub API verification confirms simtropolis/made is private with issues enabled and discussions disabled. The three local pages now explicitly disclose private authorized access. Production build, TypeScript and exported-route/link checks pass. All six 1280/360px page captures are visually inspected without horizontal overflow; Tab reaches existing main links on all three mobile pages, console warnings/errors are empty. Viewport restored; no external issue/destination activated or publication performed. See validation.md._

### Milestone 2: Release-triggered documentation automation

- [~] 2. Prepare release-driven documentation publishing
  - [~] 2.1. Define exact-source public exports and change detection
    - _Requirements: 4.1, 4.2, 4.3_
    - _Depends on: 1.8_
    - _Reads: private docs/book.toml, private docs/src, private release generator, app/docs, scripts/check-export.py_
    - _Writes: private docs/publication.json, private docs/public-product-pages, private script/docs-publication.py, scripts/site_publication.py, scripts/release_docs.py_
    - _Validation: Test exact commit, allowlist/path/symlink boundaries, first/unchanged/changed/forced keys and successful-state selection; exclude private source and secrets from artifacts._
  - [ ] 2.2. Extend existing source release and website Pages workflows
    - _Requirements: 4.1, 4.2, 4.4, 4.5_
    - _Depends on: 2.1_
    - _Reads: private tooling/xtask workflow generators, .github/workflows/pages.yml_
    - _Writes: private generated docs workflow/release generator, .github/workflows/pages.yml_
    - _Validation: Validate generated workflows, exact-SHA release dispatch, authenticated artifact provenance, no PR secrets/deploy, serialization, manual force and success-only state. Preserve the unrelated Amplify/release owners._
  - [ ] 2.3. Exercise export, failure and public-verification boundaries
    - _Requirements: 3.2, 3.3, 4.3, 4.5, 4.6_
    - _Depends on: 2.2_
    - _Reads: scripts/check-export.py, scripts/site_publication.py, scripts/release_docs.py_
    - _Writes: scripts/test_docs_automation.py, private script/test-docs-publication.py, .agents/specs/product-documentation/validation.md_
    - _Validation: Run build/types/export checks, mutation/failure tests, generated workflow checks and local publication fixtures; verify book navigation/links/assets. Separate missing local tools, hosted credentials and actual publication from local evidence._
  - [ ] 2.4. Record operator setup and publication cutover gates
    - _Requirements: 2.3, 4.4, 4.5, 4.6_
    - _Depends on: 2.3_
    - _Reads: current GitHub Pages/main/environment settings_
    - _Writes: DEPLOYMENT.md, .agents/specs/product-documentation/validation.md_
    - _Validation: Document required scoped GitHub App secrets/settings, first/forced run, rollback/retention limitations, public artifact verification and the separately gated app catalog cutover. Confirm no dispatch/deploy/push occurred._

## Decomposition review

Each leaf owns one existing website boundary: discovery, shared layout, source pages, support page, integration, export verification or evidence. Header/footer integration follows shared layout. Evidence follows verification; nothing is marked complete without its required checks. No deployment leaf is authorized.


## Documentation paused — 21 October 2026

The user paused documentation to prioritize application branding. Implementation and evidence remain WIP, uncommitted and unpushed; no publishing or further documentation build-out is authorized in this phase. Full post-fix book browser validation and hosted publication remain incomplete. Resume from `/Users/ahmad.vegah/repos/imagineerings/zed/.agents/specs/product-branding-audit/documentation-wip-20261021.md`; this checkpoint records implemented owners, exact validation, public 404s, configuration gates and recovery limits. Existing unchecked/partial acceptance remains unchanged.
