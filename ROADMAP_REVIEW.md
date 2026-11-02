# Deferred feature-roadmap review

## Branch boundary

`product-roadmaps` starts at the merged content baseline `e7e1e4250c98b94256ccd01ffb0ab84b02875655` (content PR #2, commit `f98b183c211148290b8a602c3005396a3f696784`). It has no ancestry from the unfinished documentation/publishing draft PR #1 checkpoint `f7e80c9`.

The original combined work is preserved at local snapshot `0e4973c93d64c9656b3b37a62fa3abcdc26d1ba8` on `product-content-roadmaps`. All 189 original file hashes match that snapshot. A separate file archive and raw backup-location record remain under local artifacts/branch-split-20261102/. Draft PR #1 was neither merged nor changed.

## Deferred changes restored

- `components/product-roadmap.tsx`: existing styled feature cards and accessible Copper/Groovy/Sim tabs.
- `lib/product-roadmaps.ts`: all original feature items, development/planned states, qualifications and roadmap FAQ, moved out of shared published product data. A TypeScript-transpiled semantic comparison confirms all three data sets and the FAQ match the saved snapshot.
- `app/page.tsx`: roadmap import and AnimatedSection only.
- `components/header.tsx` and `components/footer-section.tsx`: roadmap navigation only; current canonical repository links remain unchanged.
- `components/faq-section.tsx`: append the roadmap FAQ and restore its section description, without moving general product copy back into the deferred branch.
- `scripts/check-export.py`: roadmap target, three product tabs and feature-focused/no-source-evidence guards only, on top of content/reference validation.

The shared `lib/product-content.ts`, `lib/content.ts`, metadata, Copper artwork, hero copy/layout, wordmark, palette, package files and production Pages workflow remain byte-identical to the merged baseline. No docs/support pages, release coordinator, docs test suite, owner/secrets configuration or unfinished publishing automation are included. Documentation continues linking directly to existing canonical repository pages.

## Validation

Production build, TypeScript, export checks and git diff --check pass. Export remains 3 HTML outputs with 29 local references and 11 font references; original social dimensions, protected public assets and genuine Copper screenshot checks pass. The documentation WIP's 37 tests are deliberately not brought into either split branch. Standalone ESLint remains unavailable in the baseline.

Desktop keyboard ArrowRight/End selection works. All three mobile product tabs select exactly one panel; no overflow at tested desktop/mobile sizes; roadmap has zero source-evidence links and there are no local deferred docs/support links. Browser warning/error logs are empty. User-directed Sim naming and feature-focused copy are preserved. No delivery date, completion percentage or new release commitment was added.

Local review captures: artifacts/branch-split-20261102/roadmaps-desktop.jpg and roadmaps-mobile.jpg. Content-only local/live captures and preservation/scope reports are in the same ignored evidence directory. The roadmap remains separate and unmerged for review; its PR cannot deploy through the unchanged main-only Pages pipeline.
