import type { Metadata } from "next"
import Link from "next/link"
import { groovyGuide, repository } from "@/lib/content"

export const metadata: Metadata = {
  title: "Groovy JVM developer preview | imagineering docs",
  description:
    "Guarded local setup for the planned Groovy Java and Kotlin product.",
  alternates: { canonical: "/docs/groovy/" },
  openGraph: {
    title: "Groovy JVM developer preview | imagineering docs",
    url: "/docs/groovy/",
  },
}

export default function GroovyDocumentation() {
  return (
    <>
      <p className="text-sm uppercase tracking-widest">
        Groovy · Planned · Developer preview
      </p>
      <h1>Try the guarded JVM candidate</h1>
      <p>
        Groovy is the Java and Kotlin focused product with catalog ID jvm. It
        remains planned, has no release targets, and cannot be bundled as an
        enabled release. The product name does not imply support for the Groovy
        programming language.
      </p>
      <h2>Build a local debug candidate</h2>
      <p>
        Prepare the{" "}
        <Link href="/docs/build-and-run/">application build environment</Link>.
        In a POSIX shell at the repository root:
      </p>
      <pre>
        <code>{String.raw`ZED_PRODUCT_ID=jvm ZED_PRODUCT_DEV_PREVIEW=1 ZED_RELEASE_CHANNEL=dev \
  cargo build -p zed --no-default-features \
  --features agentic-tools,jvm-tools,runtime-shaders`}</code>
      </pre>
      <p>
        All three environment values are required. The guard permits only the
        debug profile and dev channel. Selecting jvm-tools alone does not select
        Groovy. The resulting local candidate has its own development identity;
        it is not a signed installer or a supported release.
      </p>
      <h2>Prepare the project host</h2>
      <p>
        The Java language server needs a JDK 21 or newer on its execution host.
        JAVA_HOME, the JDTLS runtime and the project’s Maven or Gradle toolchain
        can differ. Set lsp.jdtls.settings.java_home when an explicit JDTLS
        runtime is needed; this does not select the JDK for build or test Tasks.
      </p>
      <p>
        Open a folder with pom.xml or a Gradle build/settings file. A project
        wrapper is required for the detected build Task. Trust the worktree
        before running project code. SSH, WSL and container hosts need their
        tools and caches on that host; a local probe does not certify them.
      </p>
      <h2>Providers and qualification</h2>
      <p>
        The catalog declares Java and Kotlin extensions as defaults. Downloads
        require network access unless cached. Provider source presence, a build
        or cached metadata does not prove live language-server, debugger,
        test-runner or remote behavior. Consult the source provider matrix
        before relying on a workflow.
      </p>
      <p>
        <a href={groovyGuide}>Detailed Groovy development guide</a> ·{" "}
        <a
          href={`${repository}/blob/dev/docs/src/development/groovy-provider-matrix.md`}
        >
          Provider evidence and open release gates
        </a>
      </p>
      <p>
        <Link href="/support/">Report a preview issue</Link> with the exact
        product selection, host, JDK and provider versions. Full provider and
        platform instructions remain in the source guide.
      </p>
    </>
  )
}
