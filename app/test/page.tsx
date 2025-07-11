"use client"

import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, type User } from "firebase/auth"
import AuthForm from "@/components/auth-form"
import ApiTest from "@/components/api-test"
import { Loader2 } from "lucide-react"

export default function TestPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#212121] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  return (
    <div className="min-h-screen bg-[#212121] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">🧪 API Testing Dashboard</h1>
          <p className="text-gray-400">Тестирование API системы Grok 4 Chat</p>
        </div>

        <ApiTest />

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">Пользователь: {user.displayName || user.email}</p>
        </div>
      </div>
    </div>
  )
}
