"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/store/userStore"
import { Navbar } from "@/components/Navbar"
import { ChatWindow } from "@/components/ChatWindow"

export default function MasterChatPage() {
  const { user, isAuthenticated } = useUserStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "master") {
      router.push("/login")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "master") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showReports showCreateReport showChat />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 bg-white rounded-2xl p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">Master Chat Monitor</h1>
          <p className="text-gray-600 mt-2">Monitor semua percakapan dan berkomunikasi dengan admin dan staff.</p>
        </div>

        <ChatWindow currentUserRole="master" />
      </main>
    </div>
  )
}
