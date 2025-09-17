"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Send, MessageCircle, Users } from "lucide-react"
import { useUserStore } from "@/store/userStore"

export function StaffChatWindow() {
  const { user, addChatMessage, getStaffOwnConversations, allUsers } = useUserStore()
  const [message, setMessage] = useState("")
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const staffMessages = user ? getStaffOwnConversations(user.id) : []

  useEffect(() => {
    // Scroll to bottom on new message
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [staffMessages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && user) {
      addChatMessage({
        senderId: user.id,
        senderName: user.name,
        message: message.trim(),
      })
      setMessage("")
    }
  }

  const getUserAvatar = (senderId: string) => {
    const sender = allUsers.find((u) => u.id === senderId)
    return sender?.avatar || "/placeholder.svg"
  }

  const getSenderRole = (senderId: string) => {
    const sender = allUsers.find((u) => u.id === senderId)
    return sender?.role || "unknown"
  }

  const getSenderName = (senderId: string) => {
    const sender = allUsers.find((u) => u.id === senderId)
    return sender?.name || "Unknown User"
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center p-4 border-b border-gray-200 bg-gray-50">
        <MessageCircle className="w-6 h-6 text-blue-600 mr-3" />
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900">Live Chat Support</h2>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <Users className="w-4 h-4 mr-1" />
            <span>Terhubung dengan Admin & Master</span>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4">
        {staffMessages.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p>Mulai percakapan dengan admin...</p>
            <p className="text-sm mt-2">Pesan Anda akan diterima oleh semua admin dan master</p>
          </div>
        ) : (
          staffMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start ${msg.senderId === user?.id ? "justify-end" : "justify-start"}`}
            >
              {msg.senderId !== user?.id && (
                <img
                  src={getUserAvatar(msg.senderId) || "/placeholder.svg"}
                  alt={getSenderName(msg.senderId)}
                  className="w-8 h-8 rounded-full object-cover mr-3"
                />
              )}
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  msg.senderId === user?.id
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                <div className="font-semibold text-sm mb-1">
                  {msg.senderId === user?.id
                    ? "Anda"
                    : `${getSenderName(msg.senderId)} (${getSenderRole(msg.senderId)})`}
                </div>
                <p className="text-sm">{msg.message}</p>
                <span className={`block text-xs mt-1 ${msg.senderId === user?.id ? "text-blue-200" : "text-gray-500"}`}>
                  {new Date(msg.timestamp).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              {msg.senderId === user?.id && (
                <img
                  src={getUserAvatar(msg.senderId) || "/placeholder.svg"}
                  alt={getSenderName(msg.senderId)}
                  className="w-8 h-8 rounded-full object-cover ml-3"
                />
              )}
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Ketik keluhan atau pertanyaan Anda..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!user}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!user || !message.trim()}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          💡 Pesan Anda akan dikirim ke semua admin dan master untuk respons yang cepat
        </p>
      </form>
    </div>
  )
}
