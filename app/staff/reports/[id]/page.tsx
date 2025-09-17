"use client"

import { use, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, User, Calendar, Phone, Tag } from "lucide-react"
import { useUserStore } from "@/store/userStore"
import { Navbar } from "@/components/Navbar"
import { ReportTimeline } from "@/components/ReportTimeline"
import { ReportAttachments } from "@/components/ReportAttachments"

export default function StaffReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: reportId } = use(params)
  const { user, isAuthenticated, getReportById, getAllUsers } = useUserStore()
  const router = useRouter()
  const report = getReportById(reportId)
  const allUsers = getAllUsers()

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "staff") {
      router.push("/login")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "staff") {
    return null
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Navbar showCreateReport showChat />
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Laporan Tidak Ditemukan</h1>
          <p className="text-gray-600">Laporan dengan ID {reportId} tidak ada.</p>
          <button
            onClick={() => router.back()}
            className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>
        </div>
      </div>
    )
  }

  const createdByUser = allUsers.find((u) => u.id === report.createdBy)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showCreateReport showChat />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali ke Daftar Laporan</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Detail Laporan</h1>
        </div>

        <div className="space-y-6">
          {/* Report Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{report.title}</h2>
            <p className="text-gray-700 mb-6">{report.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-200 pt-6">
              {report.reporterName && (
                <div>
                  <p className="text-sm font-medium text-gray-600 flex items-center space-x-2 mb-1">
                    <User className="w-4 h-4" />
                    <span>Nama Pembuat Laporan:</span>
                  </p>
                  <p className="text-gray-800 font-semibold">{report.reporterName}</p>
                </div>
              )}

              {report.phoneNumber && (
                <div>
                  <p className="text-sm font-medium text-gray-600 flex items-center space-x-2 mb-1">
                    <Phone className="w-4 h-4" />
                    <span>Nomor Telepon:</span>
                  </p>
                  <p className="text-gray-800 font-semibold">{report.phoneNumber}</p>
                </div>
              )}

              {report.problemType && (
                <div>
                  <p className="text-sm font-medium text-gray-600 flex items-center space-x-2 mb-1">
                    <Tag className="w-4 h-4" />
                    <span>Jenis Masalah:</span>
                  </p>
                  <p className="text-gray-800 font-semibold capitalize">{report.problemType}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-gray-600 flex items-center space-x-2 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span>Tanggal Dibuat:</span>
                </p>
                <p className="text-gray-800 font-semibold">
                  {new Date(report.createdAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <ReportTimeline report={report} />

          {/* Attachments */}
          {report.attachments && report.attachments.length > 0 && (
            <ReportAttachments attachments={report.attachments} />
          )}
        </div>
      </main>
    </div>
  )
}
