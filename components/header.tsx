"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import Link from "next/link"
import { documentation } from "@/lib/content"
import { useRef, useState } from "react"
import { SiteWordmark } from "./site-wordmark"

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigationTarget = useRef<HTMLElement | null>(null)
  const navItems = [
    { name: "Features", href: "#features-section" },
    { name: "Products", href: "#products-section" },
    { name: "Workflows", href: "#workflows-section" },
  ]

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.substring(1) // Remove '#' from href
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      if (menuOpen) {
        navigationTarget.current = targetElement
        setMenuOpen(false)
      } else {
        targetElement.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  return (
    <header className="w-full py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <Link href="/" aria-label="imagineering" className="inline-flex items-center gap-3 text-foreground text-xl font-semibold">
              <SiteWordmark />
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => handleScroll(e, item.href)} // Add onClick handler
                className="text-muted-foreground hover:text-primary px-4 py-2 rounded-full font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href={documentation} target="_blank" rel="noopener noreferrer" className="hidden md:block">
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6 py-2 rounded-full font-medium shadow-sm">
              Read the docs
            </Button>
          </Link>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-foreground">
                <Menu className="h-7 w-7" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="bg-background border-t border-border text-foreground"
              onCloseAutoFocus={(e) => {
                if (navigationTarget.current) {
                  e.preventDefault()
                  navigationTarget.current.scrollIntoView({ behavior: "smooth" })
                  navigationTarget.current = null
                }
              }}
            >
              <SheetHeader>
                <SheetTitle className="text-left text-xl font-semibold text-foreground">Navigation</SheetTitle>
                <SheetDescription className="sr-only">Explore Copper, Groovy, features, and workflows.</SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-6">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleScroll(e, item.href)} // Add onClick handler
                    className="text-muted-foreground hover:text-primary justify-start text-lg py-2"
                  >
                    {item.name}
                  </Link>
                ))}
                <Link href={documentation} target="_blank" rel="noopener noreferrer" className="w-full mt-4">
                  <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6 py-2 rounded-full font-medium shadow-sm">
                    Read the docs
                  </Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
