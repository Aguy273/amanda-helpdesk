"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { Send, Phone, Video, Info, Smile, Paperclip, FileText } from "lucide-react"
import { useUserStore } from "@/store/userStore"

interface ChatAreaProps {
  selectedUserId: string | null
  currentUserRole: "admin" | "master"
}

export function ChatArea({ selectedUserId, currentUserRole }: ChatAreaProps) {
  const { user, addChatMessage, getChatMessages, getStaffOwnConversations, allUsers } = useUserStore()
  const markMessagesAsRead = useUserStore((state) => state.markMessagesAsRead)

  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const allMessages = getChatMessages()

  const isStaffConversation = selectedUserId?.startsWith("staff-")
  const actualStaffUserId = isStaffConversation ? selectedUserId.replace("staff-", "") : null
  const selectedUser = allUsers.find((u) => u.id === (actualStaffUserId || selectedUserId))

  // Common emojis for quick access
  const commonEmojis = ["😀", "😂", "😊", "😍", "🤔", "👍", "👎", "❤️", "🎉", "🔥", "💯", "😎"]

  const getConversationMessages = useCallback(() => {
    if (selectedUserId === "all") {
      return allMessages
    }
    if (!selectedUserId || !user) return []

    if (isStaffConversation && actualStaffUserId) {
      // Get staff conversation messages
      const chatChannel = `staff-${actualStaffUserId}-${user.id}`
      return allMessages.filter((msg) => msg.chatChannel === chatChannel)
    }

    // Regular admin/master conversation
    return allMessages.filter(
      (msg) =>
        (msg.senderId === user.id && msg.recipientId === selectedUserId) ||
        (msg.senderId === selectedUserId && msg.recipientId === user.id),
    )
  }, [selectedUserId, user, allMessages, isStaffConversation, actualStaffUserId])

  const conversationMessages = getConversationMessages()

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [conversationMessages]) // Use entire array instead of length

  useEffect(() => {
    if (isStaffConversation && actualStaffUserId && user) {
      const chatChannel = `staff-${actualStaffUserId}-${user.id}`
      markMessagesAsRead(chatChannel, user.id)
    }
  }, [selectedUserId, user, isStaffConversation, actualStaffUserId, markMessagesAsRead])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && user && selectedUserId && selectedUserId !== "all") {
      if (isStaffConversation && actualStaffUserId) {
        // Send message to staff user
        addChatMessage({
          senderId: user.id,
          senderName: user.name,
          message: message.trim(),
          recipientId: actualStaffUserId,
          type: "text",
          chatChannel: `staff-${actualStaffUserId}-${user.id}`,
        })
      } else {
        // Regular admin/master message
        addChatMessage({
          senderId: user.id,
          senderName: user.name,
          message: message.trim(),
          recipientId: selectedUserId,
          type: "text",
        })
      }
      setMessage("")
      setShowEmojiPicker(false)
    }
  }

  const handleEmojiClick = (emoji: string) => {
    setMessage((prev) => prev + emoji)
    setShowEmojiPicker(false)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && user && selectedUserId && selectedUserId !== "all") {
      const fileMessage = {
        senderId: user.id,
        senderName: user.name,
        message: `📎 ${file.name}`,
        recipientId: isStaffConversation && actualStaffUserId ? actualStaffUserId : selectedUserId,
        type: "file" as const,
        fileName: file.name,
      }

      if (isStaffConversation && actualStaffUserId) {
        addChatMessage({
          ...fileMessage,
          chatChannel: `staff-${actualStaffUserId}-${user.id}`,
        })
      } else {
        addChatMessage(fileMessage)
      }
    }
  }

  const getUserAvatar = (senderId: string) => {
    const sender = allUsers.find((u) => u.id === senderId)
    return sender?.avatar || "/placeholder.svg"
  }

  const getUserName = (senderId: string) => {
    const sender = allUsers.find((u) => u.id === senderId)
    return sender?.name || "Unknown User"
  }

  const getSenderRole = (senderId: string) => {
    const sender = allUsers.find((u) => u.id === senderId)
    return sender?.role || "unknown"
  }

  // Simulate typing indicator
  useEffect(() => {
    if (selectedUser) {
      const interval = setInterval(() => {
        setIsTyping(Math.random() > 0.8)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [selectedUser]) // Use entire selectedUser object instead of id

  if (!selectedUserId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
          <p className="text-gray-500">Choose a user from the sidebar to start chatting</p>
        </div>
      </div>
    )
  }

  if (selectedUserId === "all") {
    return (
      <div className="flex-1 flex flex-col bg-white">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
              <span className="text-gray-600 font-semibold text-sm">ALL</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">All Conversations</h3>
              <p className="text-sm text-gray-500">Monitoring all chat activity</p>
            </div>
          </div>
        </div>

        <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
          {conversationMessages.length === 0 ? (
            <div className="text-center text-gray-500 py-10">No messages to monitor</div>
          ) : (
            conversationMessages.map((msg) => (
              <div key={msg.id} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-start space-x-3">
                  <img
                    src={getUserAvatar(msg.senderId) || "/placeholder.svg"}
                    alt={msg.senderName}
                    className="w-8 h-8 rounded-full object-cover mr-3"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-sm text-gray-900">{msg.senderName}</span>
                      <span className="text-xs text-gray-500 uppercase bg-gray-100 px-2 py-1 rounded">
                        {getSenderRole(msg.senderId)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(msg.timestamp).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{msg.message}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center">
          <div className="relative">
            <img
              src={selectedUser?.avatar || "/placeholder.svg"}
              alt={selectedUser?.name}
              className="w-10 h-10 rounded-full object-cover mr-3"
            />
            <div className="absolute bottom-0 right-3 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedUser?.name}
              {isStaffConversation && <span className="text-sm text-blue-600 ml-2">(Staff)</span>}
            </h3>
            <p className="text-sm text-green-500">{isTyping ? `${selectedUser?.name} is typing...` : "Online"}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Phone className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Video className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Info className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
        <div className="flex items-center justify-center">
          <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
            Today, {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" })}
          </div>
        </div>

        {conversationMessages.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            Start a conversation with {selectedUser?.name}
            {isStaffConversation && <p className="text-sm mt-2">This is a staff support conversation</p>}
          </div>
        ) : (
          conversationMessages.map((msg) => {
            const isOwnMessage = msg.senderId === user?.id
            return (
              <div key={msg.id} className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                <div className="flex items-end space-x-2 max-w-xs lg:max-w-md">
                  {!isOwnMessage && (
                    <img
                      src={getUserAvatar(msg.senderId) || "/placeholder.svg"}
                      alt={msg.senderName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <div>
                    {!isOwnMessage && <div className="text-xs text-gray-500 mb-1 ml-2">{msg.senderName}</div>}
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        isOwnMessage
                          ? "bg-blue-500 text-white rounded-br-md"
                          : "bg-white text-gray-800 rounded-bl-md shadow-sm"
                      }`}
                    >
                      {msg.type === "file" ? (
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4" />
                          <span className="text-sm">{msg.message}</span>
                        </div>
                      ) : (
                        <p className="text-sm">{msg.message}</p>
                      )}
                    </div>
                    <div className={`text-xs text-gray-500 mt-1 ${isOwnMessage ? "text-right" : "text-left"}`}>
                      {new Date(msg.timestamp).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  {isOwnMessage && (
                    <img
                      src={getUserAvatar(msg.senderId) || "/placeholder.svg"}
                      alt={msg.senderName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Message Input */}
      {selectedUserId !== "all" && (
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            {/* File Upload */}
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Attach file"
            >
              <Paperclip className="w-5 h-5 text-gray-600" />
            </button>

            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={`Message ${selectedUser?.name}...`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                disabled={!user}
              />

              {/* Emoji Picker */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Add emoji"
                >
                  <Smile className="w-5 h-5 text-gray-600" />
                </button>

                {showEmojiPicker && (
                  <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 grid grid-cols-6 gap-2 z-10">
                    {commonEmojis.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => handleEmojiClick(emoji)}
                        className="text-lg hover:bg-gray-100 rounded p-1 transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white p-3 rounded-2xl hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!user || !message.trim()}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
