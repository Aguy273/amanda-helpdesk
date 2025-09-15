"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Users, Settings, Shield } from "lucide-react"
import { useUserStore } from "@/store/userStore"
import { Navbar } from "@/components/Navbar"
import { Card } from "@/components/Card"

export default function AdminSettingPage() {
  const { user, isAuthenticated } = useUserStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/login")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showReports showChat />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Pengaturan Admin</h1>
          <p className="text-gray-600 mt-2">Kelola pengaturan sistem dan pengguna</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            title="Kelola Staff"
            value="Manage"
            icon={Users}
            borderColor="blue"
            onClick={() => router.push("/admin/users")}
          >
            <p className="text-sm text-gray-500 mt-2">Kelola akun staff dan permissions</p>
          </Card>

          <Card
            title="Pengaturan Sistem"
            value="Config"
            icon={Settings}
            borderColor="yellow"
            onClick={() =>
              alert(
                "Fitur Config:\n\n• Pengaturan email server\n• Konfigurasi notifikasi\n• Pengaturan backup otomatis\n• Kustomisasi tampilan\n• Pengaturan timezone\n• Konfigurasi integrasi API",
              )
            }
          >
            <p className="text-sm text-gray-500 mt-2">Konfigurasi sistem dan preferensi</p>
          </Card>

          <Card
            title="Keamanan"
            value="Security"
            icon={Shield}
            borderColor="red"
            onClick={() =>
              alert(
                "Fitur Keamanan:\n\n• Pengaturan password policy\n• Two-factor authentication\n• Session management\n• Audit log\n• IP whitelist/blacklist\n• Enkripsi data\n• Backup & recovery",
              )
            }
          >
            <p className="text-sm text-gray-500 mt-2">Pengaturan keamanan dan akses</p>
          </Card>
        </div>
      </main>
    </div>
  )
}
