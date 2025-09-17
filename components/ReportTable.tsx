"use client"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/store/userStore"
import { Eye, Lock, User, Phone, Tag, Calendar, AlertTriangle, ChevronDown } from "lucide-react"
import type { Report } from "@/types"
import { useState } from "react"

interface ReportTableProps {
  reports: Report[]
  showActions?: boolean
  onReportUpdate?: (id: string, data: Partial<Report>) => void
  basePath?: string
  showAssignedTo?: boolean
  showCreatedBy?: boolean
}

export function ReportTable({
  reports,
  showActions = true,
  onReportUpdate,
  basePath,
  showAssignedTo,
  showCreatedBy,
}: ReportTableProps) {
  const { user, getAllUsers, isReportLocked, getReportLockInfo } = useUserStore()
  const router = useRouter()
  const allUsers = getAllUsers()
  const [updatingReports, setUpdatingReports] = useState<Set<string>>(new Set())

  const getStatusBadge = (status: Report["status"]) => {
    const baseClasses = "inline-flex px-3 py-1 text-xs font-semibold rounded-full"
    switch (status) {
      case "completed":
        return `${baseClasses} bg-green-100 text-green-800 border border-green-200`
      case "in-progress":
        return `${baseClasses} bg-blue-100 text-blue-800 border border-blue-200`
      case "pending":
        return `${baseClasses} bg-red-100 text-red-800 border border-red-200`
      case "on-hold":
        return `${baseClasses} bg-orange-100 text-orange-800 border border-orange-200`
      case "rejected":
        return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`
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
      case "on-hold":
        return "Ditahan"
      case "rejected":
        return "Ditolak"
      default:
        return "Unknown"
    }
  }

  const getPriorityBadge = (priority?: string) => {
    if (!priority) return null
    const baseClasses = "inline-flex px-3 py-1 text-xs font-semibold rounded-full border"
    switch (priority) {
      case "high":
        return `${baseClasses} bg-red-50 text-red-700 border-red-200`
      case "medium":
        return `${baseClasses} bg-yellow-50 text-yellow-700 border-yellow-200`
      case "low":
        return `${baseClasses} bg-green-50 text-green-700 border-green-200`
      default:
        return null
    }
  }

  const getPriorityText = (priority?: string) => {
    switch (priority) {
      case "high":
        return "Tinggi"
      case "medium":
        return "Sedang"
      case "low":
        return "Rendah"
      default:
        return ""
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

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return {
        date: "Hari ini",
        time: date.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isRecent: diffInHours < 2,
      }
    } else if (diffInHours < 48) {
      return {
        date: "Kemarin",
        time: date.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isRecent: false,
      }
    } else {
      return {
        date: date.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        time: date.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isRecent: false,
      }
    }
  }

  const handleStatusChange = async (reportId: string, newStatus: Report["status"]) => {
    if (!onReportUpdate || updatingReports.has(reportId)) return

    setUpdatingReports((prev) => new Set(prev).add(reportId))
    try {
      await onReportUpdate(reportId, {
        status: newStatus,
        assignedTo: user?.id, // Assign to current user when changing status
      })
    } finally {
      setUpdatingReports((prev) => {
        const newSet = new Set(prev)
        newSet.delete(reportId)
        return newSet
      })
    }
  }

  const handlePriorityChange = async (reportId: string, newPriority: Report["priority"]) => {
    if (!onReportUpdate || updatingReports.has(reportId)) return

    setUpdatingReports((prev) => new Set(prev).add(reportId))
    try {
      await onReportUpdate(reportId, { priority: newPriority })
    } finally {
      setUpdatingReports((prev) => {
        const newSet = new Set(prev)
        newSet.delete(reportId)
        return newSet
      })
    }
  }

  const canEditReports = user?.role === "admin" || user?.role === "master"

  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Tag className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada laporan</h3>
        <p className="text-gray-500 mb-6">Belum ada laporan yang tersedia untuk ditampilkan</p>
        {user?.role === "staff" && (
          <button
            onClick={() => router.push("/staff/create-report")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Buat Laporan Pertama
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Informasi Laporan
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status & Prioritas
              </th>
              {canEditReports && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Admin Penanganan
                </th>
              )}
              {user?.role !== "staff" && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Pelapor
                </th>
              )}
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Kontak
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Waktu
              </th>
              {showActions && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Aksi
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {reports.map((report) => {
              const isLocked = isReportLocked(report.id)
              const lockInfo = getReportLockInfo(report.id)
              const lockedUser = lockInfo ? allUsers.find((u) => u.id === lockInfo.lockedBy) : null
              const dateTime = formatDateTime(report.createdAt)
              const isUpdating = updatingReports.has(report.id)
              const assignedUser = report.assignedTo ? allUsers.find((u) => u.id === report.assignedTo) : null

              return (
                <tr key={report.id} className="hover:bg-gray-50 transition-colors duration-200 group">
                  <td className="px-6 py-5">
                    <div className="flex items-start space-x-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                            {report.title}
                          </h3>
                          {isLocked && (
                            <div className="flex items-center space-x-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full text-xs border border-yellow-200">
                              <Lock className="w-3 h-3" />
                              <span>{lockedUser?.name || "Unknown"}</span>
                            </div>
                          )}
                          {dateTime.isRecent && (
                            <div className="flex items-center space-x-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs border border-blue-200">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Baru</span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">{report.description}</p>
                        {report.problemType && (
                          <div className="flex items-center space-x-2">
                            <Tag className="w-4 h-4 text-gray-400" />
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md capitalize">
                              {report.problemType}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col space-y-2">
                      {canEditReports && onReportUpdate ? (
                        <div className="relative">
                          <select
                            value={report.status}
                            onChange={(e) => handleStatusChange(report.id, e.target.value as Report["status"])}
                            disabled={isUpdating}
                            className={`${getStatusBadge(report.status)} cursor-pointer hover:opacity-80 transition-opacity appearance-none pr-6 ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">Dikerjakan</option>
                            <option value="on-hold">Ditahan</option>
                            <option value="completed">Selesai</option>
                            <option value="rejected">Ditolak</option>
                          </select>
                          <ChevronDown className="absolute right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 pointer-events-none" />
                        </div>
                      ) : (
                        <span className={getStatusBadge(report.status)}>{getStatusText(report.status)}</span>
                      )}

                      {canEditReports && onReportUpdate ? (
                        <div className="relative">
                          <select
                            value={report.priority || "medium"}
                            onChange={(e) => handlePriorityChange(report.id, e.target.value as Report["priority"])}
                            disabled={isUpdating}
                            className={`${getPriorityBadge(report.priority || "medium")} cursor-pointer hover:opacity-80 transition-opacity appearance-none pr-6 ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            <option value="low">Rendah</option>
                            <option value="medium">Sedang</option>
                            <option value="high">Tinggi</option>
                          </select>
                          <ChevronDown className="absolute right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 pointer-events-none" />
                        </div>
                      ) : (
                        report.priority && (
                          <span className={getPriorityBadge(report.priority)}>{getPriorityText(report.priority)}</span>
                        )
                      )}
                    </div>
                  </td>
                  {canEditReports && (
                    <td className="px-6 py-5">
                      {assignedUser ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-3 h-3 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{assignedUser.name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Belum ditugaskan</span>
                      )}
                    </td>
                  )}
                  {user?.role !== "staff" && (
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{getUserName(report.createdBy)}</p>
                          {report.reporterName && report.reporterName !== getUserName(report.createdBy) && (
                            <p className="text-xs text-gray-500">Pelapor: {report.reporterName}</p>
                          )}
                        </div>
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-5">
                    <div className="space-y-2">
                      {report.phoneNumber && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{report.phoneNumber}</span>
                        </div>
                      )}
                      {report.reporterName && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <User className="w-4 h-4 text-gray-400" />
                          <span>{report.reporterName}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${dateTime.isRecent ? "text-blue-600" : "text-gray-900"}`}>
                          {dateTime.date}
                        </p>
                        <p className="text-xs text-gray-500">{dateTime.time}</p>
                      </div>
                    </div>
                  </td>
                  {showActions && (
                    <td className="px-6 py-5">
                      <button
                        onClick={() => router.push(getDetailPath(report.id))}
                        className="flex items-center space-x-2 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 transition-colors duration-200 px-3 py-2 rounded-lg text-sm font-medium border border-blue-200"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Detail</span>
                      </button>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
