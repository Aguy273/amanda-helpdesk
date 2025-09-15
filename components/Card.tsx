"use client"

import type React from "react"
import type { LucideIcon } from "lucide-react"

interface CardProps {
  title: string
  value: string | number
  icon: LucideIcon
  borderColor: "blue" | "green" | "red" | "yellow" | "purple"
  onClick?: () => void
  children?: React.ReactNode
}

export function Card({ title, value, icon: Icon, borderColor, onClick, children }: CardProps) {
  const getBorderColorClass = (color: string) => {
    switch (color) {
      case "blue":
        return "border-l-blue-500 bg-blue-50"
      case "green":
        return "border-l-green-500 bg-green-50"
      case "red":
        return "border-l-red-500 bg-red-50"
      case "yellow":
        return "border-l-yellow-500 bg-yellow-50"
      case "purple":
        return "border-l-purple-500 bg-purple-50"
      default:
        return "border-l-gray-500 bg-gray-50"
    }
  }

  const getIconColorClass = (color: string) => {
    switch (color) {
      case "blue":
        return "text-blue-600"
      case "green":
        return "text-green-600"
      case "red":
        return "text-red-600"
      case "yellow":
        return "text-yellow-600"
      case "purple":
        return "text-purple-600"
      default:
        return "text-gray-600"
    }
  }

  const cardContent = (
    <div
      className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${getBorderColorClass(borderColor)} ${
        onClick ? "cursor-pointer hover:shadow-lg transition-shadow duration-200" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
          <div className="text-2xl font-bold text-gray-900">
            {typeof value === "string" && value === "Create" ? (
              <span className="text-lg">Klik untuk membuat</span>
            ) : (
              value
            )}
          </div>
          {children}
        </div>
        <div className={`p-3 rounded-full ${getBorderColorClass(borderColor)}`}>
          <Icon className={`w-6 h-6 ${getIconColorClass(borderColor)}`} />
        </div>
      </div>
    </div>
  )

  if (onClick) {
    return (
      <button onClick={onClick} className="w-full text-left">
        {cardContent}
      </button>
    )
  }

  return cardContent
}
