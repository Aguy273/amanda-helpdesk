export interface User {
  id: string
  name: string
  email: string
  role: "master" | "admin" | "staff"
  address?: string
  avatar?: string
  password: string
  createdAt: string
  updatedAt?: string
}

export interface Report {
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed" | "rejected" | "on-hold"
  createdBy: string
  assignedTo?: string
  createdAt: string
  updatedAt?: string
  priority?: "low" | "medium" | "high"
  category?: string
  reporterName?: string
  phoneNumber?: string
  problemType?: string
  statusHistory?: ReportStatusHistory[]
  attachments?: ReportAttachment[]
  lockedBy?: string
  lockedAt?: string
  urgency?: "critical" | "medium" | "low"
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  userId: string
  read: boolean
  createdAt: string
  actionUrl?: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  isActive: boolean
  createdAt: string
  updatedAt?: string
  createdBy: string
}

export interface FAQAttachment {
  id: string
  name: string
  url: string
  type: "image" | "video" | "document"
  size: number
}

export interface FAQItem extends FAQ {
  type?: "text" | "article" | "file"
  content?: string
  attachments?: FAQAttachment[]
}

export interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  recipientId?: string
  message: string
  timestamp: string
  type?: "text" | "file" | "image"
  fileName?: string
  chatChannel?: string // Added chatChannel for better message routing
  read?: boolean // Added read status for message tracking
}

export interface UserStore {
  user: User | null
  isAuthenticated: boolean
  allUsers: User[]
  reports: Report[]
  notifications: Notification[]
  faqs: FAQ[]
  chatMessages: ChatMessage[]

  // Auth methods
  login: (email: string, password: string) => boolean
  logout: () => void

  // User methods
  updateUser: (updates: Partial<User>) => void
  getAllUsers: () => User[]
  addUser: (userData: Omit<User, "id" | "createdAt">) => void
  updateUserById: (userId: string, updates: Partial<User>) => void
  deleteUser: (userId: string) => void

  // Report methods
  getAllReports: () => Report[]
  getReportById: (id: string) => Report | undefined
  addReport: (reportData: Omit<Report, "id" | "createdAt">) => void
  updateReport: (id: string, updates: Partial<Report>) => void
  deleteReport: (id: string) => void
  lockReport: (reportId: string, userId: string) => boolean
  unlockReport: (reportId: string, userId: string) => boolean
  isReportLocked: (reportId: string) => boolean
  getReportLockInfo: (reportId: string) => { lockedBy: string; lockedAt: string } | null

  // Notification methods
  addNotification: (notification: Omit<Notification, "id" | "createdAt">) => void
  getNotifications: (userId: string) => Notification[]
  markNotificationAsRead: (notificationId: string) => void
  deleteNotification: (notificationId: string) => void

  // FAQ methods
  getActiveFAQs: () => FAQ[]
  getAllFAQs: () => FAQ[]
  addFAQ: (faq: Omit<FAQ, "id" | "createdAt">) => void
  updateFAQ: (id: string, updates: Partial<FAQ>) => void
  deleteFAQ: (id: string) => void

  // Chat methods
  getChatMessages: () => ChatMessage[]
  addChatMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void
  getStaffConversations: (adminUserId: string) => Array<{
    staffUser: User
    messages: ChatMessage[]
    lastMessage?: ChatMessage
    unreadCount: number
  }>
  getStaffOwnConversations: (staffUserId: string) => ChatMessage[]
  markMessagesAsRead: (chatChannel: string, userId: string) => void
}

export interface ReportStatusHistory {
  id: string
  status: Report["status"]
  changedBy: string
  changedAt: string
  note?: string
}

export interface ReportAttachment {
  id: string
  name: string
  url: string
  type: "image" | "video" | "document"
  size: number
  uploadedBy: string
  uploadedAt: string
}
