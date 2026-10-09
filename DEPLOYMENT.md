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

| Type | Host | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | imagine-engineering.github.io |
| TXT | _github-pages-challenge-imagine-engineering | 6e35de1daf18a0fdeb81a5e34143a6 |

The `www` record is optional. It points to the actual repository owner, without a repository path. On 9 October 2026 the apex instead returned `13.248.243.5` and `76.223.105.230`, with no AAAA records. Replace those web A records; do not add competing apex CNAME records. If IPv6 is enabled later, use GitHub's documented Pages AAAA addresses.

After TXT propagation, verify the domain at https://github.com/organizations/imagine-engineering/settings/pages. Retain the TXT record after verification. After the A records resolve to GitHub and its certificate is issued, enable **Enforce HTTPS** at https://github.com/imagine-engineering/imagineering/settings/pages. A successful deployment alone does not establish correct DNS, ownership verification, or HTTPS readiness.

References: [Next.js static export](https://nextjs.org/docs/15/app/guides/static-exports), [official Pages workflow](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [custom-domain DNS](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site), [ownership verification](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages).
