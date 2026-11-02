/** Feature review pinned to Made 91fa0bd7; repository references rechecked 2026-11-02. Keep status evidence with copy. */
import { repository, sourceGuide, groovyGuide, simGuide } from "./content"

export const productSource = {
  revision: "91fa0bd7f4b3bf3b5d42fe714c5a005dcadbd4da",
  reviewed: "2026-11-01",
  repository,
  releases:
    "No published releases found in the canonical repository at review time.",
}

export type Product = {
  id: string
  name: string
  focus: string
  status: string
  summary: string
  features: string[]
  tooling: string[]
  href: string
  linkLabel: string
}
export const products: Product[] = [
  {
    id: "copper",
    name: "Copper",
    focus: "Rust",
    status: "Development",
    summary:
      "Rust editing with rust-analyzer, Cargo tasks, tests and debugging. Copper currently runs as a development build.",
    features: [
      "Rust and rust-analyzer defaults",
      "Cargo targets, checks and Clippy",
      "Selected tests and debugger actions",
      "Made’s terminal, Git and agent review",
    ],
    tooling: [
      "Install Rust tools on the project host",
      "Choose a Cargo target or task preset",
      "Read test results and command output",
      "Configure the debug adapter for Rust",
    ],
    href: sourceGuide,
    linkLabel: "Build Copper",
  },
  {
    id: "groovy",
    name: "Groovy",
    focus: "JVM",
    status: "Planned · Preview",
    summary:
      "A Java and Kotlin product in development. Groovy has a guarded local candidate, no enabled release targets and no published installer.",
    features: [
      "Candidate Java and Kotlin providers",
      "Maven and Gradle project workflows",
      "Candidate JUnit and Java debugging",
      "Provider and platform checks remain open",
    ],
    tooling: [
      "JDTLS and Kotlin language-server setup",
      "Wrapper Tasks on trusted projects",
      "Provider-labeled dependency inspection",
      "Groovy language support is unverified",
    ],
    href: groovyGuide,
    linkLabel: "Read Groovy’s status",
  },
  {
    id: "sim",
    name: "Sim",
    focus: "Visual",
    status: "Opt-in · Development",
    summary:
      "Made’s native visual workflow tools for ComfyUI-compatible graphs. Sim is an optional development feature, outside Copper’s default feature set.",
    features: [
      "Native graph workspace and workflow files",
      "Execution, queue and output interfaces",
      "Runtime, model and plugin components",
      "Broad runtime qualification is unfinished",
    ],
    tooling: [
      "Enable Sim in a development build",
      "Inspect workflow execution and outputs",
      "Select compatible models and backends",
      "No separate released Sim application",
    ],
    href: simGuide,
    linkLabel: "Explore Sim",
  },
]

export const sharedFeatures = [
  {
    title: "Review proposed edits.",
    description: "Inspect an agent diff and choose which changes to keep.",
  },
  {
    title: "Editing and language tools",
    description: "Edit code, navigate symbols and read provider diagnostics.",
  },
  {
    title: "Terminal, Git and debugging",
    description: "Run commands, stage hunks and inspect a stopped program.",
  },
  {
    title: "Configurable agent tools",
    description: "Connect MCP servers and review tool permissions.",
  },
  {
    title: "Inspect agent activity",
    description: "Follow tool calls, command output and proposed edits.",
  },
  {
    title: "Project tasks and tests",
    description:
      "Use shared task and test views with product-specific providers.",
  },
]

export const productFAQs = [
  {
    question: "How do imagineering, Made and the products fit together?",
    answer:
      "imagineering builds Made, the shared development foundation for editing, language intelligence, terminal, Git, debugging and agent review. Copper adds Rust workflows. Groovy is a planned JVM product. Sim provides opt-in visual workflow tools.",
  },
  {
    question: "What can I use today?",
    answer:
      "Copper is the enabled product for source builds. The canonical Made repository is public, but it currently has no published releases or downloadable installers. Groovy remains planned with a guarded local candidate. Sim requires an explicit source-build feature and is outside the default Copper profile.",
  },
  {
    question: "Can I choose an agent or model provider?",
    answer:
      "Made includes configurable model providers, external agents through Agent Client Protocol, and MCP tools. Authentication, execution and available tools depend on the integration. Review requested tool permissions and command output; a proposed action is not evidence that a command ran.",
  },
  {
    question: "How are agent changes reviewed?",
    answer:
      "The native agent provides edit diffs, keep/reject controls and checkpoints. Inspect the proposed changes and decide what to retain. External agents can have different review behavior. The feature illustrations here are static examples; the Copper image is a real development-build capture.",
  },

  {
    question: "Where are the source and documentation?",
    answer:
      "The canonical public repository is github.com/imagine-engineering/made. Current links follow main; the previous dev branch is not present there. Use the product guides and source instructions for prerequisites and limitations. Repository access does not establish a published release, a configured model service or complete platform qualification.",
  },
]
