"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, GitCompare } from "lucide-react"

export default function Header() {
  const pathname = usePathname()

  return (
    <header
      className="
      sticky top-2 z-50 w-full max-w-[90vw] mx-auto 
      border-[2px] border-[#1A1A1A] 
      px-8 rounded-lg 
      backdrop-blur supports-[backdrop-filter]:bg-background/60
    "
    >      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <FileText className="h-6 w-6" />
          <span>PDF Extract</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${pathname === "/" ? "text-foreground" : "text-muted-foreground"
              }`}
          >
            Tools
          </Link>
          <Link
            href="/compare"
            className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${pathname === "/compare" ? "text-foreground" : "text-muted-foreground"
              }`}
          >
            <GitCompare className="h-4 w-4" />
            Compare
          </Link>
        </nav>
      </div>
    </header>
  )
}
