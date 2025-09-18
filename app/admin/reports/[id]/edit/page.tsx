"use client"

import type React from "react"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/store/userStore"
import { Navbar } from "@/components/Navbar"
import { ArrowLeft, Save, X } from "lucide-react"

export default function AdminReportEditPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = params instanceof Promise ? use(params) : params
  const reportId = resolvedParams.id

  const { user, isAuthenticated, getReportById, updateReport, isReportLocked, getReportLockInfo } = useUserStore()
  const router = useRouter()
  const report = getReportById(reportId)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending" as "pending" | "in-progress" | "on-hold" | "completed",
    priority: "medium" as "low" | "medium" | "high",
    notes: "",
  })

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/login")
    }
  }, [isAuthenticated, user, router])

  useEffect(() => {
    if (report) {
      setFormData({
        title: report.title,
        description: report.description,
        status: report.status,
        priority: report.priority || "medium",
        notes: report.notes || "",
      })
    }
  }, [report])

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Navbar showReports showChat />
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

  const locked = isReportLocked(reportId)
  const lockInfo = getReportLockInfo(reportId)
  const canEdit = !locked || lockInfo?.lockedBy === user?.id

  if (!canEdit) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Navbar showReports showChat />
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Laporan Terkunci</h1>
          <p className="text-gray-600">Laporan ini sedang diedit oleh {lockInfo?.lockedByName || "pengguna lain"}.</p>
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const updatedReport = {
      ...report,
      ...formData,
      updatedAt: new Date().toISOString(),
      statusHistory: [
        ...(report.statusHistory || []),
        {
          id: `status-${Date.now()}`,
          status: formData.status,
          changedBy: user?.id || "",
          changedAt: new Date().toISOString(),
          note: formData.notes,
        },
      ],
    }

    updateReport(reportId, updatedReport)
    router.push(`/admin/reports/${reportId}`)
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showReports showChat />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={handleCancel}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Laporan</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Judul Laporan
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pending">Menunggu</option>
                  <option value="in-progress">Sedang Diproses</option>
                  <option value="on-hold">Ditahan</option>
                  <option value="completed">Selesai</option>
                </select>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                  Prioritas
                </label>
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Rendah</option>
                  <option value="medium">Sedang</option>
                  <option value="high">Tinggi</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Catatan
              </label>
              <textarea
                id="notes"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tambahkan catatan untuk perubahan ini..."
              />
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                <X className="w-4 h-4" />
                <span>Batal</span>
              </button>
              <button
                type="submit"
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
