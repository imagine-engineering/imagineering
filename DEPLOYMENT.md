# GitHub Pages

Production: https://imagine.engineering

Repository: https://github.com/imagine-engineering/imagineering (public; default branch `main`). Pages uses GitHub Actions, configured in repository Settings → Pages. The custom domain belongs in those settings; a CNAME file is not needed for an Actions deployment.

## Build and preview

Use Node 24 and pnpm 11.5.2 (pinned in `package.json`):

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm typecheck
pnpm check:export
python3 -m http.server 3110 --bind 127.0.0.1 --directory out
```

Open http://localhost:3110. `next start` is for server builds and does not serve this static export. No production Next.js server is required. `out/` and local verification screenshots in `artifacts/` are ignored.

The workflow builds on pushes to the repository's default branch and manual dispatch on that branch. Pull requests run the same checks without deploying. Deployment needs a successful build, integrated TypeScript validation, the separate type check, and export validation. The `github-pages` environment must permit the default branch. Branch protections and repository visibility must be preserved.

The site uses root-relative asset paths for the custom domain, with no repository `basePath`. Next.js exports local font files, unoptimized images, a static `.png` social image, HTML, JavaScript and CSS. Vercel-only analytics is removed. `.nojekyll` keeps underscore assets available. Existing client interactions and animations require no server. Export validation checks local references and fragments, font files, metadata, social image bytes/dimensions, and unchanged public assets.

The genuine Copper screenshot remains the native capture from application `origin/dev` revision `eeb85f875d7e8f4666a2b18aec47157f3605d8c5`. SHA-256: `c059ac3e110494ffb6f3e80287c293629240313128a75926c46d43b4dfcc0fed`. Source/build/documentation links still require access to the existing private product repository. There are no new download links.

## DNS and HTTPS

Change only the domain's web-routing records. Preserve email and all unrelated DNS records.

| Type  | Host                                         | Value                          |
| ----- | -------------------------------------------- | ------------------------------ |
| A     | @                                            | 185.199.108.153                |
| A     | @                                            | 185.199.109.153                |
| A     | @                                            | 185.199.110.153                |
| A     | @                                            | 185.199.111.153                |
| CNAME | www                                          | imagine-engineering.github.io  |
| TXT   | \_github-pages-challenge-imagine-engineering | 6e35de1daf18a0fdeb81a5e34143a6 |

The `www` record is optional. It points to the actual repository owner, without a repository path. On 9 October 2026 the apex instead returned `13.248.243.5` and `76.223.105.230`, with no AAAA records. Replace those web A records; do not add competing apex CNAME records. If IPv6 is enabled later, use GitHub's documented Pages AAAA addresses.

After TXT propagation, verify the domain at https://github.com/organizations/imagine-engineering/settings/pages. Retain the TXT record after verification. After the A records resolve to GitHub and its certificate is issued, enable **Enforce HTTPS** at https://github.com/imagine-engineering/imagineering/settings/pages. A successful deployment alone does not establish correct DNS, ownership verification, or HTTPS readiness.

References: [Next.js static export](https://nextjs.org/docs/15/app/guides/static-exports), [official Pages workflow](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [custom-domain DNS](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site), [ownership verification](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages).

## Product documentation

Documentation uses the same Next.js App Router and static Pages export as the
website. Routes are `/docs/`, `/docs/copper/`, `/docs/groovy/`,
`/docs/build-and-run/` and `/support/`. Page content lives in `app/docs/` and
`app/support/`; shared navigation and layout use `components/documentation-*`
and `lib/documentation.ts`. Website links continue to use `lib/content.ts`.
There is no second site, runtime Markdown service or separate deployment.

Run `pnpm dev --port 3110` for a local editing preview, or `pnpm build`,
`pnpm check:export` and `pnpm preview` for the actual exported artifact. The
existing export check verifies every local link/fragment and documentation
canonical, current-page navigation and skip target. It also protects the original
assets and native Copper screenshot.

These documentation and support routes are implemented locally and have not
been deployed by this task. Their eventual public base is
`https://imagine.engineering/`. A successful local build does not make the
production URLs available. Deployment remains the existing default-branch Pages
workflow and requires separate user authorization; do not push to trigger it.

Application Help currently hides private GitHub destinations and uses only the
approved public homepage, preserving action IDs and excluding diagnostic queries.
After an authorized website publication, verify all five routes over HTTPS before
switching the application product catalog to `/docs/copper/`, `/docs/groovy/` and
`/support/`. Do not redirect a shipping application to an undeployed route.

Initial content is derived from the application catalog, README and development
guides reviewed on 20 October 2026. Groovy remains planned/guarded. Source links
may require repository access. No new mailbox, hosted service, release package,
pricing or support guarantee is inferred. The application repository's mdBook
reference book is preserved; these focused product entry guides do not duplicate
its renderer or claim its upstream deployment belongs to Imagineering.

## Released documentation publication (prepared locally, not enabled or deployed)

