"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, ImageIcon } from "lucide-react"
import { useUserStore } from "@/store/userStore"
import { Navbar } from "@/components/Navbar"

export default function CreateReportPage() {
  const { user, isAuthenticated, addReport } = useUserStore()
  const router = useRouter()
  const [formData, setFormData] = useState({
    problemType: "",
    description: "",
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "staff") {
      router.push("/login")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "staff") {
    return null
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!formData.problemType || !formData.description) {
      alert("Jenis masalah dan permasalahan harus diisi.")
      setIsSubmitting(false)
      return
    }

    try {
      // Create title based on problem type
      const title = `${formData.problemType === "software" ? "Software" : "Hardware"} Issue`

      addReport({
        title: title,
        description: formData.description,
        createdBy: user!.id,
        status: "pending",
      })
      alert("Laporan berhasil dibuat!")
      router.push("/staff/dashboard")
    } catch (error) {
      console.error("Failed to create report:", error)
      alert("Gagal membuat laporan. Silakan coba lagi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showCreateReport />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 bg-white rounded-2xl p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">Buat Laporan Baru</h1>
          <p className="text-gray-600 mt-2">Isi detail laporan Anda di bawah ini.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side - Image Upload */}
              <div className="flex flex-col items-center">
                <div className="w-full max-w-md">
                  <div
                    className={`
                      relative border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center
                      hover:border-gray-400 transition-colors duration-200 cursor-pointer
                      ${imagePreview ? "border-blue-400" : ""}
                    `}
                    onClick={() => document.getElementById("image-upload")?.click()}
                  >
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                          <span className="text-white text-sm">Klik untuk mengubah gambar</span>
                        </div>
                      </div>
                    ) : (
                      <div className="py-12">
                        <div className="w-16 h-16 mx-auto mb-4 border-2 border-gray-400 rounded-lg flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-600 text-lg mb-2">upload an image</p>
                        <p className="text-gray-400 text-sm">Klik untuk memilih gambar</p>
                      </div>
                    )}
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => document.getElementById("image-upload")?.click()}
                    className="w-full mt-4 bg-teal-700 text-white py-3 px-6 rounded-lg hover:bg-teal-800 transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <Upload className="w-5 h-5" />
                    <span>Choose Image</span>
                  </button>
                </div>
              </div>

              {/* Right Side - Form Fields */}
              <div className="space-y-6">
                {/* Jenis Masalah */}
                <div>
                  <label htmlFor="problemType" className="block text-lg font-medium text-gray-700 mb-3">
                    Jenis masalah
                  </label>
                  <select
                    id="problemType"
                    value={formData.problemType}
                    onChange={(e) => setFormData({ ...formData, problemType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 bg-gray-50"
                    required
                  >
                    <option value="">select an option</option>
                    <option value="software">Software</option>
                    <option value="hardware">Hardware</option>
                  </select>
                </div>

                {/* Permasalahan */}
                <div>
                  <label htmlFor="description" className="block text-lg font-medium text-gray-700 mb-3">
                    Permasalahan
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-gray-50"
                    rows={8}
                    placeholder="masukkan disini ..."
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-teal-700 text-white py-3 px-8 rounded-lg hover:bg-teal-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium"
              >
                {isSubmitting ? "Mengirim..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
