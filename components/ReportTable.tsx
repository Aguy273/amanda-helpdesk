"use client"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/store/userStore"
import type { Report } from "@/types"

interface ReportTableProps {
  reports: Report[]
  showActions?: boolean
}

export function ReportTable({ reports, showActions = true }: ReportTableProps) {
  const { user, getAllUsers } = useUserStore()
  const router = useRouter()
  const allUsers = getAllUsers()

  const getStatusBadge = (status: Report["status"]) => {
    const baseClasses = "inline-flex px-2 py-1 text-xs font-semibold rounded-full"
    switch (status) {
      case "completed":
        return `${baseClasses} bg-green-100 text-green-800`
      case "in-progress":
        return `${baseClasses} bg-blue-100 text-blue-800`
      case "pending":
        return `${baseClasses} bg-red-100 text-red-800`
      case "rejected":
        return `${baseClasses} bg-gray-100 text-gray-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  const getStatusText = (status: Report["status"]) => {
    switch (status) {
      case "completed":
        return "Selesai"
      case "in-progress":
        return "Dikerjakan"
      case "pending":
        return "Pending"
      case "rejected":
        return "Ditolak"
      default:
        return "Unknown"
    }
  }

  const getUserName = (userId: string) => {
    const foundUser = allUsers.find((u) => u.id === userId)
    return foundUser ? foundUser.name : "Unknown User"
  }

  const getDetailPath = (reportId: string) => {
    switch (user?.role) {
      case "master":
        return `/master/reports/${reportId}`
      case "admin":
        return `/admin/reports/${reportId}`
      case "staff":
        return `/staff/reports/${reportId}`
      default:
        return "#"
    }
  }

  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500">Belum ada laporan yang tersedia</p>
        {user?.role === "staff" && (
          <button
            onClick={() => router.push("/staff/create-report")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Buat Laporan Pertama
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              {user?.role !== "staff" && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dibuat Oleh
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal
              </th>
              {showActions && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 line-clamp-1">{report.title}</div>
                  <div className="text-sm text-gray-500 line-clamp-2">{report.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getStatusBadge(report.status)}>{getStatusText(report.status)}</span>
                </td>
                {user?.role !== "staff" && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getUserName(report.createdBy)}</td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(report.createdAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                {showActions && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => router.push(getDetailPath(report.id))}
                      className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                    >
                      Lihat Detail
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
