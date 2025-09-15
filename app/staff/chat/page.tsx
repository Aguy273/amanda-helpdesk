"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/store/userStore"
import { Navbar } from "@/components/Navbar"
import { StaffChatWindow } from "@/components/StaffChatWindow"

export default function StaffChatPage() {
  const { user, isAuthenticated } = useUserStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "staff") {
      router.push("/login")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "staff") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showCreateReport showChat />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 bg-white rounded-2xl p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">Chat Staff</h1>
          <p className="text-gray-600 mt-2">Kirim keluhan atau pertanyaan Anda kepada admin.</p>
        </div>

        <StaffChatWindow />
      </main>
    </div>
  )
}
