import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { NotificationToast } from "@/components/NotificationToast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "E-Helpdesk System",
  description: "Sistem helpdesk untuk mengelola laporan dan komunikasi",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {children}
        <NotificationToast />
      </body>
    </html>
  )
}
