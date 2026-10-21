# Design: Product documentation

## Existing context

The website repository is imagine-engineering/imagineering, checkout
/Users/ahmad.vegah/repos/projects/imagineering, clean main at d109bce before work.
The chat “Update Imagineering product content” confirmed no pending edits or docs
framework. lib/content.ts owns destinations; app/ is Next.js App Router. Static
export, trailingSlash and no basePath are configured in next.config.mjs. The
existing Pages workflow builds PRs and deploys default-branch pushes. Nothing is
pushed or deployed by this task.

The application repository separately owns an upstream-derived mdBook reference
book and Rust action/keybinding preprocessor. Its old zed.dev deployment prose
is not evidence of Imagineering publication. Reuse its existing renderer to produce static reference output inside the same
website export; no separate runtime documentation service is introduced.

## Components and routes

Use app/docs/layout.tsx and components/documentation-shell.tsx with the existing
Header, FooterSection, SVG SiteWordmark and theme. lib/documentation.ts owns
navigation; a small client component applies aria-current using usePathname.
Server-rendered route pages own content and metadata at /docs/, /docs/copper/,
/docs/groovy/, /docs/build-and-run/ and /support/. No new dependency is required.
Shared homepage fragment links become /#fragment so they work across routes.
Header scroll interception applies only on the homepage. Documentation links
use one interactive anchor rather than nested buttons.

Content is derived from products/flavors.toml, README.md, rust-toolchain.toml,
docs/src/development/product-flavors.md, groovy.md and its provider matrix,
reviewed 20 October 2026. Commands preserve internal zed package names. Missing
release/settings/provider policies are explicitly scoped, not empty pages.
Support provides useful diagnostics/reporting instructions; no mailbox is
invented and opening a page uploads nothing.

## Delivery and application links

Public base: https://imagine.engineering/. New documentation/support routes are
local changes pending publication. lib/content.ts links website navigation to
these local routes. Application Help uses the approved homepage only under the user decision of 21 October 2026; private GitHub entries are hidden and legacy action identifiers remain compatible. After separately authorized publication, verify HTTPS routes
before changing app defaults to the new docs/support destinations. This prevents
shipping links to unavailable production pages.

## Validation

Reuse pnpm build, pnpm typecheck and pnpm check:export. The export validator
checks every local link/fragment and existing assets, plus expected docs paths,
content, canonicals, aria-current and keyboard skip targets. Browser verification
covers 1440, 390 and 320 px, each documentation route, cross-route homepage links,
mobile menu open/close/Escape, keyboard skip/focus and console errors. Record
text-enlargement evidence only if actually measured. Existing original Copper
screenshot and icons must remain byte-identical. No public-route success or
native-app qualification follows from these website checks.

## Requirements traceability

| Requirement | Design owner | Verification |
| --- | --- | --- |
| 1.1 | Existing Next.js layout/config | Build and no second framework |
| 1.2 | Product/support pages and navigation | Exported content and metadata |
| 2.1 | Catalog/README/development sources | Exact commands and provenance |
| 2.2 | Groovy guard and technical names | Source/status comparison |
| 2.3 | Publication gate and app catalog | Local versus public destination evidence |
| 3.1 | Existing build and preview | pnpm build and preview smoke |
| 3.2 | Export/browser checks | Links, keyboard, responsive captures |
| 3.3 | Asset and Git preservation | Byte hashes and uncommitted state |


## Release publication extension

The user explicitly approves both focused product documentation and the upstream-derived reference book for public documentation output. Product entry source will be allowlisted under private docs/public-product-pages, with existing website pages retained as PR/local preview snapshots. The book keeps its current mdBook 0.4.40/preprocessor/theme ownership and attribution; it is mounted under /docs/reference/ in the same Pages artifact. No Cloudflare deploy owner is revived and existing Simtropolis Amplify refresh remains separate.

The private release workflow resolves the published tag to an immutable commit, verifies its checkout, renders the reference and exports only the fixed product-page mapping. Its change key combines generated reference output, allowlisted product content and relevant website/build inputs, excluding release timestamps/run IDs so unchanged releases coalesce. State is a success-only GitHub deployment record for the existing Pages environment, written after matching public artifact verification; it does not rely on an expiring cache. First deployment and explicit force publish. Missing/malformed state or API errors fail closed rather than being mistaken for no changes.

The private workflow builds the public site's existing Next.js static export at a pinned website commit, packages only validated output, then authenticates a dispatch to the existing website Pages workflow. The website independently checks trusted source workflow/run/artifact identity and digest, serializes production, rechecks the last successful change key, and deploys only the approved static artifact. Failed build/failed atomic Pages deployment never replaces production. Post-deploy route verification is separate from deployment acceptance; no successful marker or app-link cutover follows a failed check. Public workflow credentials are limited to Actions coordination/artifact access in the private source repository, without private Contents access; publishing tokens never reach fork PR jobs.

Default website pushes continue through the same workflow: after website checks they request a rebuild against the latest/pinned released private documentation. Manual dispatch supports an explicit release tag and force flag. PRs retain downloadable review artifacts; native Pages PR previews remain unavailable publicly. Private source PRs build full documentation without publishing credentials. No second host, deployment branch or source-copy commit automation is introduced.

Detailed authentication, retention/recovery and exact local validation are recorded in DEPLOYMENT.md and validation.md. The website chat confirmed Actions Pages on main, HTTPS, no alternate preview integration and no pending workflow changes. Remote credentials/configuration are not modified by this work.


The implementation separates source and site jobs: only the source job can read
private Contents. Approved page/book inputs cross a private artifact boundary;
website code executes in a separate job with Actions read and no private source
checkout. Website build refs must equal the exact trusted current main commit.
The final transfer validates GitHub's SHA-256 artifact digest and an explicit
per-file output inventory before deployment. Runner ownership metadata is removed.
For unchanged keys, the previously verified public build must still match before
skipping. The book wrapper provides a focusable main/skip link and provenance
notice without changing upstream legal/service identity.


| Requirement | Implementation owner | Verification |
| --- | --- | --- |
| 4.1 | Private release selector and generated source job | Actual tag-peeling fixture and pinned checkout tests |
| 4.2 | release_docs.py input keys and last_success | First/unchanged/changed/force and deterministic book tests |
| 4.3 | Private export allowlist and final archive inventory | Source/type/link/traversal/digest regressions |
| 4.4 | Existing Pages workflow and isolated private site job | Actionlint, generated workflow and credential-guard tests |
| 4.5 | Pages deployer and public verification/success record | Failure/hash fixtures; actual publication remains unexecuted |
| 4.6 | Regression suite, operator guide and validation receipts | Local builds/checks, read-only settings, no publication |

Addresses: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6
