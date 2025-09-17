"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/store/userStore"
import { NotificationDropdown } from "./NotificationDropdown"
import { ProfileModal } from "./ProfileModal"
import { Menu, X, MessageCircle, FileText, Users, Settings, LogOut, ChevronDown, User, Plus } from "lucide-react"
import Link from "next/link"

interface NavbarProps {
  showReports?: boolean
  showChat?: boolean
  showUsers?: boolean
  showCreateReport?: boolean
}

export function Navbar({
  showReports = false,
  showChat = false,
  showUsers = false,
  showCreateReport = false,
}: NavbarProps) {
  const { user, logout } = useUserStore()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/login")
    setIsProfileDropdownOpen(false)
    setIsMobileMenuOpen(false)
  }

  const handleProfileClick = () => {
    setIsProfileModalOpen(true)
    setIsProfileDropdownOpen(false)
    setIsMobileMenuOpen(false)
  }

  const handleSettingsClick = () => {
    if (user?.role === "master") {
      router.push("/master/setting")
    } else if (user?.role === "admin") {
      router.push("/admin/setting")
    }
    setIsProfileDropdownOpen(false)
    setIsMobileMenuOpen(false)
  }

  const navigateToReports = () => {
    if (user?.role === "master") {
      router.push("/master/reports")
    } else if (user?.role === "admin") {
      router.push("/admin/reports")
    }
    setIsMobileMenuOpen(false)
  }

  const navigateToChat = () => {
    if (user?.role === "master") {
      router.push("/master/chat")
    } else if (user?.role === "admin") {
      router.push("/admin/chat")
    } else if (user?.role === "staff") {
      router.push("/staff/chat")
    }
    setIsMobileMenuOpen(false)
  }

  const navigateToUsers = () => {
    if (user?.role === "master") {
      router.push("/master/users")
    } else if (user?.role === "admin") {
      router.push("/admin/users")
    }
    setIsMobileMenuOpen(false)
  }

  const navigateToDashboard = () => {
    if (user?.role === "master") {
      router.push("/master/dashboard")
    } else if (user?.role === "admin") {
      router.push("/admin/dashboard")
    } else if (user?.role === "staff") {
      router.push("/staff/dashboard")
    }
    setIsMobileMenuOpen(false)
  }

  const navigateToCreateReport = () => {
    if (user?.role === "staff") {
      router.push("/staff/create-report")
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                  <img src="/amanda.png" alt="logoamanda" />
                </div>
                <img src="/text.png" className="w-80 h-6" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {showReports && (
                <button
                  onClick={navigateToReports}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  <span>Laporan</span>
                </button>
              )}

              {showCreateReport && user?.role === "staff" && (
                <button
                  onClick={navigateToCreateReport}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Buat Laporan</span>
                </button>
              )}

              {showChat && (
                <button
                  onClick={navigateToChat}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Chat</span>
                </button>
              )}

              {showUsers && (
                <button
                  onClick={navigateToUsers}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Users className="w-5 h-5" />
                  <span>Kelola User</span>
                </button>
              )}

              <NotificationDropdown />

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center">
                    {user?.avatar ? (
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-sm font-medium">{user?.name?.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <span className="font-medium">{user?.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <button
                      onClick={handleProfileClick}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </button>

                    {(user?.role === "master" || user?.role === "admin") && (
                      <button
                        onClick={handleSettingsClick}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </button>
                    )}

                    <hr className="my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-2">
              {showReports && (
                <button
                  onClick={navigateToReports}
                  className="w-full text-left flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <FileText className="w-5 h-5" />
                  <span>Laporan</span>
                </button>
              )}

              {showCreateReport && user?.role === "staff" && (
                <button
                  onClick={navigateToCreateReport}
                  className="w-full text-left flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <Plus className="w-5 h-5" />
                  <span>Buat Laporan</span>
                </button>
              )}

              {showChat && (
                <button
                  onClick={navigateToChat}
                  className="w-full text-left flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Chat</span>
                </button>
              )}

              {showUsers && (
                <button
                  onClick={navigateToUsers}
                  className="w-full text-left flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <Users className="w-5 h-5" />
                  <span>Kelola User</span>
                </button>
              )}

              <div className="border-t border-gray-200 pt-2">
                <button
                  onClick={handleProfileClick}
                  className="w-full text-left flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </button>

                {(user?.role === "master" || user?.role === "admin") && (
                  <button
                    onClick={handleSettingsClick}
                    className="w-full text-left flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </>
  )
}
