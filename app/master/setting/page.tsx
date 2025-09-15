"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Users, Settings, Shield, Database } from "lucide-react"
import { useUserStore } from "@/store/userStore"
import { Navbar } from "@/components/Navbar"
import { Card } from "@/components/Card"

export default function MasterSettingPage() {
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
      <Navbar showReports showChat />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Pengaturan Master Admin</h1>
          <p className="text-gray-600 mt-2">Kelola seluruh sistem dan pengguna</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card
            title="Kelola Users"
            value="Manage"
            icon={Users}
            borderColor="blue"
            onClick={() => router.push("/master/users")}
          >
            <p className="text-sm text-gray-500 mt-2">Kelola admin dan staff</p>
          </Card>

          <Card
            title="Pengaturan Sistem"
            value="Config"
            icon={Settings}
            borderColor="yellow"
            onClick={() =>
              alert(
                "Fitur Config (Master Level):\n\n• Server configuration\n• Database settings\n• API endpoints\n• System monitoring\n• Performance tuning\n• Global preferences\n• Multi-tenant settings",
              )
            }
          >
            <p className="text-sm text-gray-500 mt-2">Konfigurasi sistem global</p>
          </Card>

          <Card
            title="Keamanan"
            value="Security"
            icon={Shield}
            borderColor="red"
            onClick={() =>
              alert(
                "Fitur Keamanan (Master Level):\n\n• Advanced security policies\n• System-wide encryption\n• Access control management\n• Security audit & compliance\n• Threat detection\n• Disaster recovery\n• Security monitoring",
              )
            }
          >
            <p className="text-sm text-gray-500 mt-2">Pengaturan keamanan tingkat tinggi</p>
          </Card>

          <Card
            title="Database"
            value="DB"
            icon={Database}
            borderColor="blue"
            onClick={() =>
              alert(
                "Fitur Database:\n\n• Database backup & restore\n• Query optimization\n• Data migration\n• Storage management\n• Performance monitoring\n• Data archiving\n• Database maintenance",
              )
            }
          >
            <p className="text-sm text-gray-500 mt-2">Manajemen database dan backup</p>
          </Card>
        </div>
      </main>
    </div>
  )
}
