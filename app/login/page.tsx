"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/store/userStore"
import { Eye, EyeOff, Info, ChevronDown, ChevronUp } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showDemo, setShowDemo] = useState(false)
  const { login, isAuthenticated, user } = useUserStore()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && user) {
      switch (user.role) {
        case "master":
          router.push("/master/dashboard")
          break
        case "admin":
          router.push("/admin/dashboard")
          break
        case "staff":
          router.push("/staff/dashboard")
          break
      }
    }
  }, [isAuthenticated, user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const success = login(email, password)
      if (!success) {
        setError("Email atau password salah")
      }
    } catch (err) {
      setError("Terjadi kesalahan saat login")
    } finally {
      setIsLoading(false)
    }
  }

  const demoCredentials = [
    { role: "Master", email: "master@helpdesk.com", password: "password123" },
    { role: "Admin", email: "admin@helpdesk.com", password: "password123" },
    { role: "Staff", email: "staff@helpdesk.com", password: "password123" },
  ]

  const fillDemo = (email: string, password: string) => {
    setEmail(email)
    setPassword(password)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(to top right, #01303F, #027EA5)" }}
    >
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>

      {/* Demo Credentials Panel */}
      <div className="absolute top-4 right-4 z-20">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 max-w-xs">
          <button
            onClick={() => setShowDemo(!showDemo)}
            className="flex items-center justify-between w-full text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            <div className="flex items-center space-x-2">
              <Info className="w-4 h-4" />
              <span>Demo Credentials</span>
            </div>
            {showDemo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showDemo && (
            <div className="mt-3 space-y-2">
              {demoCredentials.map((cred) => (
                <button
                  key={cred.role}
                  onClick={() => fillDemo(cred.email, cred.password)}
                  className="w-full text-left p-2 rounded bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="text-xs font-medium text-gray-900">{cred.role}</div>
                  <div className="text-xs text-gray-600">{cred.email}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-2xl shadow-2xl p-8 bg-[#33788D]">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 italic">E-Helpdesk</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Username
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-0 rounded-lg bg-gray-200 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white focus:outline-none transition-all"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border-0 rounded-lg bg-gray-200 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white focus:outline-none transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-gray-900 focus:ring-2 focus:ring-white focus:ring-offset-2 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Memproses..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
