"use client"

import type React from "react"

import { Poppins } from "next/font/google"
import "./globals.css"
import { usePathname, useRouter } from "next/navigation"
import { Home, CreditCard, History, Settings, Store } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
})

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isConnected, setIsConnected] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // Check wallet connection status
  useEffect(() => {
    // Check if running in browser environment
    if (typeof window !== "undefined") {
      const checkConnection = () => {
        const connected = localStorage.getItem("walletConnected") === "true"
        setIsConnected(connected)

        // Redirect to home if not connected and trying to access protected routes
        // Skip the home page since it handles both states
        if (!connected && pathname !== "/" && pathname !== "/home") {
          router.push("/")
        }
      }

      // Check on initial load
      checkConnection()

      // Set up event listener for storage changes (in case another tab changes connection state)
      window.addEventListener("storage", checkConnection)

      // Check connection status periodically to ensure it's up to date
      const interval = setInterval(checkConnection, 1000)

      return () => {
        window.removeEventListener("storage", checkConnection)
        clearInterval(interval)
      }
    }
  }, [pathname, router])

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
          <main className={`flex-1 overflow-auto ${isConnected ? "pb-16" : ""}`}>{children}</main>
          {isConnected && (
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
          )}
        </div>
      </body>
    </html>
  )
}

export { ClientLayout }

