"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  Plus,
  Search,
  HelpCircle,
  BarChart3,
  TrendingUp,
  X,
} from "lucide-react"
import { useUserStore } from "@/store/userStore"
import { Navbar } from "@/components/Navbar"
import { Card } from "@/components/Card"
import { IncomingReportsTable } from "@/components/IncomingReportsTable"
import { ChatButton } from "@/components/ChatButton"
import { FAQModal } from "@/components/FAQModal"
import { FAQCard } from "@/components/FAQCard"
import type { FAQItem } from "@/types"

export default function MasterDashboard() {
  const { user, isAuthenticated, getAllReports, getAllFAQs, addFAQ, updateFAQ, deleteFAQ, allUsers } = useUserStore()
  const router = useRouter()
  const [showFAQModal, setShowFAQModal] = useState(false)
  const [editingFAQ, setEditingFAQ] = useState<FAQItem | null>(null)
  const [faqSearchTerm, setFaqSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<"dashboard" | "faqs">("dashboard")
  const [showStatsModal, setShowStatsModal] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "master") {
      router.push("/login")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "master") {
    return null
  }

  const allReports = getAllReports()
  const completedReports = allReports.filter((r) => r.status === "completed")
  const inProgressReports = allReports.filter((r) => r.status === "in-progress").length
  const pendingReports = allReports.filter((r) => r.status === "pending").length
  const totalUsers = useUserStore.getState().allUsers.length

  // Get recent pending reports for the incoming table
  const recentIncomingReports = allReports
    .filter((r) => r.status === "pending")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  // FAQ Management
  const allFAQs = getAllFAQs()
  const filteredFAQs = allFAQs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(faqSearchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(faqSearchTerm.toLowerCase()) ||
      (faq.content && faq.content.toLowerCase().includes(faqSearchTerm.toLowerCase())),
  )

  const getCreatorName = (createdBy: string) => {
    const creator = allUsers.find((u) => u.id === createdBy)
    return creator ? creator.name : "Unknown"
  }

  const getAssignedToName = (assignedTo?: string) => {
    if (!assignedTo) return "Belum ditugaskan"
    const assignee = allUsers.find((u) => u.id === assignedTo)
    return assignee ? assignee.name : "Unknown"
  }

  const handleFAQSubmit = (data: any) => {
    try {
      if (editingFAQ) {
        updateFAQ(editingFAQ.id, data)
      } else {
        addFAQ({
          ...data,
          createdBy: user!.id,
        })
      }
      setEditingFAQ(null)
    } catch (error) {
      console.error("Error submitting FAQ:", error)
      alert("Terjadi kesalahan saat menyimpan FAQ")
    }
  }

  const handleEditFAQ = (faq: FAQItem) => {
    setEditingFAQ(faq)
    setShowFAQModal(true)
  }

  const handleDeleteFAQ = (faqId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus FAQ ini?")) {
      try {
        deleteFAQ(faqId)
      } catch (error) {
        console.error("Error deleting FAQ:", error)
        alert("Terjadi kesalahan saat menghapus FAQ")
      }
    }
  }

  const handleToggleStatus = (faq: FAQItem) => {
    try {
      updateFAQ(faq.id, { isActive: !faq.isActive })
    } catch (error) {
      console.error("Error toggling FAQ status:", error)
      alert("Terjadi kesalahan saat mengubah status FAQ")
    }
  }

  const handleStatsClick = () => {
    setShowStatsModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showReports showCreateReport showChat />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Tabs */}
        <div className="mb-8 bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Master Admin</h1>
              <p className="text-gray-600 mt-2">Selamat datang, {user.name}</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "dashboard" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("faqs")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "faqs" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Kelola FAQ
            </button>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <>
            {/* Rounded container for cards */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card
                  title="Total Users"
                  value={totalUsers}
                  icon={Users}
                  borderColor="yellow"
                  onClick={() => router.push("/master/users")}
                />

                <Card
                  title="Laporan Selesai"
                  value={completedReports.length}
                  icon={CheckCircle}
                  borderColor="green"
                  onClick={() => router.push("/master/reports?status=completed")}
                />

                <Card
                  title="Laporan Sedang Dikerjakan"
                  value={inProgressReports}
                  icon={Clock}
                  borderColor="blue"
                  onClick={() => router.push("/master/reports?status=in-progress")}
                />

                <Card
                  title="Laporan Belum Dikerjakan"
                  value={pendingReports}
                  icon={AlertCircle}
                  borderColor="red"
                  onClick={() => router.push("/master/reports?status=pending")}
                />
              </div>
            </div>

            {/* Incoming Reports Table */}
            <div className="mt-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Laporan Masuk Terbaru</h2>
                <button
                  onClick={() => router.push("/master/reports")}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Lihat Semua Laporan
                </button>
              </div>
              <IncomingReportsTable reports={recentIncomingReports} basePath="/master/reports" />
            </div>

            {/* Updated System Overview */}
            <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Reports */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Laporan Terbaru</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Judul
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {allReports.slice(0, 5).map((report) => (
                        <tr key={report.id} className="hover:bg-gray-50 transition-colors duration-200">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{report.title}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                report.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : report.status === "in-progress"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {report.status === "completed"
                                ? "Selesai"
                                : report.status === "in-progress"
                                  ? "Dikerjakan"
                                  : "Pending"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* System Stats - Clickable */}
              <div
                className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow duration-200"
                onClick={handleStatsClick}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Statistik Sistem</h2>
                  <div className="flex items-center space-x-2 text-blue-600">
                    <BarChart3 className="w-5 h-5" />
                    <span className="text-sm font-medium">Klik untuk detail</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Total Laporan</span>
                    <span className="text-lg font-bold text-gray-900">{allReports.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Tingkat Penyelesaian</span>
                    <span className="text-lg font-bold text-green-600">
                      {allReports.length > 0 ? Math.round((completedReports.length / allReports.length) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Rata-rata Response Time</span>
                    <span className="text-lg font-bold text-blue-600">2.5 jam</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">User Aktif</span>
                    <span className="text-lg font-bold text-yellow-600">{totalUsers}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* FAQ Tab */}
        {activeTab === "faqs" && (
          <>
            {/* FAQ Header */}
            <div className="mb-6 bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <HelpCircle className="w-8 h-8 text-blue-600" />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Master FAQ Management</h2>
                    <p className="text-gray-600">Kelola semua FAQ sistem dengan kontrol penuh</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowFAQModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Buat FAQ</span>
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari FAQ..."
                  value={faqSearchTerm}
                  onChange={(e) => setFaqSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* FAQ Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFAQs.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada FAQ</h3>
                  <p className="text-gray-500 mb-4">Mulai buat FAQ pertama untuk membantu staff</p>
                  <button
                    onClick={() => setShowFAQModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Buat FAQ Pertama
                  </button>
                </div>
              ) : (
                filteredFAQs.map((faq) => (
                  <div key={faq.id} className="relative">
                    <FAQCard
                      faq={faq}
                      onEdit={handleEditFAQ}
                      onDelete={handleDeleteFAQ}
                      onToggleStatus={handleToggleStatus}
                      showActions={true}
                    />
                    {/* Creator Badge */}
                    <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {getCreatorName(faq.createdBy)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* FAQ Modal */}
        <FAQModal
          isOpen={showFAQModal}
          onClose={() => {
            setShowFAQModal(false)
            setEditingFAQ(null)
          }}
          onSubmit={handleFAQSubmit}
          editingFAQ={editingFAQ}
          title={editingFAQ ? "Edit FAQ" : "Buat FAQ Baru"}
        />

        {/* Statistics Detail Modal */}
        {showStatsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Detail Statistik Sistem</h2>
                  </div>
                  <button
                    onClick={() => setShowStatsModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Completed Reports Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    Laporan Selesai ({completedReports.length})
                  </h3>

                  {completedReports.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>Belum ada laporan yang selesai</p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Judul Laporan
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Dibuat Oleh
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Diselesaikan Oleh
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tanggal Selesai
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Kategori
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {completedReports.map((report) => (
                            <tr key={report.id} className="hover:bg-gray-50 transition-colors duration-200">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{report.title}</div>
                                <div className="text-sm text-gray-500 truncate max-w-xs">{report.description}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {allUsers.find((u) => u.id === report.createdBy)?.name || "Unknown"}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{getAssignedToName(report.assignedTo)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {report.updatedAt
                                    ? new Date(report.updatedAt).toLocaleDateString("id-ID", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })
                                    : "-"}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                  {report.category || "General"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-900">Tingkat Penyelesaian</p>
                        <p className="text-2xl font-bold text-green-600">
                          {allReports.length > 0 ? Math.round((completedReports.length / allReports.length) * 100) : 0}%
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <Clock className="w-8 h-8 text-blue-600" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-blue-900">Rata-rata Waktu</p>
                        <p className="text-2xl font-bold text-blue-600">2.5 jam</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <Users className="w-8 h-8 text-yellow-600" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-yellow-900">Total User</p>
                        <p className="text-2xl font-bold text-yellow-600">{totalUsers}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <ChatButton href="/master/chat" tooltip="Chat support" />
    </div>
  )
}
