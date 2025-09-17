"use client"

import { useEffect, useState } from "react"
import { useUserStore } from "@/store/userStore"
import { Lock, Clock, User } from "lucide-react"

interface ReportLockIndicatorProps {
  reportId: string
  className?: string
}

export function ReportLockIndicator({ reportId, className = "" }: ReportLockIndicatorProps) {
  const { isReportLocked, getReportLockInfo, getAllUsers, user } = useUserStore()
  const [lockInfo, setLockInfo] = useState<{ lockedBy: string; lockedAt: string } | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<string>("")

  useEffect(() => {
    const checkLockStatus = () => {
      if (isReportLocked(reportId)) {
        const info = getReportLockInfo(reportId)
        setLockInfo(info)

        if (info) {
          const lockTime = new Date(info.lockedAt).getTime()
          const now = new Date().getTime()
          const thirtyMinutes = 30 * 60 * 1000
          const remaining = thirtyMinutes - (now - lockTime)

          if (remaining > 0) {
            const minutes = Math.floor(remaining / 60000)
            const seconds = Math.floor((remaining % 60000) / 1000)
            setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, "0")}`)
          } else {
            setTimeRemaining("0:00")
          }
        }
      } else {
        setLockInfo(null)
        setTimeRemaining("")
      }
    }

    checkLockStatus()
    const interval = setInterval(checkLockStatus, 1000)

    return () => clearInterval(interval)
  }, [reportId, isReportLocked, getReportLockInfo])

  if (!lockInfo) return null

  const lockedUser = getAllUsers().find((u) => u.id === lockInfo.lockedBy)
  const isLockedByCurrentUser = user?.id === lockInfo.lockedBy

  return (
    <div
      className={`flex items-center space-x-2 p-3 rounded-lg border ${
        isLockedByCurrentUser
          ? "bg-blue-50 border-blue-200 text-blue-800"
          : "bg-yellow-50 border-yellow-200 text-yellow-800"
      } ${className}`}
    >
      <Lock className="w-4 h-4" />
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4" />
          <span className="font-medium">
            {isLockedByCurrentUser ? "Anda" : lockedUser?.name || "User Tidak Dikenal"}
          </span>
          <span className="text-sm">
            {isLockedByCurrentUser ? "sedang mengedit laporan ini" : "sedang mengedit laporan ini"}
          </span>
        </div>
        {timeRemaining && (
          <div className="flex items-center space-x-1 mt-1 text-sm">
            <Clock className="w-3 h-3" />
            <span>Otomatis terbuka dalam: {timeRemaining}</span>
          </div>
        )}
      </div>
    </div>
  )
}
