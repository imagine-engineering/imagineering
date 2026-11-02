/** Feature plans kept separate from the published product descriptions. */
import type { Product } from "./product-content"

export type RoadmapItem = { title: string; description: string }
export type FeatureRoadmap = {
  available: RoadmapItem[]
  underway: RoadmapItem[]
  planned: RoadmapItem[]
  note: string
}

export const productRoadmaps: Record<Product["id"], FeatureRoadmap> = {
  copper: {
    available: [
      {
        title: "Cargo workspace tools",
        description:
          "Explore Cargo targets, choose a task preset and run builds, checks or Clippy from the Cargo panel.",
      },
      {
        title: "Rust tests and debugging",
        description:
          "Run selected tests, read their output and step through Rust with a configured debug adapter.",
      },
      {
        title: "Agent change review",
        description:
          "Inspect proposed edits, keep or reject changes and use checkpoints with the native agent.",
      },
    ],
    underway: [
      {
        title: "Managed local models",
        description:
          "Download and manage models for local agent use. Runtime integration and model compatibility are still in development.",
      },
    ],
    planned: [],
    note: "Current features describe development builds. Further feature plans and delivery dates have not been announced.",
  },
  groovy: {
    available: [],
    underway: [
      {
        title: "Java and Kotlin language tools",
        description:
          "Developing language-server setup, navigation and diagnostics for JVM projects. Provider compatibility remains limited to the development candidate.",
      },
      {
        title: "Maven and Gradle project views",
        description:
          "Inspect modules and dependencies, synchronize projects and run wrapper tasks. Full project-view coverage is still being developed.",
      },
      {
        title: "JUnit and Java debugging",
        description:
          "Run selected JUnit tests and debug Java applications. Broader test, debugger and platform support is still being validated.",
      },
    ],
    planned: [],
    note: "Groovy is a planned JVM product with a local development candidate. No released feature set or delivery date is announced.",
  },
  sim: {
    available: [
      {
        title: "Visual workflow editor",
        description:
          "Open workflow graphs in a native workspace and work with nodes and connections. Sim must be enabled explicitly in a development build.",
      },
      {
        title: "Queue and output views",
        description:
          "Inspect queued work, execution status and workflow outputs. These development tools do not support every node or model yet.",
      },
    ],
    underway: [
      {
        title: "Workflow execution",
        description:
          "Extend native execution across more ComfyUI-compatible workflows, with progress, errors and outputs visible in the workspace. Compatibility remains incomplete.",
      },
      {
        title: "Models and compute backends",
        description:
          "Broaden model and backend coverage for visual workflows. Available behavior still depends on the selected model, runtime and hardware.",
      },
    ],
    planned: [
      {
        title: "CoreX acceleration",
        description:
          "Planned native compute integration for CoreX hardware. Hardware and vendor dependencies remain unresolved; acceleration is not available yet.",
      },
    ],
    note: "Sim’s visual workflow tools are opt-in development functionality. Node, model and hardware support is still being expanded; no release date is announced.",
  },
}

export const roadmapFAQ = {
  question: "What does the roadmap commit to?",
  answer:
    "It separates current development-build features, work in progress and planned features. Plans can change; no delivery dates or completion percentages are assigned. If further feature plans have not been announced, the product view says so.",
}
