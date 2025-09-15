"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useUserStore } from "@/store/userStore"
import { Navbar } from "@/components/Navbar"
import { ReportTable } from "@/components/ReportTable"

export default function StaffReportsPage() {
  const { user, isAuthenticated, getAllReports } = useUserStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const statusFilter = searchParams.get("status")

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "staff") {
      router.push("/login")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "staff") {
    return null
  }

  const allReports = getAllReports()
  const userReports = allReports.filter((r) => r.createdBy === user.id)

  // Filter reports based on status parameter
  const filteredReports = statusFilter ? userReports.filter((r) => r.status === statusFilter) : userReports

  const getPageTitle = () => {
    switch (statusFilter) {
      case "completed":
        return "Laporan Selesai"
      case "in-progress":
        return "Laporan Sedang Dikerjakan"
      case "pending":
        return "Laporan Belum Dikerjakan"
      default:
        return "Semua Laporan"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showCreateReport showChat />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 bg-white rounded-2xl p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">{getPageTitle()}</h1>
          <p className="text-gray-600 mt-2">{filteredReports.length} laporan ditemukan</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm">
          <ReportTable reports={filteredReports} />
        </div>
      </main>
    </div>
  )
}
