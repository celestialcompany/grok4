import { withAuth, createApiResponse, type AuthenticatedRequest } from "@/lib/auth-middleware"
import { db } from "@/lib/firebase"
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
  increment,
} from "firebase/firestore"

interface RouteParams {
  params: Promise<{ chatId: string }>
}

// GET /api/chats/[chatId]/messages - Получить сообщения чата
export const GET = withAuth(async (req: AuthenticatedRequest, { params }: RouteParams) => {
  try {
    const { chatId } = await params
    const url = new URL(req.url)
    const limitParam = Number.parseInt(url.searchParams.get("limit") || "50")
    const offset = Number.parseInt(url.searchParams.get("offset") || "0")

    // Проверяем доступ к чату
    const chatRef = doc(db, "chats", chatId)
    const chatSnap = await getDoc(chatRef)

    if (!chatSnap.exists()) {
      return createApiResponse(null, "Chat not found", 404)
    }

    const chatData = chatSnap.data()
    if (chatData.userId !== req.user.uid) {
      return createApiResponse(null, "Access denied", 403)
    }

    // Получаем сообщения
    const messagesRef = collection(db, "messages")
    const q = query(messagesRef, where("chatId", "==", chatId), orderBy("timestamp", "desc"), limit(limitParam))

    const snapshot = await getDocs(q)
    const messages = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .reverse() // Возвращаем в хронологическом порядке

    return createApiResponse(messages)
  } catch (error) {
    console.error("Error fetching messages:", error)
    return createApiResponse(null, "Failed to fetch messages", 500)
  }
})

// POST /api/chats/[chatId]/messages - Создать новое сообщение
export const POST = withAuth(async (req: AuthenticatedRequest, { params }: RouteParams) => {
  try {
    const { chatId } = await params
    const { content, role } = await req.json()

    if (!content || typeof content !== "string") {
      return createApiResponse(null, "Content is required", 400)
    }

    if (!role || !["user", "assistant"].includes(role)) {
      return createApiResponse(null, "Valid role is required", 400)
    }

    // Проверяем доступ к чату
    const chatRef = doc(db, "chats", chatId)
    const chatSnap = await getDoc(chatRef)

    if (!chatSnap.exists()) {
      return createApiResponse(null, "Chat not found", 404)
    }

    const chatData = chatSnap.data()
    if (chatData.userId !== req.user.uid) {
      return createApiResponse(null, "Access denied", 403)
    }

    // Создаем сообщение
    const messageData = {
      content: content.trim(),
      role,
      chatId,
      userId: req.user.uid,
      timestamp: serverTimestamp(),
    }

    const docRef = await addDoc(collection(db, "messages"), messageData)

    // Обновляем счетчик сообщений в чате
    await updateDoc(chatRef, {
      messageCount: increment(1),
      lastMessage: content.trim().substring(0, 100),
      updatedAt: serverTimestamp(),
    })

    const newMessage = {
      id: docRef.id,
      ...messageData,
      timestamp: Date.now(),
    }

    return createApiResponse(newMessage, undefined, 201)
  } catch (error) {
    console.error("Error creating message:", error)
    return createApiResponse(null, "Failed to create message", 500)
  }
})
