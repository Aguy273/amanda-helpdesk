"use client"

import { useState } from "react"
import { Search, Pin, Edit, MoreHorizontal, MessageSquare } from "lucide-react"
import { useUserStore } from "@/store/userStore"

interface ChatSidebarProps {
  selectedUserId: string | null
  onSelectUser: (userId: string) => void
  currentUserRole: "admin" | "master"
}

export function ChatSidebar({ selectedUserId, onSelectUser, currentUserRole }: ChatSidebarProps) {
  const { allUsers, getChatMessages, getStaffConversations, user } = useUserStore()
  const [searchTerm, setSearchTerm] = useState("")

  const staffConversations = user ? getStaffConversations(user.id) : []

  // Get available users to chat with based on role (excluding staff for direct chat)
  const getAvailableUsers = () => {
    if (currentUserRole === "admin") {
      // Admin can chat with master (staff conversations handled separately)
      return allUsers.filter((u) => u.role === "master")
    } else if (currentUserRole === "master") {
      // Master can chat with admin (staff conversations handled separately)
      return allUsers.filter((u) => u.role === "admin")
    }
    return []
  }

  const availableUsers = getAvailableUsers()
  const allMessages = getChatMessages()

  // Get last message for each user (regular admin/master conversations)
  const getUserLastMessage = (userId: string) => {
    const userMessages = allMessages.filter(
      (msg) =>
        (msg.senderId === userId && msg.recipientId === user?.id) ||
        (msg.senderId === user?.id && msg.recipientId === userId),
    )
    return userMessages[userMessages.length - 1]
  }

  // Get unread count for each user
  const getUnreadCount = (userId: string) => {
    const userMessages = allMessages.filter(
      (msg) => msg.senderId === userId && msg.recipientId === user?.id && !msg.read,
    )
    return userMessages.length
  }

  // Filter users based on search
  const filteredUsers = availableUsers.filter((u) => u.name.toLowerCase().includes(searchTerm.toLowerCase()))
  const filteredStaffConversations = staffConversations.filter((conv) =>
    conv.staffUser.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Get time ago string
  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const messageDate = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "now"
    if (diffInMinutes < 60) return `${diffInMinutes}m`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`
    return `${Math.floor(diffInMinutes / 1440)}d`
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Edit className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      {filteredStaffConversations.length > 0 && (
        <>
          <div className="px-4 py-2 border-b border-gray-100">
            <div className="flex items-center text-gray-500 text-sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              <span>Staff Messages</span>
            </div>
          </div>

          <div className="border-b border-gray-100">
            {filteredStaffConversations.map((conversation) => {
              const isSelected = selectedUserId === `staff-${conversation.staffUser.id}`

              return (
                <div
                  key={`staff-${conversation.staffUser.id}`}
                  onClick={() => onSelectUser(`staff-${conversation.staffUser.id}`)}
                  className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    isSelected ? "bg-blue-50 border-r-2 border-blue-500" : ""
                  }`}
                >
                  <div className="relative">
                    <img
                      src={conversation.staffUser.avatar || "/placeholder.svg"}
                      alt={conversation.staffUser.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>

                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{conversation.staffUser.name}</h3>
                      <div className="flex items-center space-x-2">
                        {conversation.lastMessage && (
                          <span className="text-xs text-gray-500">
                            {getTimeAgo(conversation.lastMessage.timestamp)}
                          </span>
                        )}
                        {conversation.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-500 truncate">
                        {conversation.lastMessage ? (
                          <>
                            {conversation.lastMessage.senderId === user?.id ? "You: " : ""}
                            {conversation.lastMessage.message}
                          </>
                        ) : (
                          `No messages yet`
                        )}
                      </p>
                      <span className="text-xs text-blue-600 uppercase font-medium">STAFF</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Regular Conversations */}
      {filteredUsers.length > 0 && (
        <>
          <div className="px-4 py-2 border-b border-gray-100">
            <div className="flex items-center text-gray-500 text-sm">
              <Pin className="w-4 h-4 mr-2" />
              <span>{currentUserRole === "admin" ? "Master Users" : "Admin Users"}</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredUsers.map((chatUser) => {
              const lastMessage = getUserLastMessage(chatUser.id)
              const unreadCount = getUnreadCount(chatUser.id)
              const isSelected = selectedUserId === chatUser.id

              return (
                <div
                  key={chatUser.id}
                  onClick={() => onSelectUser(chatUser.id)}
                  className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    isSelected ? "bg-blue-50 border-r-2 border-blue-500" : ""
                  }`}
                >
                  <div className="relative">
                    <img
                      src={chatUser.avatar || "/placeholder.svg"}
                      alt={chatUser.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>

                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{chatUser.name}</h3>
                      <div className="flex items-center space-x-2">
                        {lastMessage && (
                          <span className="text-xs text-gray-500">{getTimeAgo(lastMessage.timestamp)}</span>
                        )}
                        {unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-500 truncate">
                        {lastMessage ? (
                          <>
                            {lastMessage.senderId === user?.id ? "You: " : ""}
                            {lastMessage.message}
                          </>
                        ) : (
                          `Start conversation with ${chatUser.name}`
                        )}
                      </p>
                      <span className="text-xs text-gray-400 uppercase">{chatUser.role}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* All Messages Section for Master */}
      {currentUserRole === "master" && (
        <>
          <div className="px-4 py-2 border-b border-gray-100 mt-4">
            <div className="flex items-center text-gray-500 text-sm">
              <span>Monitor</span>
            </div>
          </div>
          <div
            onClick={() => onSelectUser("all")}
            className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
              selectedUserId === "all" ? "bg-blue-50 border-r-2 border-blue-500" : ""
            }`}
          >
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-semibold">ALL</span>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-gray-900">Monitor All Chats</h3>
              <p className="text-sm text-gray-500">View all conversations</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
