"use client"

import { useEffect, useState } from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { useUserStore } from "@/store/userStore"
import type { Notification } from "@/types"

export function NotificationToast() {
  const { user, notifications } = useUserStore()
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([])

  useEffect(() => {
    if (!user) return

    const recentNotifications = notifications.filter((n) => {
      const isForUser = n.userId === user.id
      const isRecent = new Date().getTime() - new Date(n.createdAt).getTime() < 10000 // 10 seconds
      return isForUser && !n.read && isRecent
    })

    if (recentNotifications.length > 0) {
      setVisibleNotifications((prev) => {
        const newNotificationIds = recentNotifications.map((n) => n.id).sort()
        const currentNotificationIds = prev.map((n) => n.id).sort()

        if (JSON.stringify(newNotificationIds) !== JSON.stringify(currentNotificationIds)) {
          return recentNotifications.slice(0, 3) // Show max 3 toasts
        }
        return prev
      })

      const timer = setTimeout(() => {
        setVisibleNotifications([])
      }, 8000)

      return () => clearTimeout(timer)
    } else {
      setVisibleNotifications([])
    }
  }, [notifications, user]) // Updated dependency array

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getBorderColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "border-l-green-500"
      case "error":
        return "border-l-red-500"
      case "warning":
        return "border-l-yellow-500"
      default:
        return "border-l-blue-500"
    }
  }

  const getBackgroundColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-50"
      case "error":
        return "bg-red-50"
      case "warning":
        return "bg-yellow-50"
      default:
        return "bg-blue-50"
    }
  }

  const removeNotification = (id: string) => {
    setVisibleNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  if (visibleNotifications.length === 0) return null

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {visibleNotifications.map((notification) => (
        <div
          key={notification.id}
          className={`${getBackgroundColor(notification.type)} rounded-lg shadow-lg border-l-4 ${getBorderColor(notification.type)} p-4 max-w-sm animate-fade-in-up`}
        >
          <div className="flex items-start space-x-3">
            {getNotificationIcon(notification.type)}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{notification.title}</p>
              <p className="text-sm text-gray-700 mt-1">{notification.message}</p>
              <p className="text-xs text-gray-500 mt-1">Baru saja</p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
