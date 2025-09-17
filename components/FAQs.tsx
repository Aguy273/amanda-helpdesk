"use client"

import { useState } from "react"
import { Search, ChevronDown, ChevronUp, FileText, ImageIcon, Download, Eye } from "lucide-react"
import { useUserStore } from "@/store/userStore"

export function FAQs() {
  const { getActiveFAQs } = useUserStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const faqs = getActiveFAQs()

  // Get unique categories
  const categories = ["all", ...Array.from(new Set(faqs.map((faq) => faq.category)))]

  // Filter FAQs based on search term and category
  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId)
  }

  const getTypeBadge = (faq: any) => {
    const badges = {
      text: { label: "Text", color: "bg-gray-100 text-gray-800" },
      article: { label: "Artikel", color: "bg-blue-100 text-blue-800" },
      file: { label: "File", color: "bg-green-100 text-green-800" },
    }

    const faqType = faq.type || "text"
    const badge = badges[faqType as keyof typeof badges] || badges.text

    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${badge.color}`}>
        {badge.label}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
        <p className="text-gray-600">Temukan jawaban untuk pertanyaan yang sering diajukan</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari FAQ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {categories.map((category, index) => (
            <option key={`${category}-${index}`} value={category}>
              {category === "all" ? "Semua Kategori" : category}
            </option>
          ))}
        </select>
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm || selectedCategory !== "all"
                ? "Tidak ada FAQ yang sesuai dengan pencarian Anda"
                : "Belum ada FAQ yang tersedia"}
            </p>
          </div>
        ) : (
          filteredFAQs.map((faq) => (
            <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    {getTypeBadge(faq)}
                    <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {faq.category}
                    </span>
                  </div>
                </div>
                {expandedFAQ === faq.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {expandedFAQ === faq.id && (
                <div className="px-6 py-4 bg-white border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed mb-4">{faq.answer}</p>

                  {(faq as any).type === "article" && (faq as any).content && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Konten Artikel:</h4>
                      <div className="prose prose-sm max-w-none">
                        <p className="text-gray-700 whitespace-pre-wrap">{(faq as any).content}</p>
                      </div>
                    </div>
                  )}

                  {(faq as any).attachments && (faq as any).attachments.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">File Terlampir:</h4>

                      {/* Image previews */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                        {(faq as any).attachments
                          .filter((att: any) => att.type === "image")
                          .map((attachment: any) => (
                            <div key={attachment.id} className="relative group">
                              <img
                                src={attachment.url || "/placeholder.svg"}
                                alt={attachment.name}
                                className="w-full h-24 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => window.open(attachment.url, "_blank")}
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded flex items-center justify-center">
                                <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          ))}
                      </div>

                      {/* File list */}
                      <div className="space-y-2">
                        {(faq as any).attachments.map((attachment: any) => (
                          <div
                            key={attachment.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              {attachment.type === "image" ? (
                                <ImageIcon className="w-5 h-5 text-green-600" />
                              ) : (
                                <FileText className="w-5 h-5 text-blue-600" />
                              )}
                              <div>
                                <p className="font-medium text-gray-900 text-sm">{attachment.name}</p>
                                {attachment.size && (
                                  <p className="text-xs text-gray-500">
                                    {typeof attachment.size === "number"
                                      ? `${(attachment.size / 1024).toFixed(1)} KB`
                                      : attachment.size}
                                  </p>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => window.open(attachment.url, "_blank")}
                              className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                              title="Download/View"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
