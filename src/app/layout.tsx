import type React from "react"
import "./globals.css"
import ClientLayout from "./ClientLayout"


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ClientLayout>{children}</ClientLayout>
}

