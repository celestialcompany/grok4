import { withAuth, createApiResponse, type AuthenticatedRequest } from "@/lib/auth-middleware"
import { db } from "@/lib/firebase"
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore"

interface RouteParams {
  params: Promise<{ chatId: string }>
}

// GET /api/chats/[chatId] - Получить конкретный чат
export const GET = withAuth(async (req: AuthenticatedRequest, { params }: RouteParams) => {
  try {
    const { chatId } = await params
    const chatRef = doc(db, "chats", chatId)
    const chatSnap = await getDoc(chatRef)

    if (!chatSnap.exists()) {
      return createApiResponse(null, "Chat not found", 404)
    }

    const chatData = chatSnap.data()

    // Проверяем, что чат принадлежит пользователю
    if (chatData.userId !== req.user.uid) {
      return createApiResponse(null, "Access denied", 403)
    }

    const chat = {
      id: chatSnap.id,
      ...chatData,
    }

    return createApiResponse(chat)
  } catch (error) {
    console.error("Error fetching chat:", error)
    return createApiResponse(null, "Failed to fetch chat", 500)
  }
})

// PUT /api/chats/[chatId] - Обновить чат
export const PUT = withAuth(async (req: AuthenticatedRequest, { params }: RouteParams) => {
  try {
    const { chatId } = await params
    const updates = await req.json()

    const chatRef = doc(db, "chats", chatId)
    const chatSnap = await getDoc(chatRef)

    if (!chatSnap.exists()) {
      return createApiResponse(null, "Chat not found", 404)
    }

    const chatData = chatSnap.data()

    if (chatData.userId !== req.user.uid) {
      return createApiResponse(null, "Access denied", 403)
    }

    // Разрешенные поля для обновления
    const allowedFields = ["title"]
    const filteredUpdates = Object.keys(updates)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key]
        return obj
      }, {} as any)

    if (Object.keys(filteredUpdates).length === 0) {
      return createApiResponse(null, "No valid fields to update", 400)
    }

    await updateDoc(chatRef, {
      ...filteredUpdates,
      updatedAt: serverTimestamp(),
    })

    const updatedChat = {
      id: chatId,
      ...chatData,
      ...filteredUpdates,
      updatedAt: Date.now(),
    }

    return createApiResponse(updatedChat)
  } catch (error) {
    console.error("Error updating chat:", error)
    return createApiResponse(null, "Failed to update chat", 500)
  }
})

// DELETE /api/chats/[chatId] - Удалить чат
export const DELETE = withAuth(async (req: AuthenticatedRequest, { params }: RouteParams) => {
  try {
    const { chatId } = await params
    const chatRef = doc(db, "chats", chatId)
    const chatSnap = await getDoc(chatRef)

    if (!chatSnap.exists()) {
      return createApiResponse(null, "Chat not found", 404)
    }

    const chatData = chatSnap.data()

    if (chatData.userId !== req.user.uid) {
      return createApiResponse(null, "Access denied", 403)
    }

    await deleteDoc(chatRef)

    return createApiResponse({ message: "Chat deleted successfully" })
  } catch (error) {
    console.error("Error deleting chat:", error)
    return createApiResponse(null, "Failed to delete chat", 500)
  }
})
