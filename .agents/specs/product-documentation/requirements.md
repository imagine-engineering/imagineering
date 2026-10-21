# Requirements: Product documentation

## Scope

Extend the existing Imagineering website with useful product documentation. Keep
its Next.js App Router, static export, design and Pages deployment owner. Leave
all work uncommitted and unpushed; no deployment is authorized.

## Requirements

### Requirement 1: Existing website ownership

1. **1.1** THE documentation SHALL reuse the website stack, shared branding and
   deployment, without creating a parallel documentation service.
2. **1.2** THE website SHALL provide documentation navigation and substantive
   Copper, Groovy, build and support entry pages with page-specific metadata.

### Requirement 2: Truthful source-based content

1. **2.1** THE pages SHALL derive commands, product identity and status from the
   application catalog and current source guides, identifying uncovered content.
2. **2.2** THE pages SHALL retain Groovy's planned/debug-preview restrictions,
   compatibility identifiers and source provenance without claiming release parity.
3. **2.3** THE implementation SHALL distinguish locally implemented routes from
   publicly deployed destinations; application defaults SHALL use only the approved public homepage, hiding private
   GitHub destinations, until publication and HTTPS verification authorize the cutover.

### Requirement 3: Accessible static delivery

1. **3.1** THE website SHALL export and preview the routes with its existing build.
2. **3.2** THE routes SHALL have working local navigation, fragments, canonical
   URLs, keyboard skip links and current-page navigation at desktop/mobile sizes.
3. **3.3** THE delivery SHALL preserve existing artwork, product screenshot,
   unrelated work and publication controls, with exact validation evidence.


### Requirement 4: Release-driven private-source publishing

1. **4.1** WHEN a published Copper release or an explicit manual rebuild requests documentation, THE pipeline SHALL resolve and build the exact released commit, including the product documentation and approved upstream-derived reference book.
2. **4.2** THE publisher SHALL compare content and relevant renderer/build inputs with the last successfully verified docs deployment, publish the first deployment, skip unchanged deployments, and support an explicit forced rebuild.
3. **4.3** THE pipeline SHALL export only allowlisted product pages and generated reference/static website output; private source checkouts, credentials, tool caches and unrelated repository files SHALL never enter public artifacts.
4. **4.4** THE source and website workflows SHALL coordinate with scoped authentication, preserving the existing GitHub Pages host, default-branch process and unrelated release/Amplify work. PR validation SHALL not expose publishing credentials.
5. **4.5** THE previous public site SHALL remain installed when preparation/build or Pages deployment fails. Only successful HTTPS verification of the intended artifact SHALL advance durable docs deployment state or permit later application-link cutover.
6. **4.6** THE local deliverable SHALL include failure-boundary tests, exact validation and required repository/environment configuration; no publication, workflow dispatch, push or credential change is authorized now.
