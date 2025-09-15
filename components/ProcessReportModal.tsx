"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, FileText, User, Info } from "lucide-react"
import { useUserStore } from "@/store/userStore"
import type { Report } from "@/types"

interface ProcessReportModalProps {
  isOpen: boolean
  onClose: () => void
  reportId: string
}

export function ProcessReportModal({ isOpen, onClose, reportId }: ProcessReportModalProps) {
  const { getReportById, updateReport, allUsers } = useUserStore()
  const report = getReportById(reportId)
  const [currentStatus, setCurrentStatus] = useState<Report["status"] | "">(report?.status || "")

  useEffect(() => {
    if (report) {
      setCurrentStatus(report.status)
    }
  }, [report])

  if (!isOpen || !report) return null

  const createdByUser = allUsers.find((u) => u.id === report.createdBy)

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Report["status"]
    setCurrentStatus(newStatus)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateReport(report.id, { status: currentStatus })
    alert("Status laporan berhasil diperbarui!")
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Proses Laporan</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Disabled fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Nama Staff
            </label>
            <input
              type="text"
              value={createdByUser?.name || "N/A"}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Permasalahan
            </label>
            <textarea
              value={`${report.title}: ${report.description}`}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              rows={4}
            />
          </div>

          {/* Editable Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              <Info className="w-4 h-4 inline mr-2" />
              Tanggapan (Status Laporan)
            </label>
            <select
              id="status"
              value={currentStatus}
              onChange={handleStatusChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Laporan Belum Dikerjakan</option>
              <option value="in-progress">Laporan Sedang Dikerjakan</option>
              <option value="completed">Laporan Selesai</option>
              <option value="rejected">Laporan Ditolak</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Simpan Tanggapan
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
