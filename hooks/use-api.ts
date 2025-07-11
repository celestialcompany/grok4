"use client"

import { useEffect } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebase"
import { apiClient } from "@/lib/api-client"

export function useApi() {
  const [user, loading, error] = useAuthState(auth)

  useEffect(() => {
    if (user) {
      apiClient.setUser(user)
    }
  }, [user])

  return {
    ...apiClient,
    user,
    loading,
    error,
    isAuthenticated: !!user,
  }
}
