"use client"

import { X, Mail, MapPin } from "lucide-react"
import { useUserStore } from "@/store/userStore"

interface StaffDetailModalProps {
  isOpen: boolean
  onClose: () => void
  staffId: string
}

export function StaffDetailModal({ isOpen, onClose, staffId }: StaffDetailModalProps) {
  const { allUsers } = useUserStore()
  const staff = allUsers.find((u) => u.id === staffId)

  if (!isOpen || !staff) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Detail Staff</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex flex-col items-center mb-4">
            <img
              src={staff.avatar || "/placeholder.svg"}
              alt={staff.name}
              className="w-24 h-24 rounded-full object-cover border-2 border-blue-400 shadow-md"
            />
            <h3 className="text-2xl font-bold text-gray-900 mt-4">{staff.name}</h3>
            <p className="text-gray-600 text-sm">{staff.role.toUpperCase()}</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-600" />
              <p className="text-gray-800">{staff.email}</p>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-gray-600 shrink-0 mt-1" />
              <p className="text-gray-800">{staff.address || "Alamat belum diisi"}</p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}
