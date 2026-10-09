"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { groovyGuide, sourceGuide } from "@/lib/content"

export function PricingSection() {
  const [isOverview, setIsOverview] = useState(true)

  const pricingPlans = [
    {
      name: "Future tools",
      overviewLabel: "Planned",
      toolingLabel: "More",
      description: "Planned tools for more languages.",
      toolingDescription: "Planned direction; no release dates.",
      features: ["C", "C++", "C#", "Python", "Other languages"],
      toolingFeatures: ["C · Planned", "C++ · Planned", "C# · Planned", "Python · Planned", "Other languages · Planned"],
      buttonText: "Roadmap status",
      href: "#faq-section",
      kind: "future",
      suffix: "tools",
      featureLabel: "Planned language focus:",
      buttonClass: "bg-accent shadow-[0px_1px_1px_-0.5px_rgba(16,24,40,0.20)] outline outline-0.5 outline-input outline-offset-[-0.5px] text-accent-foreground text-shadow-[0px_1px_1px_rgba(16,24,40,0.08)] hover:bg-secondary/20 active:bg-accent",
    },
    {
      name: "Copper",
      overviewLabel: "Rust",
      toolingLabel: "Cargo",
      description: "Rust editing, from build to review.",
      toolingDescription: "Edit, build, test, and review Rust.",
      features: ["Rust editing and rust-analyzer", "Cargo targets, checks, and Clippy", "Selected tests and terminal output", "Breakpoints, stepping, and variables", "Git staging and hunk review", "Native agents, ACP, and MCP", "Inspect tool activity and changes"],
      toolingFeatures: ["Symbols, navigation, and diagnostics", "Cargo panel and task presets", "Tests panel: run, cancel, and rerun", "Rust debugging with CodeLLDB", "Git diffs and an integrated terminal", "Configurable agents and permissions", "Checkpoints and keep/reject review"],
      buttonText: "Copper build guide",
      href: sourceGuide,
      kind: "copper",
      suffix: "product",
      featureLabel: "Development features:",
      buttonClass: "bg-primary shadow-[0px_1px_1px_-0.5px_rgba(16,24,40,0.20)] text-primary-foreground text-shadow-[0px_1px_1px_rgba(16,24,40,0.08)] hover:bg-primary/90",
      popular: true,
    },
    {
      name: "Groovy",
      overviewLabel: "Planned",
      toolingLabel: "JVM",
      description: "In development for Java and Kotlin.",
      toolingDescription: "JVM candidate; no public release.",
      features: ["Planned JVM development product", "Java and Kotlin language tools", "Maven and Gradle wrapper Tasks", "Selected JUnit and Java debugging", "No public installer"],
      toolingFeatures: ["Candidate: JDTLS and Kotlin LSP", "Candidate: dependency inspection", "Local build and JUnit evidence", "Java main debugging evidence", "Groovy language support unverified"],
      buttonText: "Development status",
      href: groovyGuide,
      kind: "groovy",
      suffix: "product",
      featureLabel: "In the development candidate:",
      buttonClass: "bg-secondary shadow-[0px_1px_1px_-0.5px_rgba(16,24,40,0.20)] text-secondary-foreground text-shadow-[0px_1px_1px_rgba(16,24,40,0.08)] hover:bg-secondary/90 active:bg-secondary/90",
    },
  ]

  return (
    <section className="w-full px-5 overflow-hidden flex flex-col justify-start items-center my-0 py-8 md:py-14">
      <div className="self-stretch relative flex flex-col justify-center items-center gap-2 py-0">
        <div className="flex flex-col justify-start items-center gap-4">
          <h2 className="text-center text-foreground text-4xl md:text-5xl font-semibold leading-tight md:leading-[40px]">
            Tools for the languages you use
          </h2>
          <p className="self-stretch text-center text-muted-foreground text-sm font-medium leading-tight">
            Copper focuses on Rust. Groovy is in development for the JVM. <br />
            C, C++, C#, Python, and other language tools are planned.
          </p>
        </div>
        <div className="pt-4">
          <div className="p-0.5 bg-muted rounded-lg outline outline-1 outline-border outline-offset-[-1px] flex justify-start items-center gap-1 md:mt-0">
            <button
              onClick={() => setIsOverview(true)}
              aria-pressed={isOverview}
              className={`pl-2 pr-1 py-1 flex justify-start items-start gap-2 rounded-md ${isOverview ? "bg-accent shadow-[0px_1px_1px_-0.5px_rgba(0,0,0,0.08)]" : ""}`}
            >
              <span
                className={`text-center text-sm font-medium leading-tight ${isOverview ? "text-accent-foreground" : "text-muted-foreground"}`}
              >
                Overview
              </span>
            </button>
            <button
              onClick={() => setIsOverview(false)}
              aria-pressed={!isOverview}
              className={`px-2 py-1 flex justify-start items-start rounded-md ${!isOverview ? "bg-accent shadow-[0px_1px_1px_-0.5px_rgba(0,0,0,0.08)]" : ""}`}
            >
              <span
                className={`text-center text-sm font-medium leading-tight ${!isOverview ? "text-accent-foreground" : "text-muted-foreground"}`}
              >
                Tooling
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="self-stretch px-5 flex flex-col md:flex-row justify-start items-start gap-4 md:gap-6 mt-6 max-w-[1100px] mx-auto">
        {pricingPlans.map((plan) => (
          <div
            key={plan.name}
            id={plan.kind}
            className={`flex-1 p-4 overflow-hidden rounded-xl flex flex-col justify-start items-start gap-6 ${plan.popular ? "bg-primary/10 shadow-[0px_4px_8px_-2px_rgba(0,0,0,0.10)]" : "bg-gradient-to-b from-secondary/5 to-secondary/0"}`}
            style={{ outline: "1px solid hsl(var(--border))", outlineOffset: "-1px" }}
          >
            <div className="self-stretch flex flex-col justify-start items-start gap-6">
              <div className="self-stretch flex flex-col justify-start items-start gap-8">
                <div
                  className={`w-full h-5 text-sm font-medium leading-tight ${plan.popular ? "text-primary" : "text-foreground"}`}
                >
                  {plan.name}
                  {plan.popular && (
                    <div className="ml-2 px-2 overflow-hidden rounded-full justify-center items-center gap-2.5 inline-flex mt-0 py-0.5 bg-primary/15">
                      <div className="text-center text-primary text-xs font-normal leading-tight break-words">
                        Development
                      </div>
                    </div>
                  )}
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-1">
                  <div className="flex justify-start items-center gap-1.5">
                    <div
                      className={`relative h-10 flex items-center text-3xl font-medium leading-10 ${plan.popular ? "text-primary" : "text-foreground"}`}
                    >
                      <span className="invisible">{isOverview ? plan.overviewLabel : plan.toolingLabel}</span>
                      <span
                        className="absolute inset-0 flex items-center transition-all duration-500"
                        style={{
                          opacity: isOverview ? 1 : 0,
                          transform: `scale(${isOverview ? 1 : 0.8})`,
                          filter: `blur(${isOverview ? 0 : 4}px)`,
                        }}
                        aria-hidden={!isOverview}
                      >
                        {plan.overviewLabel}
                      </span>
                      <span
                        className="absolute inset-0 flex items-center transition-all duration-500"
                        style={{
                          opacity: !isOverview ? 1 : 0,
                          transform: `scale(${!isOverview ? 1 : 0.8})`,
                          filter: `blur(${!isOverview ? 0 : 4}px)`,
                        }}
                        aria-hidden={isOverview}
                      >
                        {plan.toolingLabel}
                      </span>
                    </div>
                    <div
                      className={`text-center text-sm font-medium leading-tight text-muted-foreground`}
                    >
                      {plan.suffix}
                    </div>
                  </div>
                  <div
                    className={`self-stretch text-sm font-medium leading-tight text-muted-foreground`}
                  >
                    {isOverview ? plan.description : plan.toolingDescription}
                  </div>
                </div>
              </div>
              <Button asChild
                className={`self-stretch px-5 py-2 rounded-[40px] flex justify-center items-center ${plan.buttonClass}`}
              >
                <Link href={plan.href} className="px-1.5 flex justify-center items-center gap-2">
                  <span
                    className={`text-center text-sm font-medium leading-tight ${plan.kind === "future" ? "text-accent-foreground" : plan.kind === "copper" ? "text-primary-foreground" : "text-secondary-foreground"}`}
                  >
                    {plan.buttonText}
                  </span>
                </Link>
              </Button>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              <div
                className={`self-stretch text-sm font-medium leading-tight text-muted-foreground`}
              >
                {plan.featureLabel}
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-3">
                {(isOverview ? plan.features : plan.toolingFeatures).map((feature) => (
                  <div key={feature} className="self-stretch flex justify-start items-center gap-2">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <Check
                        className={`w-full h-full text-muted-foreground`}
                        strokeWidth={2}
                      />
                    </div>
                    <div
                      className={`leading-tight font-normal text-sm text-left text-muted-foreground`}
                    >
                      {feature}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
