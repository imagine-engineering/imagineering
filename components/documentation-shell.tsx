import type { ReactNode } from "react"
import { Header } from "@/components/header"
import { FooterSection } from "@/components/footer-section"
import { DocumentationNavigation } from "@/components/documentation-navigation"

export function DocumentationShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#documentation-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-2 focus:z-50 focus:rounded focus:bg-background focus:p-3 focus:text-primary"
      >
        Skip to documentation
      </a>
      <Header />
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14 lg:py-16">
        <aside className="min-w-0">
          <DocumentationNavigation />
        </aside>
        <main
          id="documentation-content"
          tabIndex={-1}
          className="min-w-0 max-w-3xl space-y-6 text-base leading-7 text-foreground [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:leading-tight md:[&_h1]:text-4xl [&_h2]:pt-5 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:font-semibold [&_p]:text-muted-foreground [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:bg-card [&_pre]:p-5 [&_pre]:text-sm [&_code]:break-words [&_pre_code]:whitespace-pre-wrap [&_pre_code]:break-all"
        >
          {children}
        </main>
      </div>
      <FooterSection />
    </>
  )
}
