"use client"

import { MessageCircle } from "lucide-react"
import Link from "next/link"

interface ChatButtonProps {
  href: string
  tooltip?: string
}

export function ChatButton({ href, tooltip = "Chat" }: ChatButtonProps) {
  return (
    <Link
      href={href}
      className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-50 group"
      title={tooltip}
    >
      <MessageCircle className="w-6 h-6" />
      <span className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        {tooltip}
      </span>
    </Link>
  )
}
