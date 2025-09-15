"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/store/userStore"

export default function HomePage() {
  const { isAuthenticated, user } = useUserStore()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on user role
      switch (user.role) {
        case "master":
          router.push("/master/dashboard")
          break
        case "admin":
          router.push("/admin/dashboard")
          break
        case "staff":
          router.push("/staff/dashboard")
          break
        default:
          router.push("/login")
      }
    } else {
      router.push("/login")
    }
  }, [isAuthenticated, user, router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Memuat...</p>
      </div>
    </div>
  )
}
