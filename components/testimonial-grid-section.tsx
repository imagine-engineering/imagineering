import { Braces, Terminal, GitCompareArrows, Bug, Plug, FileSearch, Layers, type LucideIcon } from "lucide-react"

const testimonials = [
  {
    quote: "Copper combines Rust editing, rust-analyzer, Cargo, tests, terminal, Git, debugging, and agent tools. Inspect command output and proposed changes, then choose which edits to keep.",
    name: "Copper",
    company: "Rust development",
    Icon: Braces,
    type: "large-teal",
  },
  {
    quote: "Select a Cargo target or Rust test, run it, then read its results in the Tests panel and terminal.",
    name: "Build and test",
    company: "Cargo and terminal",
    Icon: Terminal,
    type: "small-dark",
  },
  {
    quote: "Inspect Git diffs and stage hunks. Review agent edits with keep/reject controls and checkpoints.",
    name: "Review changes",
    company: "Developer decisions",
    Icon: GitCompareArrows,
    type: "small-dark",
  },
  {
    quote: "Stop at a Rust breakpoint, step through the code, and inspect variables with a configured debug adapter.",
    name: "Debug Rust",
    company: "Breakpoints and stepping",
    Icon: Bug,
    type: "small-dark",
  },
  {
    quote: "Choose a provider or ACP agent. Authentication, local execution, and tools depend on that integration.",
    name: "Agent connections",
    company: "Providers and ACP",
    Icon: Plug,
    type: "small-dark",
  },
  {
    quote: "Use Rust and rust-analyzer defaults for syntax, symbols, navigation, and diagnostics.",
    name: "Edit and navigate",
    company: "Rust language tools",
    Icon: FileSearch,
    type: "small-dark",
  },
  {
    quote: "Groovy is in development for Java and Kotlin. Candidate builds have local Maven, Gradle, JUnit, and Java debugging evidence. It remains planned, with no public installer.",
    name: "Groovy",
    company: "Planned JVM product",
    Icon: Layers,
    type: "large-light",
  },
]

const TestimonialCard = ({ quote, name, company, Icon, type }: { quote: string; name: string; company: string; Icon: LucideIcon; type: string }) => {
  const isLargeCard = type.startsWith("large")
  const avatarSize = isLargeCard ? 48 : 36
  const avatarBorderRadius = isLargeCard ? "rounded-[41px]" : "rounded-[30.75px]"
  const padding = isLargeCard ? "p-6" : "p-[30px]"

  let cardClasses = `flex flex-col justify-between items-start overflow-hidden rounded-[10px] shadow-[0px_2px_4px_rgba(0,0,0,0.08)] relative ${padding}`
  let quoteClasses = ""
  let nameClasses = ""
  let companyClasses = ""
  let backgroundElements = null
  let cardHeight = ""
  const cardWidth = "w-full"

  if (type === "large-teal") {
    cardClasses += " bg-primary/10"
    quoteClasses += " text-foreground text-2xl font-medium leading-8"
    nameClasses += " text-foreground text-base font-normal leading-6"
    companyClasses += " text-muted-foreground text-base font-normal leading-6"
    cardHeight = "h-[502px]"
    backgroundElements = (
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-5"
        style={{ backgroundImage: "url('/images/large-card-background.svg')", zIndex: 0 }}
      />
    )
  } else if (type === "large-light") {
    cardClasses += " bg-secondary/10"
    quoteClasses += " text-foreground text-2xl font-medium leading-8"
    nameClasses += " text-foreground text-base font-normal leading-6"
    companyClasses += " text-muted-foreground text-base font-normal leading-6"
    cardHeight = "h-[502px]"
    backgroundElements = (
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-5"
        style={{ backgroundImage: "url('/images/large-card-background.svg')", zIndex: 0 }}
      />
    )
  } else {
    cardClasses += " bg-card outline outline-1 outline-border outline-offset-[-1px]"
    quoteClasses += " text-foreground/80 text-[17px] font-normal leading-6"
    nameClasses += " text-foreground text-sm font-normal leading-[22px]"
    companyClasses += " text-muted-foreground text-sm font-normal leading-[22px]"
    cardHeight = "h-[244px]"
  }

  return (
    <div className={`${cardClasses} ${cardWidth} ${cardHeight}`}>
      {backgroundElements}
      <div className={`relative z-10 font-normal break-words ${quoteClasses}`}>{quote}</div>
      <div className="relative z-10 flex justify-start items-center gap-3">
        <Icon
          aria-hidden="true"
          width={avatarSize}
          height={avatarSize}
          className={avatarBorderRadius}
          style={{ border: "1px solid hsl(var(--border))", flexShrink: 0 }}
        />
        <div className="flex flex-col justify-start items-start gap-0.5">
          <div className={nameClasses}>{name}</div>
          <div className={companyClasses}>{company}</div>
        </div>
      </div>
    </div>
  )
}

export function TestimonialGridSection() {
  return (
    <section className="w-full px-5 overflow-hidden flex flex-col justify-start py-6 md:py-8 lg:py-14">
      <div className="self-stretch py-6 md:py-8 lg:py-14 flex flex-col justify-center items-center gap-2">
        <div className="flex flex-col justify-start items-center gap-4">
          <h2 className="text-center text-foreground text-3xl md:text-4xl lg:text-[40px] font-semibold leading-tight md:leading-tight lg:leading-[40px]">
            Keep the work inspectable
          </h2>
          <p className="self-stretch text-center text-muted-foreground text-sm md:text-sm lg:text-base font-medium leading-[18.20px] md:leading-relaxed lg:leading-relaxed">
            {"Editing, commands, agent activity, and review in Copper."} <br />{" "}
            {"Groovy is being developed for Java and Kotlin projects."}
          </p>
        </div>
      </div>
      <div className="w-full pt-0.5 pb-4 md:pb-6 lg:pb-10 flex flex-col lg:flex-row justify-center items-start gap-4 md:gap-4 lg:gap-6 max-w-[1200px] mx-auto">
        <div className="flex-1 min-w-0 w-full flex flex-col justify-start items-start gap-4 md:gap-4 lg:gap-6">
          <TestimonialCard {...testimonials[0]} />
          <TestimonialCard {...testimonials[1]} />
        </div>
        <div className="flex-1 min-w-0 w-full flex flex-col justify-start items-start gap-4 md:gap-4 lg:gap-6">
          <TestimonialCard {...testimonials[2]} />
          <TestimonialCard {...testimonials[3]} />
          <TestimonialCard {...testimonials[4]} />
        </div>
        <div className="flex-1 min-w-0 w-full flex flex-col justify-start items-start gap-4 md:gap-4 lg:gap-6">
          <TestimonialCard {...testimonials[5]} />
          <TestimonialCard {...testimonials[6]} />
        </div>
      </div>
    </section>
  )
}