The existing `.github/workflows/pages.yml` remains the only production deployer.
Its PR job builds the existing Next.js export, checks types, all local links,
navigation, fragments and assets, and runs documentation regression tests. It
uploads a seven-day downloadable preview artifact. GitHub Pages' native PR preview
feature is not publicly available; no competing preview host is configured.
See the [official deploy-pages preview status](https://github.com/actions/deploy-pages#inputs).

A main push or manual dispatch requests `release_docs.yml` in the private
`simtropolis/made` source repository. The existing private release publisher also
dispatches that workflow explicitly after successful publication: releases made
with `GITHUB_TOKEN` do not trigger a second ordinary release event. Externally
published stable releases can use its `release: published` trigger. Duplicate
requests are serialized and coalesce at the final content-key comparison.
The unrelated Simtropolis Amplify webhook is preserved.

The private workflow selects a published stable `rust-vX.Y.Z` release, peels its
tag to an exact commit, and checks out that SHA separately from workflow control
code. The released commit must contain `docs/publication.json`, all five approved
`docs/public-product-pages/` pages and the existing docs preprocessor's pinned
mdBook build entry. Older releases lacking this contract fail closed. It never
silently substitutes development-branch content. Protect release tags against
rewriting in repository rules before operational use.

The approved public scope includes those product pages and the complete
upstream-derived reference book. The existing mdBook 0.4.40 library,
keybinding/action/settings preprocessors and theme build the book. The released
Copper action manifest is generated headlessly using its enabled features.
Analytics and consent integration keys are empty. Generated reference output is
mounted at `/docs/reference/` with an upstream provenance notice; existing legal
and service identities are retained. The local Next reference overview is
removed only in the ephemeral release build so it cannot overwrite the book's
index. No second documentation framework or host is introduced.

The source job exports approved inputs to a separate isolated website job, which has Actions read but no private Contents permission or source checkout. That job checks out the public website at an exact trusted main commit,
overlays only the allowlisted public pages and built book, then uses the existing
pnpm/Next static export. The change key hashes approved source/build inputs,
rendered reference output and relevant website inputs. Commit SHAs, release tags,
run IDs and timestamps do not themselves invalidate the key. The full application
checkout, environment files, Git data, source maps, Rust/TypeScript sources and
build caches cannot enter the transferred archive. Its only member is the checked
static site tarball, retained in private Actions for 30 days.

The public workflow authenticates the private run, requires its success, rejects
PR/fork/untrusted-branch artifacts and unsafe paths, links, duplicate members,
source file types and mismatching inventories. A website SHA mismatch requires a
new build. It queries durable `github-pages` deployment records with payload kind
`imagineering-documentation-v1`; only records with successful status are baselines.
First deployment always publishes. Equal input keys skip the Pages upload/deploy;
manual `force` rebuilds and publishes regardless. API errors fail rather than
being interpreted as an empty history. State is not an expiring cache.

Build/check/artifact failures occur before Pages deployment, preserving the
published site. A failed atomic Pages deployment retains its previous accepted
site. After a successful deploy, all six documentation/support entry routes and
their response hashes must match the released source SHA and requested input key
over HTTPS, with bounded retries. Only then is the durable success record written.
A failed post-deploy verification is reported without advancing success state;
it does not automatically restore an already accepted Pages deployment. Retain
its verification artifact and investigate or manually redeploy the last good
release with `force`; rollback is subject to the private artifact's retention,
or an exact-source rebuild. No untested automatic rollback is claimed.

### Required configuration before an authorized rollout

Read-only verification on 21 October 2026 found Actions **disabled** in
`simtropolis/made` and enabled in the website repository. Only the unrelated
`AMPLIFY_REBUILD_WEBHOOK` source secret exists; both documentation App pairs and
the website deployment-environment secrets are absent. No settings were changed.
Enable private-repository Actions only during the separately authorized rollout.

- Land the workflow/controller changes in both repositories and include the
  publication allowlist/content/build entry in an eligible released commit.
  Until then these local changes cannot be dispatched successfully.
- Private source secrets `IMAGINEERING_DOCS_APP_ID` and
  `IMAGINEERING_DOCS_APP_PRIVATE_KEY`: a GitHub App installed only on
  `imagine-engineering/imagineering`, with Actions write for dispatch.
- Website `github-pages` environment secrets `SOURCE_DOCS_APP_ID` and
  `SOURCE_DOCS_APP_PRIVATE_KEY`: a GitHub App installed only on
  `simtropolis/made`, with Actions write for dispatch and artifact access, plus
  mandatory Metadata read. It needs no private Contents permission.
- Preserve Pages Actions hosting, custom domain, HTTPS enforcement and the
  environment's main-only deployment rule. Allow the repository workflow
  `GITHUB_TOKEN` to request scoped Pages/OIDC/deployments permissions, and source
  release follow-up to request Actions write. No token goes to a PR job.
- If organizational policy restricts action versions or cross-repository App
  dispatch, allow the existing Pages/pnpm actions and the GitHub App-token and
  artifact actions used by the prepared workflows. Configure private Actions
  retention to retain intended output long enough for queued deployment.

For an authorized manual run, use the existing website Pages workflow's
`release_tag` and boolean `force` inputs with an empty `source_run_id`.
`source_run_id` is a coordination input supplied by the private builder, not an
operator-provided artifact URL. A first run with no verified state publishes even
without force. Nothing in this task has dispatched either workflow or configured
these secrets/settings.

Application Help stays on the public homepage. After separately authorized
publication and matching public verification, review the catalog change to the
appropriate Copper/Groovy documentation and support routes. Preserve all legacy
action identifiers and keep diagnostic data out of URLs. Local build success is
not public availability or permission to publish.


### Content ownership and coordinated bootstrap

The private repository's `docs/public-product-pages/` is the canonical released
product content. The matching website `app/docs/` and `app/support/` pages are
local/PR preview snapshots; production replaces their bodies from the selected
release. Edit the private canonical pages for publication and deliberately refresh
preview snapshots when needed. Website layouts, navigation, branding, assets and
build/deployment code remain owned here. This is one deployed site, not two
independently authored production manuals.

Landing this Pages workflow makes production website updates depend on the
private docs coordination. Prepare the App configuration, enable private Actions
and include the publication contract in an eligible stable release as a
coordinated rollout. While bootstrap prerequisites are absent, push checks can
run but publication fails closed and retains the published site. It does not
silently deploy unreleased preview documentation. No rollout is performed now.
