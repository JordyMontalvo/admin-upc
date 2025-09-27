import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Navbar } from "@/components/navbar"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Bot Cultural - Campañas WhatsApp",
  description: "Gestión de campañas de difusión vía WhatsApp",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <Navbar />
          {children}
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
