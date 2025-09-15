"use client"

import { useState } from "react"
import { FileText, ImageIcon, Download, Eye, Edit, Trash2, EyeOff } from "lucide-react"
import type { FAQItem } from "@/types"

interface FAQCardProps {
  faq: FAQItem
  onEdit?: (faq: FAQItem) => void
  onDelete?: (id: string) => void
  onToggleStatus?: (faq: FAQItem) => void
  showActions?: boolean
}

export function FAQCard({ faq, onEdit, onDelete, onToggleStatus, showActions = false }: FAQCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getTypeIcon = () => {
    switch (faq.type) {
      case "article":
        return <FileText className="w-5 h-5 text-blue-600" />
      case "file":
        return <ImageIcon className="w-5 h-5 text-green-600" />
      default:
        return <FileText className="w-5 h-5 text-gray-600" />
    }
  }

  const getTypeBadge = () => {
    const badges = {
      text: { label: "Text", color: "bg-gray-100 text-gray-800" },
      article: { label: "Artikel", color: "bg-blue-100 text-blue-800" },
      file: { label: "File", color: "bg-green-100 text-green-800" },
    }

    // Fallback to 'text' if faq.type is undefined or not in badges
    const faqType = faq.type || "text"
    const badge = badges[faqType as keyof typeof badges] || badges.text

    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${badge.color}`}>
        {badge.label}
      </span>
    )
  }

  const handleToggleStatus = () => {
    if (onToggleStatus) {
      onToggleStatus(faq)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {getTypeIcon()}
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{faq.question}</h3>
            </div>
            <div className="flex items-center space-x-2">
              {getTypeBadge()}
              {!faq.isActive && (
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                  <EyeOff className="w-3 h-3 mr-1" />
                  Nonaktif
                </span>
              )}
            </div>
          </div>

          {showActions && (
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={handleToggleStatus}
                className={`p-2 rounded-lg transition-colors ${
                  faq.isActive ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-gray-50"
                }`}
                title={faq.isActive ? "Nonaktifkan" : "Aktifkan"}
              >
                {faq.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button
                onClick={() => onEdit?.(faq)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit FAQ"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete?.(faq.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Hapus FAQ"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content Preview */}
      <div className="p-4">
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{faq.answer}</p>

        {/* Attachments Preview */}
        {faq.attachments && faq.attachments.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs font-medium text-gray-500">{faq.attachments.length} file terlampir</span>
            </div>
            <div className="flex space-x-2 overflow-x-auto">
              {faq.attachments.slice(0, 3).map((attachment) => (
                <div key={attachment.id} className="flex-shrink-0">
                  {attachment.type === "image" ? (
                    <img
                      src={attachment.url || "/placeholder.svg"}
                      alt={attachment.name}
                      className="w-16 h-16 object-cover rounded border cursor-pointer hover:opacity-80"
                      onClick={() => window.open(attachment.url, "_blank")}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded border flex items-center justify-center cursor-pointer hover:bg-gray-200">
                      <FileText className="w-6 h-6 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}
              {faq.attachments.length > 3 && (
                <div className="w-16 h-16 bg-gray-100 rounded border flex items-center justify-center">
                  <span className="text-xs text-gray-600">+{faq.attachments.length - 3}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Expand Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
        >
          {isExpanded ? "Tutup" : "Lihat Detail"}
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          {faq.type === "article" && faq.content && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Konten Artikel:</h4>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{faq.content}</p>
              </div>
            </div>
          )}

          {faq.attachments && faq.attachments.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">File Terlampir:</h4>
              <div className="space-y-2">
                {faq.attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center justify-between p-2 bg-white rounded border">
                    <div className="flex items-center space-x-2">
                      {attachment.type === "image" ? (
                        <ImageIcon className="w-4 h-4 text-green-600" />
                      ) : (
                        <FileText className="w-4 h-4 text-blue-600" />
                      )}
                      <span className="text-sm text-gray-900">{attachment.name}</span>
                    </div>
                    <button
                      onClick={() => window.open(attachment.url, "_blank")}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="Download/View"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-500">
            Dibuat:{" "}
            {new Date(faq.createdAt).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            {faq.updatedAt && (
              <span className="ml-4">
                Diperbarui:{" "}
                {new Date(faq.updatedAt).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
