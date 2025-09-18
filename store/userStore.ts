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
    attachments: [
      {
        id: "attachment-1",
        name: "network-diagram.png",
        url: "/network-diagram-showing-router-connections.jpg",
        type: "image",
        size: 245760,
        uploadedBy: "staff-1",
        uploadedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "attachment-2",
        name: "speed-test-results.pdf",
        url: "/document-icon-for-speed-test-results.jpg",
        type: "document",
        size: 102400,
        uploadedBy: "staff-1",
        uploadedAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
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
    attachments: [
      {
        id: "attachment-3",
        name: "printer-error-photo.jpg",
        url: "/printer-showing-error-message-on-display.jpg",
        type: "image",
        size: 512000,
        uploadedBy: "staff-1",
        uploadedAt: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: "attachment-4",
        name: "printer-troubleshooting-video.mp4",
        url: "/video-thumbnail-showing-printer-troubleshooting-st.jpg",
        type: "video",
        size: 2048000,
        uploadedBy: "staff-1",
        uploadedAt: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: "attachment-5",
        name: "error-log.txt",
        url: "/text-document-icon-for-error-log-file.jpg",
        type: "document",
        size: 8192,
        uploadedBy: "staff-1",
        uploadedAt: new Date(Date.now() - 172800000).toISOString(),
      },
    ],
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
            "on-hold": "Ditahan",
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

      lockReport: (reportId: string, userId: string) => {
        const report = get().reports.find((r) => r.id === reportId)
        if (!report) return false

        // Check if already locked by someone else
        if (report.lockedBy && report.lockedBy !== userId) {
          return false
        }

        const updatedReports = get().reports.map((r) =>
          r.id === reportId
            ? {
              ...r,
              lockedBy: userId,
              lockedAt: new Date().toISOString(),
            }
            : r,
        )
        set({ reports: updatedReports })
        return true
      },

      unlockReport: (reportId: string, userId: string) => {
        const report = get().reports.find((r) => r.id === reportId)
        if (!report || (report.lockedBy && report.lockedBy !== userId)) {
          return false
        }

        const updatedReports = get().reports.map((r) =>
          r.id === reportId
            ? {
              ...r,
              lockedBy: undefined,
              lockedAt: undefined,
            }
            : r,
        )
        set({ reports: updatedReports })
        return true
      },

      isReportLocked: (reportId: string) => {
        const report = get().reports.find((r) => r.id === reportId)
        if (!report || !report.lockedBy) return false

        // Auto-unlock if locked for more than 30 minutes
        const lockTime = new Date(report.lockedAt || "").getTime()
        const now = new Date().getTime()
        const thirtyMinutes = 30 * 60 * 1000

        if (now - lockTime > thirtyMinutes) {
          get().unlockReport(reportId, report.lockedBy)
          return false
        }

        return true
      },

      getReportLockInfo: (reportId: string) => {
        const report = get().reports.find((r) => r.id === reportId)
        if (!report || !report.lockedBy || !get().isReportLocked(reportId)) {
          return null
        }

        return {
          lockedBy: report.lockedBy,
          lockedAt: report.lockedAt || "",
        }
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
        const currentUser = get().user
        if (!currentUser) return

        const newMessage: ChatMessage = {
          ...message,
          id: `message-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          read: false,
        }

        if (currentUser.role === "staff" && !message.recipientId) {
          // Staff sending message to all admin/master users
          const allUsers = get().allUsers
          const adminAndMasterUsers = allUsers.filter((u) => u.role === "admin" || u.role === "master")

          // Create separate message for each admin/master user with proper channel
          const newMessages: ChatMessage[] = []
          adminAndMasterUsers.forEach((adminUser) => {
            const staffMessage: ChatMessage = {
              ...newMessage,
              id: `message-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${adminUser.id}`,
              recipientId: adminUser.id,
              chatChannel: `staff-${currentUser.id}-${adminUser.id}`,
            }
            newMessages.push(staffMessage)
          })

          // Add all messages at once
          set({ chatMessages: [...get().chatMessages, ...newMessages] })

          // Send notifications to admin/master users
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
        } else {
          // Regular admin/master to admin/master or admin/master to staff message
          const enhancedMessage = { ...newMessage }

          if (message.recipientId) {
            // If it's a staff conversation (chatChannel provided)
            if (message.chatChannel) {
              enhancedMessage.chatChannel = message.chatChannel
            } else {
              // Regular conversation between admin/master users
              const ids = [currentUser.id, message.recipientId].sort()
              enhancedMessage.chatChannel = `${ids[0]}-${ids[1]}`
            }
          }

          set({ chatMessages: [...get().chatMessages, enhancedMessage] })

          // Send notification to recipient if it's not a staff message
          if (message.recipientId && !message.chatChannel?.startsWith("staff-")) {
            get().addNotification({
              userId: message.recipientId,
              title: "Pesan Chat Baru",
              message: `${currentUser.name} mengirim pesan: "${newMessage.message.length > 50 ? newMessage.message.substring(0, 50) + "..." : newMessage.message}"`,
              type: "info",
              read: false,
              actionUrl: `/${get().allUsers.find((u) => u.id === message.recipientId)?.role}/chat`,
            })
          }
        }
      },

      getStaffConversations: (adminUserId: string) => {
        const messages = get().chatMessages
        const staffUsers = get().allUsers.filter((u) => u.role === "staff")

        return staffUsers
          .map((staffUser) => {
            const conversationMessages = messages.filter(
              (msg) => msg.chatChannel === `staff-${staffUser.id}-${adminUserId}`,
            )

            return {
              staffUser,
              messages: conversationMessages,
              lastMessage: conversationMessages[conversationMessages.length - 1],
              unreadCount: conversationMessages.filter((msg) => msg.senderId === staffUser.id && !msg.read).length,
            }
          })
          .filter((conv) => conv.messages.length > 0)
      },

      getStaffOwnConversations: (staffUserId: string) => {
        const messages = get().chatMessages
        return messages.filter(
          (msg) =>
            msg.chatChannel?.startsWith(`staff-${staffUserId}-`) ||
            (msg.senderId === staffUserId && msg.chatChannel?.startsWith(`staff-${staffUserId}-`)),
        )
      },

      markMessagesAsRead: (chatChannel: string, userId: string) => {
        const updatedMessages = get().chatMessages.map((msg) =>
          msg.chatChannel === chatChannel && msg.senderId !== userId ? { ...msg, read: true } : msg,
        )
        set({ chatMessages: updatedMessages })
      },
    }),
    {
      name: "helpdesk-storage",
    },
  ),
)
