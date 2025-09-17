"use client"

import { CheckCircle, Clock, AlertCircle, XCircle, Pause, User } from "lucide-react"
import type { Report } from "@/types"
import { useUserStore } from "@/store/userStore"

interface ReportTimelineProps {
  report: Report
}

export function ReportTimeline({ report }: ReportTimelineProps) {
  const { getAllUsers } = useUserStore()
  const allUsers = getAllUsers()

  const getStatusIcon = (status: Report["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "in-progress":
        return <Clock className="w-5 h-5 text-blue-500" />
      case "pending":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case "on-hold":
        return <Pause className="w-5 h-5 text-orange-500" />
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusText = (status: Report["status"]) => {
    switch (status) {
      case "completed":
        return "Laporan Selesai"
      case "in-progress":
        return "Sedang Dikerjakan"
      case "pending":
        return "Menunggu Ditangani"
      case "on-hold":
        return "Laporan Ditahan"
      case "rejected":
        return "Laporan Ditolak"
      default:
        return "Status Tidak Diketahui"
    }
  }

  const getStatusColor = (status: Report["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 border-green-200"
      case "in-progress":
        return "bg-blue-100 border-blue-200"
      case "pending":
        return "bg-yellow-100 border-yellow-200"
      case "on-hold":
        return "bg-orange-100 border-orange-200"
      case "rejected":
        return "bg-red-100 border-red-200"
      default:
        return "bg-gray-100 border-gray-200"
    }
  }

  const getUserName = (userId: string) => {
    const user = allUsers.find((u) => u.id === userId)
    return user?.name || "Unknown User"
  }

  // Create timeline from status history or current status
  const timeline = report.statusHistory || [
    {
      id: "initial",
      status: report.status,
      changedBy: report.createdBy,
      changedAt: report.createdAt,
      note: "Laporan dibuat",
    },
  ]

  // Sort timeline by date (newest first for display)
  const sortedTimeline = [...timeline].sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime())

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <Clock className="w-5 h-5 mr-2" />
        Tracking Status Laporan
      </h3>

      <div className="space-y-4">
        {sortedTimeline.map((item, index) => (
          <div key={item.id} className="relative">
            {/* Timeline line */}
            {index < sortedTimeline.length - 1 && <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>}

            <div className={`flex items-start space-x-4 p-4 rounded-lg border ${getStatusColor(item.status)}`}>
              <div className="flex-shrink-0 mt-1">{getStatusIcon(item.status)}</div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900">{getStatusText(item.status)}</h4>
                  <span className="text-xs text-gray-500">
                    {new Date(item.changedAt).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <User className="w-4 h-4 mr-1" />
                  <span>oleh {getUserName(item.changedBy)}</span>
                </div>

                {item.note && <p className="text-sm text-gray-700 bg-white bg-opacity-50 p-2 rounded">{item.note}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
