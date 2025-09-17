"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, FileText, User, Info, Pause, CheckCircle, Clock } from "lucide-react"
import { useUserStore } from "@/store/userStore"
import { ReportStatusModal } from "./ReportStatusModal"
import type { Report } from "@/types"

interface ProcessReportModalProps {
  isOpen: boolean
  onClose: () => void
  reportId: string
}

export function ProcessReportModal({ isOpen, onClose, reportId }: ProcessReportModalProps) {
  const { getReportById, updateReport, allUsers, user } = useUserStore()
  const report = getReportById(reportId)
  const [currentStatus, setCurrentStatus] = useState<Report["status"] | "">(report?.status || "")
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [statusModalType, setStatusModalType] = useState<"on-hold" | "completed">("on-hold")

  useEffect(() => {
    if (report) {
      setCurrentStatus(report.status)
    }
  }, [report])

  if (!isOpen || !report) return null

  const createdByUser = allUsers.find((u) => u.id === report.createdBy)

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Report["status"]

    if (newStatus === "on-hold" || newStatus === "completed") {
      setStatusModalType(newStatus)
      setShowStatusModal(true)
      return
    }

    setCurrentStatus(newStatus)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (currentStatus === "on-hold" || currentStatus === "completed") {
      return // These are handled by the status modal
    }

    // Create status history entry for simple status changes
    const statusHistory = report.statusHistory || []
    const newStatusEntry = {
      id: `status-${Date.now()}`,
      status: currentStatus as Report["status"],
      changedBy: user?.id || "",
      changedAt: new Date().toISOString(),
      note: currentStatus === "in-progress" ? "Laporan sedang dikerjakan" : "Status diperbarui",
    }

    updateReport(report.id, {
      status: currentStatus,
      statusHistory: [...statusHistory, newStatusEntry],
    })
    alert("Status laporan berhasil diperbarui!")
    onClose()
  }

  const handleStatusModalClose = () => {
    setShowStatusModal(false)
    // Reset to current status if modal was cancelled
    setCurrentStatus(report.status)
  }

  return (
    <>
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
                <option value="in-progress">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Laporan Sedang Dikerjakan
                </option>
                <option value="on-hold">
                  <Pause className="w-4 h-4 inline mr-2" />
                  Laporan Ditahan
                </option>
                <option value="completed">
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  Laporan Selesai
                </option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                * Opsi "Laporan Ditahan" dan "Laporan Selesai" memerlukan catatan wajib
              </p>
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
                disabled={currentStatus === "on-hold" || currentStatus === "completed"}
              >
                Simpan Tanggapan
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Status Modal for on-hold and completed */}
      {showStatusModal && (
        <ReportStatusModal
          isOpen={showStatusModal}
          onClose={handleStatusModalClose}
          report={report}
          actionType={statusModalType}
        />
      )}
    </>
  )
}
