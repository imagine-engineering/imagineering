# Local documentation validation — 20 October 2026

Implemented locally, uncommitted and unpushed. No Pages workflow was triggered.
Website baseline was clean main at d109bcefdf07d9ee6c436a8339a8483166fa6ff2.
The app repository has independent uncommitted branding and earlier Cargo work;
these website results do not qualify that application.

| Check | Exact result |
| --- | --- |
| Existing owners | Next.js 15.5.18 App Router; static output export; trailingSlash true; no basePath; existing Pages workflow. No docs/MDX tree or support mailbox existed. Prior website chat confirmed clean state and preservation constraints. |
| Build | pnpm build passed three times, including the final keyboard markup, multiline command fix and explicit dev-branch clone command. Five substantive new routes exported. |
| TypeScript | pnpm typecheck passed after the final build. |
| Export validation | pnpm check:export passed: 8 HTML outputs, 41 local references, 11 font references; all links/fragments and docs metadata/current-page/skip targets verified. |
| Assets | Existing exporter verified public asset bytes, original social image and original native Copper screenshot SHA-256. No artwork was replaced. |
| Browser layout | All 5 routes checked at 1440, 390 and 320 px (15 cases). scrollWidth equalled clientWidth in every case. Correct page headings, selected navigation and canonicals; zero nested interactive elements. |
| Keyboard | Skip-link Enter focused documentation-content. Product navigation worked. Mobile menu Enter opened dialog; Escape closed it and focus returned to Toggle navigation menu. Keyboard Features link navigated from support to /#features-section. |
| Browser logs | No warnings/errors captured across these journeys. |
| Formatting | Cached Prettier with --no-semi formatted new docs/layout/navigation sources and DEPLOYMENT.md. No package installation or lockfile change. |
| Whitespace | git diff --check passed. |
| Lint | pnpm lint failed: eslint: command not found. Existing package.json declares the script but does not install ESLint. No lint success claimed. |
| Public availability | Read-only HEAD requests for https://imagine.engineering/docs/ and /support/ returned HTTP 404 on 20 October 2026. These routes remain local and are not advertised as live. |

Browser evidence: artifacts/documentation/documentation-browser.json and desktop,
Copper desktop, mobile and narrow screenshots. The browser text enlargement
shortcut did not change measured text size (16px); no enlarged-text or screen
reader qualification is claimed. The requested native-app enlarged-text checks
remain part of the application branding validation; Copper and guarded Groovy have passed their
inspected local 14/20-point agent and Settings journeys. These are native smoke
checks, not release or platform qualification.

Application Help keeps the verified homepage/source destinations until separately
authorized website deployment and HTTPS checks. The catalog is the cutover owner;
no undeployed documentation route was put in shipping defaults. No support
mailbox, SLA, hosted-service operator or legal policy was invented.

After the explicit dev-branch clone correction, the build page was rechecked at
1440/390/320 px: no horizontal overflow, exact copyable command preserved.
Cached Prettier --no-semi --check passed for the final changed page.


## Verified private source disclosure — 2026-10-21 (1.8)

Read-only authenticated repository inspection confirms simtropolis/made is private, issues enabled, discussions disabled. The old simtropolis/zed destination cannot be resolved by the current account. Homepage anchors are link-publication evidence, not public source accessibility. The docs index, build guide and support page now explicitly say authorized private-repository access is required. No routes or source destinations changed, no mailbox or public issue service is invented.

After this copy correction, pnpm build exits 0 (Next 15.5.18 production static export), pnpm typecheck exits 0, pnpm check:export exits 0 (8 HTML routes, 41 local references, 11 font references, original social PNG and Copper screenshot intact), and git diff --check passes. Cached Prettier formats the three changed TSX pages; no dependency installed. Six local production-export captures across /docs/, /docs/build-and-run/ and /support/ at 1280/360px all show the disclosure, readable layouts and no horizontal overflow. Mobile keyboard Tab reaches a main link in 12/9/9 steps; no external destination is activated. Console warning/error list is empty. Prior broader navigation/reduced-motion checks remain historical and are not rerun for this copy-only correction. Temporary viewport is reset.

Evidence: /Users/ahmad.vegah/.codex/visualizations/2026/10/20/01a1594c-2e66-71d1-81a6-8a53b89ea8fe/docs-private-access-browser-20261021.json and six docs-private-access-*.png captures. Application-side interim public/private Help routing is separately pending user policy (branding D2/8.91). Public HTTP recheck still gives homepage 200, /docs/ 404 and /support/ 404. These local pages are not deployed, committed or pushed.


## Documentation paused — 21 October 2026

The user paused documentation to prioritize application branding. Implementation and evidence remain WIP, uncommitted and unpushed; no publishing or further documentation build-out is authorized in this phase. Full post-fix book browser validation and hosted publication remain incomplete. Resume from `/Users/ahmad.vegah/repos/imagineerings/zed/.agents/specs/product-branding-audit/documentation-wip-20261021.md`; this checkpoint records implemented owners, exact validation, public 404s, configuration gates and recovery limits. Existing unchecked/partial acceptance remains unchanged.
