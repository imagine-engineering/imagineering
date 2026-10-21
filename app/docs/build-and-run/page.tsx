import type { Metadata } from "next";
import Link from "next/link";
import { repository, sourceGuide } from "@/lib/content";

export const metadata: Metadata = {
  title: "Build and run | imagineering docs",
  description:
    "Host prerequisites and source-build commands for Copper and the Groovy candidate.",
  alternates: { canonical: "/docs/build-and-run/" },
  openGraph: {
    title: "Build and run | imagineering docs",
    url: "/docs/build-and-run/",
  },
};

export default function BuildDocumentation() {
  return (
    <>
      <h1>Build and run from source</h1>
      <p>
        You need Git, rustup and the native dependencies for the build host. The
        application repository pins Rust 1.97.1; rustup selects the pinned
        toolchain. These commands use the development branch reviewed by these
        guides. The application repository is private and requires authorized
        access.
      </p>
      <pre>
        <code>{`git clone --branch dev https://github.com/simtropolis/made.git
cd made`}</code>
      </pre>
      <h2>Prepare native dependencies</h2>
      <ul>
        <li>
          <a href={`${repository}/blob/dev/docs/src/development/macos.md`}>
            macOS
          </a>
          : Xcode, command-line tools and CMake.
        </li>
        <li>
          <a href={`${repository}/blob/dev/docs/src/development/linux.md`}>
            Linux
          </a>
          : inspect and run ./script/linux to install distribution dependencies.
        </li>
        <li>
          <a href={`${repository}/blob/dev/docs/src/development/windows.md`}>
            Windows
          </a>
          : MSVC C++ tools, Spectre-mitigated libraries, Windows SDK and CMake.
        </li>
      </ul>
      <h2>Choose the product</h2>
      <p>
        <Link href="/docs/copper/">Copper</Link> uses the default rust identity:
      </p>
      <pre>
        <code>
          cargo run -p zed --no-default-features --features
          agentic-tools,rust-tools
        </code>
      </pre>
      <p>
        <Link href="/docs/groovy/">Groovy</Link> requires explicit preview
        identity, dev channel and JVM features. Use the guarded command in its
        guide; a release build intentionally fails the preview guard.
      </p>
      <h2>Check the catalog and source</h2>
      <pre>
        <code>{`cargo xtask products --check
./script/clippy`}</code>
      </pre>
      <p>
        The existing generator owns derived product constants. Use the
        repository clippy script rather than substituting cargo clippy. These
        commands can require significant disk space and cached or downloaded
        dependencies. This guide does not claim the full application validation
        matrix passed.
      </p>
      <h2>Packaging and updates</h2>
      <p>
        Use cargo xtask bundle --product rust for a supported host bundle.
        Product identity, signing and updates are separate from compiling a
        binary. The updater requires the configured product update base URL;
        this documentation does not supply a new feed or change release gates.
      </p>
      <p>
        <a href={sourceGuide}>Canonical source build guide</a> ·{" "}
        <Link href="/support/">Build and runtime troubleshooting</Link>
      </p>
    </>
  );
}
