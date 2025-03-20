"use client"

import type React from "react"

import { Poppins } from "next/font/google"
import "./globals.css"
import { usePathname } from "next/navigation"
import { Home, CreditCard, History, Settings, Store } from "lucide-react"
import Link from "next/link"

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
})

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: CreditCard, label: "Rewards", href: "/rewards" },
    { icon: Store, label: "Merchant", href: "/merchant" },
    { icon: History, label: "History", href: "/history" },
    { icon: Settings, label: "Profile", href: "/settings" },
  ]

  return (
    <html lang="en">
      <body className={poppins.className}>
        <div className="app-container">
          <main className="flex-1 overflow-auto pb-16">{children}</main>
          <nav className="nav-container">
            <div className="nav-items">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-item ${isActive ? "nav-item-active" : "nav-item-inactive"}`}
                  >
                    <item.icon className="nav-item-icon" size={20} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </nav>
        </div>
      </body>
    </html>
  )
}

export { ClientLayout }