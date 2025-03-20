import type React from "react"
import "./globals.css"
import ClientLayout from "./ClientLayout"
import { Providers } from "./providers"


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Providers>
      <ClientLayout>{children}</ClientLayout>
    </Providers>
  )
}

