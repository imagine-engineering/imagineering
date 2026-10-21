import { Globe, Github, BookOpen } from "lucide-react"
import { companyWebsite, repository, documentation, support, sourceGuide, contributionGuide, license } from "@/lib/content"
import Link from "next/link"
import { SiteWordmark } from "./site-wordmark"

const groups = [
  { title: "Products", links: [
    ["Copper", "/#copper"], ["Groovy · Planned", "/#groovy"], ["Future tools", "/#future"],
    ["Features", "/#features-section"], ["Workflows", "/#workflows-section"],
  ] },
  { title: "Company", links: [
    ["imagineering", companyWebsite], ["Planned languages", "/#future"],
    ["Product overview", "/#products-section"], ["Product status", "/#faq-section"],
    ["Contributing", contributionGuide],
  ] },
  { title: "Resources", links: [
    ["Documentation", documentation], ["Help and support", support], ["Copper build guide", sourceGuide],
    ["Source repository", repository], ["License", license], ["FAQs", "/#faq-section"],
  ] },
]

export function FooterSection() {
  return (
    <footer className="w-full max-w-[1320px] mx-auto px-5 flex flex-col md:flex-row justify-between items-start gap-8 md:gap-0 py-10 md:py-[70px]">
      <div className="flex flex-col justify-start items-start gap-8 p-4 md:p-8">
        <Link href="/" aria-label="imagineering" className="relative block h-4 w-40 shrink-0">
          <span className="absolute top-1/2 -translate-y-1/2"><SiteWordmark /></span>
        </Link>
        <p className="text-foreground/90 text-sm font-medium leading-[18px] text-left">
          Rust tools in Copper. JVM tools in development.<br />Repository links require GitHub access.
        </p>
        <div className="flex justify-start items-start gap-3">
          <a href={companyWebsite} aria-label="imagineering website" className="w-4 h-4 flex items-center justify-center">
            <Globe className="w-full h-full text-muted-foreground" />
          </a>
          <a href={repository} aria-label="Source on GitHub" className="w-4 h-4 flex items-center justify-center">
            <Github className="w-full h-full text-muted-foreground" />
          </a>
          <a href={documentation} aria-label="Product documentation" className="w-4 h-4 flex items-center justify-center">
            <BookOpen className="w-full h-full text-muted-foreground" />
          </a>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 p-4 md:p-8 w-full md:w-auto">
        {groups.map((group) => (
          <div key={group.title} className="flex flex-col justify-start items-start gap-3">
            <h3 className="text-muted-foreground text-sm font-medium leading-5">{group.title}</h3>
            <div className="flex flex-col justify-center items-start gap-2">
              {group.links.map(([label, href]) => (
                <a key={label} href={href} className="text-foreground text-sm font-normal leading-5 hover:underline">{label}</a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </footer>
  )
}
