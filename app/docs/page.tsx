import type { Metadata } from "next";
import Link from "next/link";
import { repository } from "@/lib/content";

export const metadata: Metadata = {
  title: "Documentation | imagineering",
  description:
    "Source-based setup and product status for Copper and the guarded Groovy developer preview.",
  alternates: { canonical: "/docs/" },
  openGraph: { title: "Documentation | imagineering", url: "/docs/" },
};

export default function DocumentationPage() {
  return (
    <>
      <p className="text-sm uppercase tracking-widest">
        Developer documentation
      </p>
      <h1>Start with your product</h1>
      <p>
        Copper is the enabled Rust product in the application catalog. Groovy is
        a planned Java and Kotlin product with an explicitly guarded local
        developer preview. These guides describe repository configuration and
        source-build workflows; they do not certify a release or every provider
        and platform.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <section className="rounded-xl border bg-card p-6">
          <h2 className="!pt-0">Copper</h2>
          <p className="my-3">
            Rust editing and the enabled Cargo feature set.
          </p>
          <Link href="/docs/copper/">Read the Copper guide</Link>
        </section>
        <section className="rounded-xl border bg-card p-6">
          <h2 className="!pt-0">Groovy</h2>
          <p className="my-3">
            Java and Kotlin setup for the development-only candidate.
          </p>
          <Link href="/docs/groovy/">Read the Groovy preview guide</Link>
        </section>
      </div>
      <h2>Build, configure and get help</h2>
      <ul>
        <li>
          <Link href="/docs/build-and-run/">
            Build prerequisites and exact launch commands
          </Link>
        </li>
        <li>
          <Link href="/support/">Troubleshooting and reporting a problem</Link>
        </li>
      </ul>
      <h2>Scope and source</h2>
      <p>
        Reviewed against the application catalog, README and development guides
        on 20 October 2026. Source links follow the development branch of the
        private application repository and require authorized access. Existing
        upstream reference documentation remains in the application repository;
        it has not been relabelled as a verified product manual.
      </p>
      <p>
        Release download instructions, a full settings reference, provider and
        platform qualification, and hosted-service policies are not covered by
        these initial guides. No new downloads, subscription plans or support
        guarantees are announced here.
      </p>
      <p>
        <a href={`${repository}/blob/dev/products/flavors.toml`}>
          Product catalog
        </a>{" "}
        ·{" "}
        <a href={`${repository}/tree/dev/docs`}>
          Application documentation sources
        </a>
      </p>
    </>
  );
}
