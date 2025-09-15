"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, Clock, AlertCircle, Plus, Search, HelpCircle } from "lucide-react"
import { useUserStore } from "@/store/userStore"
import { Navbar } from "@/components/Navbar"
import { Card } from "@/components/Card"
import { IncomingReportsTable } from "@/components/IncomingReportsTable"
import { FAQModal } from "@/components/FAQModal"
import { FAQCard } from "@/components/FAQCard"
import type { FAQItem } from "@/types"

export default function AdminDashboard() {
  const { user, isAuthenticated, getAllReports, getAllFAQs, addFAQ, updateFAQ, deleteFAQ } = useUserStore()
  const router = useRouter()
  const [showFAQModal, setShowFAQModal] = useState(false)
  const [editingFAQ, setEditingFAQ] = useState<FAQItem | null>(null)
  const [faqSearchTerm, setFaqSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<"dashboard" | "faqs">("dashboard")

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/login")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  const allReports = getAllReports()
  const completedReports = allReports.filter((r) => r.status === "completed").length
  const inProgressReports = allReports.filter((r) => r.status === "in-progress").length
  const pendingReports = allReports.filter((r) => r.status === "pending").length

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showReports showChat />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Tabs */}
        <div className="mb-8 bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
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
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card
                  title="Laporan Selesai"
                  value={completedReports}
                  icon={CheckCircle}
                  borderColor="green"
                  onClick={() => router.push("/admin/reports?status=completed")}
                />

                <Card
                  title="Laporan Sedang Dikerjakan"
                  value={inProgressReports}
                  icon={Clock}
                  borderColor="blue"
                  onClick={() => router.push("/admin/reports?status=in-progress")}
                />

                <Card
                  title="Laporan Belum Dikerjakan"
                  value={pendingReports}
                  icon={AlertCircle}
                  borderColor="red"
                  onClick={() => router.push("/admin/reports?status=pending")}
                />
              </div>
            </div>

            {/* Incoming Reports Table */}
            <div className="mt-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Laporan Masuk Terbaru</h2>
                <button
                  onClick={() => router.push("/admin/reports")}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Lihat Semua Laporan
                </button>
              </div>
              <IncomingReportsTable reports={recentIncomingReports} basePath="/admin/reports" />
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
                    <h2 className="text-2xl font-bold text-gray-900">Kelola FAQ</h2>
                    <p className="text-gray-600">Buat dan kelola pertanyaan yang sering ditanyakan</p>
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
                  <FAQCard
                    key={faq.id}
                    faq={faq}
                    onEdit={handleEditFAQ}
                    onDelete={handleDeleteFAQ}
                    onToggleStatus={handleToggleStatus}
                    showActions={true}
                  />
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
      </main>
    </div>
  )
}
