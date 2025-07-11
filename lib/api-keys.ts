import { db } from "@/lib/firebase"
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore"

export interface ApiKey {
  id: string
  name: string
  key: string
  userId: string
  isActive: boolean
  createdAt: number
  lastUsedAt?: number
  permissions: string[]
  limits: {
    requestsPerMinute: number
    requestsPerMonth: number
    tokensPerMonth: number
  }
  usage: {
    requestsThisMinute: number
    requestsThisMonth: number
    tokensThisMonth: number
    lastResetMinute: number
    lastResetMonth: number
  }
}

export async function generateApiKey(): Promise<string> {
  const prefix = "grok_"
  const randomBytes = new Uint8Array(32)
  crypto.getRandomValues(randomBytes)
  const key = Array.from(randomBytes, (byte) => byte.toString(16).padStart(2, "0")).join("")
  return prefix + key
}

export async function createApiKey(userId: string, name: string): Promise<ApiKey> {
  const key = await generateApiKey()

  const apiKeyData = {
    name: name.trim(),
    key,
    userId,
    isActive: true,
    createdAt: serverTimestamp(),
    permissions: ["chat.completions", "models.list"],
    limits: {
      requestsPerMinute: 60,
      requestsPerMonth: 10000,
      tokensPerMonth: 1000000,
    },
    usage: {
      requestsThisMinute: 0,
      requestsThisMonth: 0,
      tokensThisMonth: 0,
      lastResetMinute: 0,
      lastResetMonth: 0,
    },
  }

  const docRef = await addDoc(collection(db, "apiKeys"), apiKeyData)

  return {
    id: docRef.id,
    ...apiKeyData,
    createdAt: Date.now(),
  } as ApiKey
}

export async function getUserApiKeys(userId: string): Promise<ApiKey[]> {
  const q = query(collection(db, "apiKeys"), where("userId", "==", userId))
  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ApiKey[]
}

export async function updateApiKey(keyId: string, updates: Partial<ApiKey>): Promise<void> {
  const keyRef = doc(db, "apiKeys", keyId)
  await updateDoc(keyRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteApiKey(keyId: string): Promise<void> {
  const keyRef = doc(db, "apiKeys", keyId)
  await deleteDoc(keyRef)
}

export async function toggleApiKey(keyId: string, isActive: boolean): Promise<void> {
  await updateApiKey(keyId, { isActive })
}
