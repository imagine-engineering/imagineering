import type { Metadata } from "next"
import Link from "next/link"
import { repository, sourceGuide } from "@/lib/content"

export const metadata: Metadata = {
  title: "Copper for Rust | imagineering docs",
  description:
    "Build and configure the enabled Copper Rust product from source.",
  alternates: { canonical: "/docs/copper/" },
  openGraph: {
    title: "Copper for Rust | imagineering docs",
    url: "/docs/copper/",
  },
}

export default function CopperDocumentation() {
  return (
    <>
      <p className="text-sm uppercase tracking-widest">
        Copper · Enabled product
      </p>
      <h1>Rust development with Copper</h1>
      <p>
        The catalog selects built-in rust-analyzer, Rust toolchain onboarding
        and the agentic-tools,rust-tools feature set. The supported bundle
        targets are Linux x86_64, macOS Apple silicon and Windows x86_64. Target
        declarations describe packaging scope, not evidence that this
        documentation change has tested each platform.
      </p>
      <h2>Run from source</h2>
      <p>
        Install the <Link href="/docs/build-and-run/">host prerequisites</Link>{" "}
        and run from the application repository root:
      </p>
      <pre>
        <code>
          cargo run -p zed --no-default-features --features
          agentic-tools,rust-tools
        </code>
      </pre>
      <p>
        The default product selection is rust, which displays as Copper. The
        internal Cargo package and binary remain named zed for compatibility.
      </p>
      <h2>Configuration and agents</h2>
      <p>
        Use the application’s Settings Editor for user settings. Project
        settings and task paths retain their existing .zed compatibility names.
        The agent display label and Rust Engineer profile are separate concepts;
        provider credentials and model access must be configured for the
        provider you use.
      </p>
      <h2>Build and dependency troubleshooting</h2>
      <p>
        Opening or building a Rust workspace can require dependencies absent
        from its Cargo cache. Run cargo fetch in the intended workspace on the
        project host when you choose to allow network access. A remote project
        needs its own host cache. A successful fetch does not prove the project
        compiles or that test discovery succeeds.
      </p>
      <p>
        <Link href="/support/">Collect a useful issue report</Link> if a
        workspace fails to load or discovery times out. Include the command,
        complete sanitized diagnostic, workspace size and host details.
      </p>
      <h2>Source and current limits</h2>
      <p>
        No new release download or update feed is provided by this guide. An
        enabled catalog entry and a source command do not qualify a shipping
        build. Multiplayer and Comfy are separate opt-ins from the standard
        feature set.
      </p>
      <p>
        <a href={sourceGuide}>Application build guide</a> ·{" "}
        <a
          href={`${repository}/blob/dev/docs/src/development/product-flavors.md`}
        >
          Product identity and packaging
        </a>
      </p>
    </>
  )
}
