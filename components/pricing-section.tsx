"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { products } from "@/lib/product-content"

export function PricingSection() {
  const [isOverview, setIsOverview] = useState(true)

  const pricingPlans = products.map((product) => ({
    name: product.name,
    overviewLabel: product.focus,
    toolingLabel: product.focus,
    description: product.summary,
    toolingDescription: product.summary,
    features: product.features,
    toolingFeatures: product.tooling,
    buttonText: product.linkLabel,
    href: product.href,
    kind: product.id,
    suffix: "tools",
    featureLabel:
      product.id === "groovy"
        ? "Development candidate:"
        : "Development features:",
    popular: product.id === "copper",
    status: product.status,
    buttonClass:
      product.id === "copper"
        ? "bg-primary text-primary-foreground hover:bg-primary/90"
        : product.id === "groovy"
          ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
          : "bg-accent text-accent-foreground hover:bg-secondary/20",
  }))

  return (
    <section className="w-full px-5 overflow-hidden flex flex-col justify-start items-center my-0 py-8 md:py-14">
      <div className="self-stretch relative flex flex-col justify-center items-center gap-2 py-0">
        <div className="flex flex-col justify-start items-center gap-4">
          <h2 className="text-center text-foreground text-4xl md:text-5xl font-semibold leading-tight md:leading-[40px]">
            Products built on Made
          </h2>
          <p className="self-stretch text-center text-muted-foreground text-sm font-medium leading-tight">
            Copper for Rust. Groovy for JVM development. Sim for visual
            workflows. <br />
            Shared foundations, with different feature sets and availability.
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
            className={`flex-1 min-w-0 w-full p-4 overflow-hidden rounded-xl flex flex-col justify-start items-start gap-6 ${plan.popular ? "bg-primary/10 shadow-[0px_4px_8px_-2px_rgba(0,0,0,0.10)]" : "bg-gradient-to-b from-secondary/5 to-secondary/0"}`}
            style={{
              outline: "1px solid hsl(var(--border))",
              outlineOffset: "-1px",
            }}
          >
            <div className="self-stretch flex flex-col justify-start items-start gap-6">
              <div className="self-stretch flex flex-col justify-start items-start gap-8">
                <div
                  className={`w-full min-h-5 text-sm font-medium leading-tight ${plan.popular ? "text-primary" : "text-foreground"}`}
                >
                  {plan.name}
                  <div className="ml-2 px-2 overflow-hidden rounded-full justify-center items-center gap-2.5 inline-flex mt-0 py-0.5 bg-primary/15">
                    <div className="text-center text-primary text-xs font-normal leading-tight break-words">
                      {plan.status}
                    </div>
                  </div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-1">
                  <div className="flex justify-start items-center gap-1.5">
                    <div
                      className={`relative h-10 flex items-center text-3xl font-medium leading-10 ${plan.popular ? "text-primary" : "text-foreground"}`}
                    >
                      <span className="invisible">
                        {isOverview ? plan.overviewLabel : plan.toolingLabel}
                      </span>
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
              <Button
                asChild
                className={`self-stretch px-5 py-2 rounded-[40px] flex justify-center items-center ${plan.buttonClass}`}
              >
                <Link
                  href={plan.href}
                  className="px-1.5 flex justify-center items-center gap-2"
                >
                  <span
                    className={`text-center text-sm font-medium leading-tight ${plan.kind === "sim" ? "text-accent-foreground" : plan.kind === "copper" ? "text-primary-foreground" : "text-secondary-foreground"}`}
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
                {(isOverview ? plan.features : plan.toolingFeatures).map(
                  (feature) => (
                    <div
                      key={feature}
                      className="self-stretch flex justify-start items-center gap-2"
                    >
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
                  ),
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
