"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useUserStore } from "@/store/userStore"
import { Navbar } from "@/components/Navbar"
import { ReportTable } from "@/components/ReportTable"
import type { Report } from "@/types"

export default function MasterReportsPage() {
  const { user, isAuthenticated, getAllReports, updateReport, deleteUser } = useUserStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filterStatus, setFilterStatus] = useState<Report["status"] | "all">("all")

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "master") {
      router.push("/login")
    }
  }, [isAuthenticated, user, router])

  useEffect(() => {
    const status = searchParams.get("status") as Report["status"] | "all"
    if (status) {
      setFilterStatus(status)
    }
  }, [searchParams])

  if (!isAuthenticated || user?.role !== "master") {
    return null
  }

  const allReports = getAllReports()
  const filteredReports =
    filterStatus === "all" ? allReports : allReports.filter((report) => report.status === filterStatus)

  const handleReportUpdate = (id: string, data: Partial<Report>) => {
    updateReport(id, data)
  }

  const handleReportDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus laporan ini?")) {
      // In a real app, you'd remove it from the backend
      // For dummy data, we'll just simulate removal by filtering
      // For now, userStore doesn't have deleteReport, so I'll just alert
      alert("Fitur hapus laporan belum diimplementasikan sepenuhnya pada dummy data.")
      // If you had a deleteReport in store: deleteReport(id)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showReports showChat />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Daftar Laporan (Master)</h1>
          <p className="text-gray-600 mt-2">Kelola semua laporan sistem.</p>
        </div>

        <div className="mb-6 flex items-center space-x-4">
          <label htmlFor="statusFilter" className="text-gray-700">
            Filter Status:
          </label>
          <select
            id="statusFilter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as Report["status"] | "all")}
            className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Semua</option>
            <option value="pending">Pending</option>
            <option value="in-progress">Dikerjakan</option>
            <option value="completed">Selesai</option>
            <option value="rejected">Ditolak</option>
          </select>
        </div>

        <ReportTable
          reports={filteredReports}
          onReportUpdate={handleReportUpdate}
          onReportDelete={handleReportDelete}
          basePath="/master/reports"
          showAssignedTo={true}
          showCreatedBy={true}
          showActions={true}
        />
      </main>
    </div>
  )
}
