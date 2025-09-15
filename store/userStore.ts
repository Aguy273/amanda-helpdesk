import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { UserStore, User, Report, Notification, FAQ, ChatMessage } from "@/types"

// Initial data
const initialUsers: User[] = [
  {
    id: "master-1",
    name: "Master Admin",
    email: "master@helpdesk.com",
    role: "master",
    address: "Jakarta, Indonesia",
    avatar: "/master-avatar.png",
    password: "password123",
    createdAt: new Date().toISOString(),
  },
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@helpdesk.com",
    role: "admin",
    address: "Bandung, Indonesia",
    avatar: "/admin-avatar.png",
    password: "password123",
    createdAt: new Date().toISOString(),
  },
  {
    id: "staff-1",
    name: "Staff User",
    email: "staff@helpdesk.com",
    role: "staff",
    address: "Surabaya, Indonesia",
    avatar: "/diverse-staff-avatars.png",
    password: "password123",
    createdAt: new Date().toISOString(),
  },
]

const initialReports: Report[] = [
  {
    id: "report-1",
    title: "Masalah Jaringan Internet",
    description: "Koneksi internet di lantai 2 sering terputus",
    status: "pending",
    createdBy: "staff-1",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    priority: "high",
    category: "Network",
  },
  {
    id: "report-2",
    title: "Printer Tidak Berfungsi",
    description: "Printer di ruang admin tidak dapat mencetak dokumen",
    status: "in-progress",
    createdBy: "staff-1",
    assignedTo: "admin-1",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    priority: "medium",
    category: "Hardware",
  },
]

