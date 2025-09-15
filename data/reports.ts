import type { Report } from "@/types"

export const dummyReports: Report[] = [
  {
    id: "1",
    title: "Masalah Koneksi Internet",
    description:
      "Internet di lantai 2 sering terputus dan menyebabkan gangguan kerja. Sudah berlangsung selama 3 hari terakhir.",
    category: "IT Support",
    priority: "high",
    status: "open",
    createdBy: "3",
    assignedTo: "2",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Printer Tidak Berfungsi",
    description: "Printer Canon di ruang admin tidak bisa mencetak. Lampu indikator berkedip merah.",
    category: "Hardware",
    priority: "medium",
    status: "in-progress",
    createdBy: "3",
    assignedTo: "2",
    createdAt: "2024-01-14T14:30:00Z",
    updatedAt: "2024-01-15T09:00:00Z",
  },
  {
    id: "3",
    title: "Aplikasi Payroll Error",
    description: "Sistem payroll menampilkan error saat generate laporan bulanan.",
    category: "Software",
    priority: "high",
    status: "resolved",
    createdBy: "3",
    assignedTo: "2",
    createdAt: "2024-01-13T11:15:00Z",
    updatedAt: "2024-01-14T16:45:00Z",
  },
  {
    id: "4",
    title: "Permintaan Instalasi Software",
    description: "Membutuhkan instalasi Adobe Photoshop untuk tim design.",
    category: "Software",
    priority: "low",
    status: "open",
    createdBy: "3",
    assignedTo: null,
    createdAt: "2024-01-12T09:20:00Z",
    updatedAt: "2024-01-12T09:20:00Z",
  },
  {
    id: "5",
    title: "Keyboard Rusak",
    description: "Beberapa tombol keyboard di workstation 15 tidak berfungsi.",
    category: "Hardware",
    priority: "medium",
    status: "in-progress",
    createdBy: "3",
    assignedTo: "2",
    createdAt: "2024-01-11T13:45:00Z",
    updatedAt: "2024-01-12T08:30:00Z",
  },
]

export const reportCategories = ["IT Support", "Hardware", "Software", "Network", "Security", "General"]

export const reportPriorities = [
  { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
  { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: "high", label: "High", color: "bg-red-100 text-red-800" },
]

export const reportStatuses = [
  { value: "open", label: "Open", color: "bg-blue-100 text-blue-800" },
  { value: "in-progress", label: "In Progress", color: "bg-yellow-100 text-yellow-800" },
  { value: "resolved", label: "Resolved", color: "bg-green-100 text-green-800" },
  { value: "closed", label: "Closed", color: "bg-gray-100 text-gray-800" },
]
