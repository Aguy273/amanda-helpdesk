"use client"

import { useUserStore } from "@/store/userStore"

export function TestNotificationButton() {
  const { user, addNotification } = useUserStore()

  const testNotification = () => {
    if (user) {
      addNotification({
        message: `🧪 Test notification untuk ${user.name}`,
        type: "info",
        read: false,
        createdAt: new Date().toISOString(),
        userId: user.id,
      })
    }
  }

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <button
      onClick={testNotification}
      className="fixed bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors duration-200 text-sm z-50"
    >
      Test Notification
    </button>
  )
}
