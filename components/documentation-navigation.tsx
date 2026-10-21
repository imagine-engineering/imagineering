"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { documentationNavigation } from "@/lib/documentation";

export function DocumentationNavigation() {
  const pathname = usePathname().replace(/\/$/, "") || "/";
  return (
    <nav
      aria-label="Documentation"
      className="flex flex-wrap gap-2 lg:flex-col"
    >
      {documentationNavigation.map(({ href, title }) => {
        const NavigationLink = href === "/docs/reference/" ? "a" : Link;
        const current = pathname === href.replace(/\/$/, "");
        return (
          <NavigationLink
            key={href}
            href={href}
            aria-current={current ? "page" : undefined}
            className={`rounded-lg px-3 py-2 text-sm leading-6 ${current ? "bg-accent text-primary" : "text-muted-foreground hover:bg-muted"}`}
          >
            {title}
          </NavigationLink>
        );
      })}
    </nav>
  );
}
