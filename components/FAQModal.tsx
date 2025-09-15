"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, Upload, FileText, Trash2, Eye } from "lucide-react"
import type { FAQItem, FAQAttachment } from "@/types"

interface FAQModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  editingFAQ?: FAQItem | null
  title: string
}

export function FAQModal({ isOpen, onClose, onSubmit, editingFAQ, title }: FAQModalProps) {
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    content: "",
    type: "text" as "text" | "article" | "file",
    isActive: true,
  })
  const [attachments, setAttachments] = useState<FAQAttachment[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Update form data when editingFAQ changes
  useEffect(() => {
    if (editingFAQ) {
      setFormData({
        question: editingFAQ.question || "",
        answer: editingFAQ.answer || "",
        content: editingFAQ.content || "",
        type: editingFAQ.type || "text",
        isActive: editingFAQ.isActive ?? true,
      })
      setAttachments(editingFAQ.attachments || [])
    } else {
      setFormData({
        question: "",
        answer: "",
        content: "",
        type: "text",
        isActive: true,
      })
      setAttachments([])
    }
  }, [editingFAQ, isOpen])

  if (!isOpen) return null

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        const newAttachment: FAQAttachment = {
          id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          url: reader.result as string,
          type: file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "document",
          size: file.size,
        }
        setAttachments((prev) => [...prev, newAttachment])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      attachments: attachments.length > 0 ? attachments : undefined,
    })
    onClose()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* FAQ Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Jenis FAQ</label>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: "text" })}
                className={`p-4 border-2 rounded-lg text-center transition-all duration-200 ${
                  formData.type === "text"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <FileText className="w-8 h-8 mx-auto mb-2" />
                <div className="font-medium">Text FAQ</div>
                <div className="text-xs text-gray-500">Pertanyaan & jawaban teks</div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: "article" })}
                className={`p-4 border-2 rounded-lg text-center transition-all duration-200 ${
                  formData.type === "article"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <FileText className="w-8 h-8 mx-auto mb-2" />
                <div className="font-medium">Artikel</div>
                <div className="text-xs text-gray-500">Konten artikel lengkap</div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: "file" })}
                className={`p-4 border-2 rounded-lg text-center transition-all duration-200 ${
                  formData.type === "file"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <Upload className="w-8 h-8 mx-auto mb-2" />
                <div className="font-medium">File & Media</div>
                <div className="text-xs text-gray-500">Dengan lampiran file</div>
              </button>
            </div>
          </div>

          {/* Question */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {formData.type === "article" ? "Judul Artikel" : "Pertanyaan"}
            </label>
            <input
              type="text"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={formData.type === "article" ? "Masukkan judul artikel..." : "Masukkan pertanyaan..."}
              required
            />
          </div>

          {/* Answer/Content based on type */}
          {formData.type === "text" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jawaban</label>
              <textarea
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Masukkan jawaban..."
                required
              />
            </div>
          )}

          {formData.type === "article" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ringkasan</label>
                <textarea
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Ringkasan singkat artikel..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Konten Artikel</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={8}
                  placeholder="Tulis konten artikel lengkap di sini..."
                  required
                />
              </div>
            </>
          )}

          {formData.type === "file" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
              <textarea
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Deskripsi file atau media..."
                required
              />
            </div>
          )}

          {/* File Upload Section */}
          {(formData.type === "file" || formData.type === "article") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.type === "article" ? "Gambar Pendukung (Opsional)" : "Upload File/Media"}
              </label>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">Klik untuk upload file atau drag & drop</p>
                <p className="text-sm text-gray-500">Mendukung: Gambar, Video, PDF, DOC, TXT</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Pilih File
                </button>
              </div>

              {/* Attachment Preview */}
              {attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="font-medium text-gray-700">File Terlampir:</h4>
                  {attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {attachment.type === "image" ? (
                          <div className="relative">
                            <img
                              src={attachment.url || "/placeholder.svg"}
                              alt={attachment.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center">
                            <FileText className="w-6 h-6 text-blue-600" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{attachment.name}</p>
                          <p className="text-sm text-gray-500">{formatFileSize(attachment.size)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {attachment.type === "image" && (
                          <button
                            type="button"
                            onClick={() => window.open(attachment.url, "_blank")}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeAttachment(attachment.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">
              FAQ Aktif (Tampil untuk staff)
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              {editingFAQ ? "Update FAQ" : "Buat FAQ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
