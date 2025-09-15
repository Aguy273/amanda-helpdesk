"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, Clock, AlertCircle, Plus } from "lucide-react"
import { useUserStore } from "@/store/userStore"
import { Navbar } from "@/components/Navbar"
import { Card } from "@/components/Card"
import { ReportTable } from "@/components/ReportTable"
import { FAQs } from "@/components/FAQs"

export default function StaffDashboard() {
  const { user, isAuthenticated, getAllReports } = useUserStore()
  const router = useRouter()

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
  const completedReports = userReports.filter((r) => r.status === "completed").length
  const inProgressReports = userReports.filter((r) => r.status === "in-progress").length
  const pendingReports = userReports.filter((r) => r.status === "pending").length

  const handleCompletedClick = () => {
    router.push("/staff/reports?status=completed")
  }

  const handleInProgressClick = () => {
    router.push("/staff/reports?status=in-progress")
  }

  const handlePendingClick = () => {
    router.push("/staff/reports?status=pending")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showCreateReport showChat />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 bg-white rounded-2xl p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Staff</h1>
          <p className="text-gray-600 mt-2">Selamat datang, {user.name}</p>
        </div>

        {/* Stats Cards */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card
              title="Laporan Selesai"
              value={completedReports}
              icon={CheckCircle}
              borderColor="green"
              onClick={handleCompletedClick}
            />

            <Card
              title="Laporan Sedang Dikerjakan"
              value={inProgressReports}
              icon={Clock}
              borderColor="blue"
              onClick={handleInProgressClick}
            />

            <Card
              title="Laporan Belum Dikerjakan"
              value={pendingReports}
              icon={AlertCircle}
              borderColor="red"
              onClick={handlePendingClick}
            />

            <Card
              title="Buat Laporan Baru"
              value="Create"
              icon={Plus}
              borderColor="blue"
              onClick={() => router.push("/staff/create-report")}
            />
          </div>
        </div>

        {/* Reports Table */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Laporan Saya</h2>
          </div>
          <ReportTable reports={userReports} />
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <FAQs />
        </div>
      </main>
    </div>
  )
}
