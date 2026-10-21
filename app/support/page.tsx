import type { Metadata } from "next";
import Link from "next/link";
import { DocumentationShell } from "@/components/documentation-shell";
import { repository } from "@/lib/content";

export const metadata: Metadata = {
  title: "Help and support | imagineering",
  description:
    "Troubleshooting, diagnostic collection and repository issue reporting for Copper and Groovy.",
  alternates: { canonical: "/support/" },
  openGraph: { title: "Help and support | imagineering", url: "/support/" },
};

export default function SupportPage() {
  return (
    <DocumentationShell>
      <h1>Help and support</h1>
      <p>
        Start with the <Link href="/docs/copper/">Copper guide</Link>,{" "}
        <Link href="/docs/groovy/">Groovy preview guide</Link> or{" "}
        <Link href="/docs/build-and-run/">build prerequisites</Link>. This page
        provides troubleshooting and a repository reporting path. No support
        mailbox, response-time guarantee or new hosted-service policy is
        announced.
      </p>
      <h2>When a build or workspace fails</h2>
      <ul>
        <li>
          Keep the exact command and its full output. For Cargo, distinguish
          dependency download failures, metadata resolution, compilation and
          test discovery.
        </li>
        <li>
          Check that required tools and caches are on the project host,
          especially for SSH, WSL and containers.
        </li>
        <li>
          For an offline cache miss, choose whether to fetch dependencies in
          that project. Review network policy and trust before executing project
          tasks.
        </li>
        <li>
          If text overlaps or a panel clips a diagnostic, record the panel
          width, font size, theme and a screenshot alongside the sanitized text.
        </li>
      </ul>
      <h2>Report a reproducible issue</h2>
      <p>
        Use the application’s Help menu to copy system specifications, or
        describe your product, version/channel, operating system, architecture
        and execution host. For Groovy include JDK and language-provider
        versions. Include steps, expected behavior, actual behavior and a
        minimal example when possible.
      </p>
      <p>
        Review diagnostics before sharing: remove credentials, access tokens,
        personal paths, private repository names and sensitive project content.
        Opening this page does not upload diagnostics.
      </p>
      <p>
        <a href={`${repository}/issues/new/choose`}>
          Open the application repository issue form
        </a>
        . The application repository is private and requires authorized access.
        If you cannot access it, no alternative public mailbox is established
        here.
      </p>
      <h2>Provider and account issues</h2>
      <p>
        A model provider, upstream Zed-hosted service or third-party extension
        can have separate credentials, terms and support. Product branding does
        not rename those services or confer access. Include the provider name
        when reporting an integration problem, without sharing secrets.
      </p>
    </DocumentationShell>
  );
}