const initialFAQs: FAQ[] = [
  {
    id: "faq-1",
    question: "Bagaimana cara reset password?",
    answer: "Untuk reset password, silakan hubungi admin atau gunakan fitur 'Lupa Password' di halaman login.",
    category: "Account",
    isActive: true,
    createdAt: new Date().toISOString(),
    createdBy: "admin-1",
  },
  {
    id: "faq-2",
    question: "Bagaimana cara membuat laporan baru?",
    answer: "Klik tombol 'Buat Laporan' di dashboard, isi form dengan lengkap, lalu submit.",
    category: "Reports",
    isActive: true,
    createdAt: new Date().toISOString(),
    createdBy: "admin-1",
  },
]

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      allUsers: initialUsers,
      reports: initialReports,
      notifications: [],
      faqs: initialFAQs,
      chatMessages: [],

      // Auth methods
      login: (email: string, password: string) => {
        const user = get().allUsers.find((u) => u.email === email && u.password === password)
        if (user) {
          set({ user, isAuthenticated: true })
          return true
        }
        return false
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },

      // User methods
      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user
        if (!currentUser) return

        const updatedUser = { ...currentUser, ...updates, updatedAt: new Date().toISOString() }
        const updatedUsers = get().allUsers.map((u) => (u.id === currentUser.id ? updatedUser : u))

        set({
          user: updatedUser,
          allUsers: updatedUsers,
        })
      },

      getAllUsers: () => get().allUsers,

      addUser: (userData) => {
        const newUser: User = {
          ...userData,
          id: `user-${Date.now()}`,
          createdAt: new Date().toISOString(),
        }
        set({ allUsers: [...get().allUsers, newUser] })
      },

      updateUserById: (userId: string, updates: Partial<User>) => {
        const updatedUsers = get().allUsers.map((user) =>
          user.id === userId ? { ...user, ...updates, updatedAt: new Date().toISOString() } : user,
        )
        set({ allUsers: updatedUsers })

        // Update current user if it's the same user
        const currentUser = get().user
        if (currentUser && currentUser.id === userId) {
          set({ user: { ...currentUser, ...updates, updatedAt: new Date().toISOString() } })
        }
      },

      deleteUser: (userId: string) => {
        const updatedUsers = get().allUsers.filter((user) => user.id !== userId)
        set({ allUsers: updatedUsers })
      },

      // Report methods
      getAllReports: () => get().reports,

      getReportById: (id: string) => get().reports.find((r) => r.id === id),

      addReport: (reportData) => {
        const newReport: Report = {
          ...reportData,
          id: `report-${Date.now()}`,
          createdAt: new Date().toISOString(),
        }
        set({ reports: [...get().reports, newReport] })

        const currentUser = get().user
        if (currentUser?.role === "staff") {
          const allUsers = get().allUsers
          const adminAndMasterUsers = allUsers.filter((u) => u.role === "admin" || u.role === "master")

          adminAndMasterUsers.forEach((adminUser) => {
            get().addNotification({
              userId: adminUser.id,
              title: "Laporan Baru Masuk",
              message: `${currentUser.name} telah membuat laporan baru: "${newReport.title}"`,
              type: "info",
              read: false,
              actionUrl: `/${adminUser.role}/reports/${newReport.id}`,
            })
          })
        }
      },

      updateReport: (id: string, updates: Partial<Report>) => {
        const currentUser = get().user
        const report = get().reports.find((r) => r.id === id)

        if (!report || !currentUser) return

        const updatedReports = get().reports.map((report) =>
          report.id === id ? { ...report, ...updates, updatedAt: new Date().toISOString() } : report,
        )
        set({ reports: updatedReports })

        // Send notification to staff who created the report when admin/master changes status
        if (
          updates.status &&
          (currentUser.role === "admin" || currentUser.role === "master") &&
          report.createdBy !== currentUser.id
        ) {
          const statusText = {
            pending: "Pending",
            "in-progress": "Sedang Dikerjakan",
            completed: "Selesai",
            rejected: "Ditolak",
          }

          get().addNotification({
            userId: report.createdBy,
            title: "Status Laporan Diperbarui",
            message: `Status laporan "${report.title}" telah diubah menjadi ${statusText[updates.status]}`,
            type: updates.status === "completed" ? "success" : updates.status === "rejected" ? "error" : "info",
            read: false,
            actionUrl: `/staff/reports/${id}`,
          })
        }
      },

      deleteReport: (id: string) => {
        const updatedReports = get().reports.filter((report) => report.id !== id)
        set({ reports: updatedReports })
      },

      // Notification methods
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: `notification-${Date.now()}`,
          createdAt: new Date().toISOString(),
        }
        set({ notifications: [...get().notifications, newNotification] })
      },

      getNotifications: (userId: string) => {
        return get().notifications.filter((n) => n.userId === userId)
      },

      markNotificationAsRead: (notificationId: string) => {
        const updatedNotifications = get().notifications.map((notification) =>
          notification.id === notificationId ? { ...notification, read: true } : notification,
        )
        set({ notifications: updatedNotifications })
      },

      deleteNotification: (notificationId: string) => {
        const updatedNotifications = get().notifications.filter((notification) => notification.id !== notificationId)
        set({ notifications: updatedNotifications })
      },

      // FAQ methods
      getActiveFAQs: () => get().faqs.filter((faq) => faq.isActive),

      getAllFAQs: () => get().faqs,

      addFAQ: (faq) => {
        const newFAQ: FAQ = {
          ...faq,
          id: `faq-${Date.now()}`,
          createdAt: new Date().toISOString(),
        }
        set({ faqs: [...get().faqs, newFAQ] })
      },

      updateFAQ: (id: string, updates: Partial<FAQ>) => {
        const updatedFAQs = get().faqs.map((faq) =>
          faq.id === id ? { ...faq, ...updates, updatedAt: new Date().toISOString() } : faq,
        )
        set({ faqs: updatedFAQs })
      },

      deleteFAQ: (id: string) => {
        const updatedFAQs = get().faqs.filter((faq) => faq.id !== id)
        set({ faqs: updatedFAQs })
      },

      // Chat methods
      getChatMessages: () => get().chatMessages,

      addChatMessage: (message) => {
        const newMessage: ChatMessage = {
          ...message,
          id: `message-${Date.now()}`,
          timestamp: new Date().toISOString(),
        }
        set({ chatMessages: [...get().chatMessages, newMessage] })

        const currentUser = get().user
        if (currentUser?.role === "staff") {
          const allUsers = get().allUsers
          const adminAndMasterUsers = allUsers.filter((u) => u.role === "admin" || u.role === "master")

          adminAndMasterUsers.forEach((adminUser) => {
            get().addNotification({
              userId: adminUser.id,
              title: "Pesan Chat Baru",
              message: `${currentUser.name} mengirim pesan: "${newMessage.message.length > 50 ? newMessage.message.substring(0, 50) + "..." : newMessage.message}"`,
              type: "info",
              read: false,
              actionUrl: `/${adminUser.role}/chat`,
            })
          })
        }
      },
    }),
    {
      name: "helpdesk-storage",
    },
  ),
)
