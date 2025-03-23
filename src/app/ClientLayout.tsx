"use client"

import type React from "react"

import { Poppins } from "next/font/google"
import "./globals.css"
import { usePathname, useRouter } from "next/navigation"
import { Home, CreditCard, History, Settings, Store } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useAuth } from "./context/AuthContext"

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
  const { isAuthenticated } = useAuth()
  const [accountType, setAccountType] = useState<string | null>(null)

  // Update the useEffect to prevent re-rendering issues and add account type check
  useEffect(() => {
    // Check if running in browser environment
    if (typeof window !== "undefined") {
      const checkConnection = () => {
        const connected = localStorage.getItem("walletConnected") === "true" || isAuthenticated

        // Only update state if it's different to prevent re-renders
        if (connected !== isConnected) {
          setIsConnected(connected)
        }

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

      // Fetch account type from local storage
      const storedAccountType = localStorage.getItem("accountType")
      if (storedAccountType) {
        setAccountType(storedAccountType)
      }

      return () => {
        window.removeEventListener("storage", checkConnection)
      }
    }
  }, [pathname, router, isAuthenticated, isConnected])

  // Update the navItems to include role-based visibility
  const navItems = [
    { icon: Home, label: "Home", href: "/", roles: ["user", "merchant"] },
    { icon: CreditCard, label: "Tokens", href: "/rewards", roles: ["user"] },
    { icon: Store, label: "Business", href: "/merchant", roles: ["merchant"] },
    { icon: History, label: "History", href: "/history", roles: ["user", "merchant"] },
    { icon: Settings, label: "Privacy", href: "/settings", roles: ["user", "merchant"] },
  ]

  return (
    <html lang="en">
      <body className={poppins.className}>
        <div className="app-container">
          <main className={`flex-1 overflow-auto ${isConnected ? "pb-16" : ""}`}>{children}</main>
          {isConnected && (
            <nav className="nav-container">
              <div className="nav-items">
                {navItems
                  .filter((item) => {
                    // If accountType is "test0", show user items
                    // If accountType is "test1", show merchant items
                    if (accountType === "test0") return item.roles.includes("user")
                    if (accountType === "test1") return item.roles.includes("merchant")
                    return true // Show all if no account type (fallback)
                  })
                  .map((item) => {
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

