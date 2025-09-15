"use client"

import { useState } from "react"
import { ChatSidebar } from "./ChatSidebar"
import { ChatArea } from "./ChatArea"

interface ChatWindowProps {
  currentUserRole: "admin" | "master"
}

export function ChatWindow({ currentUserRole }: ChatWindowProps) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-lg overflow-hidden">
      <ChatSidebar selectedUserId={selectedUserId} onSelectUser={setSelectedUserId} currentUserRole={currentUserRole} />
      <ChatArea selectedUserId={selectedUserId} currentUserRole={currentUserRole} />
    </div>
  )
}
