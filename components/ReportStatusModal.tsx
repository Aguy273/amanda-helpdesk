"use client"

import type React from "react"
import { useState } from "react"
import { X, MessageSquare, CheckCircle, Pause } from "lucide-react"
import { useUserStore } from "@/store/userStore"
import type { Report } from "@/types"

interface ReportStatusModalProps {
  isOpen: boolean
  onClose: () => void
  report: Report
  actionType: "on-hold" | "completed"
}

export function ReportStatusModal({ isOpen, onClose, report, actionType }: ReportStatusModalProps) {
  const { updateReport, user } = useUserStore()
  const [note, setNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!note.trim()) {
      alert("Catatan harus diisi")
      return
    }

    setIsSubmitting(true)

    try {
      // Create status history entry
      const statusHistory = report.statusHistory || []
      const newStatusEntry = {
        id: `status-${Date.now()}`,
        status: actionType,
        changedBy: user?.id || "",
        changedAt: new Date().toISOString(),
        note: note.trim(),
      }

      updateReport(report.id, {
        status: actionType,
        statusHistory: [...statusHistory, newStatusEntry],
        updatedAt: new Date().toISOString(),
      })

      alert(`Laporan berhasil ${actionType === "on-hold" ? "ditahan" : "diselesaikan"}!`)
      onClose()
      setNote("")
    } catch (error) {
      console.error("Error updating report:", error)
      alert("Terjadi kesalahan saat memperbarui laporan")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getTitle = () => {
    return actionType === "on-hold" ? "Tahan Laporan" : "Selesaikan Laporan"
  }

  const getIcon = () => {
    return actionType === "on-hold" ? (
      <Pause className="w-6 h-6 text-orange-500" />
    ) : (
      <CheckCircle className="w-6 h-6 text-green-500" />
    )
  }

  const getButtonColor = () => {
    return actionType === "on-hold" ? "bg-orange-600 hover:bg-orange-700" : "bg-green-600 hover:bg-green-700"
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {getIcon()}
            <h2 className="text-xl font-semibold text-gray-900">{getTitle()}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Laporan:</h3>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">{report.title}</p>
          </div>

          <div className="mb-6">
            <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Catatan <span className="text-red-500">*</span>
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={4}
              placeholder={
                actionType === "on-hold"
                  ? "Jelaskan alasan laporan ditahan..."
                  : "Jelaskan solusi yang telah diberikan..."
              }
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-white rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${getButtonColor()}`}
              disabled={isSubmitting || !note.trim()}
            >
              {isSubmitting ? "Memproses..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
