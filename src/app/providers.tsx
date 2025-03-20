"use client"

import type { ReactNode } from "react"
import { PrivyProvider } from "@privy-io/react-auth"

// Replace with your actual Privy App ID from your Privy dashboard
const PRIVY_APP_ID = "cm8hylo8r024q9kh2b33ylvtj"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        loginMethods: ["wallet", "email"],
        appearance: {
          theme: "light",
          accentColor: "#8b5cf6", // Purple from your color scheme
          logo: "https://your-logo-url.com/logo.png", // Replace with your logo URL
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      {children}
    </PrivyProvider>
  )
}

