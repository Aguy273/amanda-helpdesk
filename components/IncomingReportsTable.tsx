"use client"

import Link from "next/link"
import { useUserStore } from "@/store/userStore"
import { Calendar, User, Mail, AlertTriangle, Clock } from "lucide-react"
import type { Report } from "@/types"

interface IncomingReportsTableProps {
  reports: Report[]
  basePath: string
}

export function IncomingReportsTable({ reports, basePath }: IncomingReportsTableProps) {
  const { getAllUsers } = useUserStore()
  const allUsers = getAllUsers()

  const getCreatorName = (createdBy: string) => {
    const creator = allUsers.find((u) => u.id === createdBy)
    return creator ? creator.name : "Unknown"
  }

  const getCreatorEmail = (createdBy: string) => {
    const creator = allUsers.find((u) => u.id === createdBy)
    return creator ? creator.email : "Unknown"
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex px-3 py-1 text-xs font-semibold rounded-full border"
    switch (status) {
      case "completed":
        return <span className={`${baseClasses} bg-green-50 text-green-700 border-green-200`}>Selesai</span>
      case "in-progress":
        return <span className={`${baseClasses} bg-blue-50 text-blue-700 border-blue-200`}>Dikerjakan</span>
      case "pending":
        return <span className={`${baseClasses} bg-red-50 text-red-700 border-red-200`}>Pending</span>
      default:
        return <span className={`${baseClasses} bg-gray-50 text-gray-700 border-gray-200`}>{status}</span>
    }
  }

  const getPriorityBadge = (priority?: string) => {
    const baseClasses = "inline-flex px-3 py-1 text-xs font-semibold rounded-full border"
    switch (priority) {
      case "high":
        return <span className={`${baseClasses} bg-red-50 text-red-700 border-red-200`}>Tinggi</span>
      case "medium":
        return <span className={`${baseClasses} bg-yellow-50 text-yellow-700 border-yellow-200`}>Sedang</span>
      case "low":
        return <span className={`${baseClasses} bg-green-50 text-green-700 border-green-200`}>Rendah</span>
      default:
        return <span className={`${baseClasses} bg-gray-50 text-gray-700 border-gray-200`}>Sedang</span>
    }
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return {
        display: `Hari ini, ${date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`,
        isRecent: diffInHours < 2,
      }
    } else if (diffInHours < 48) {
      return {
        display: `Kemarin, ${date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`,
        isRecent: false,
      }
    } else {
      return {
        display: date.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        isRecent: false,
      }
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Waktu
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Laporan
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Pembuat
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Kontak
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Prioritas
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {reports.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada laporan masuk</h3>
                  <p className="text-gray-500">Belum ada laporan baru yang masuk hari ini</p>
                </td>
              </tr>
            ) : (
              reports.map((report) => {
                const dateTime = formatDateTime(report.createdAt)
                return (
                  <tr key={report.id} className="hover:bg-gray-50 transition-colors duration-200 group">
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${dateTime.isRecent ? "text-blue-600" : "text-gray-900"}`}>
                            {dateTime.display}
                          </p>
                          {dateTime.isRecent && (
                            <div className="flex items-center space-x-1 mt-1">
                              <AlertTriangle className="w-3 h-3 text-blue-500" />
                              <span className="text-xs text-blue-600 font-medium">Baru masuk</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div>
                        <Link
                          href={`${basePath}/${report.id}`}
                          className="text-blue-600 hover:text-blue-800 font-semibold text-sm group-hover:underline transition-colors"
                        >
                          {report.title}
                        </Link>
                        <p className="text-sm text-gray-600 line-clamp-2 mt-1 leading-relaxed">{report.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {report.reporterName || getCreatorName(report.createdBy)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <Mail className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">{getCreatorEmail(report.createdBy)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">{getStatusBadge(report.status)}</td>
                    <td className="px-6 py-5">{getPriorityBadge(report.priority)}</td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
