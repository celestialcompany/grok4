"use client"

import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, type User } from "firebase/auth"
import AuthForm from "@/components/auth-form"
import GrokChat from "@/components/grok-chat"
import { Loader2 } from "lucide-react"

export default function HomePage() {
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

  return <GrokChat user={user} />
}
