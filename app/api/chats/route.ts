import { withAuth, createApiResponse, type AuthenticatedRequest } from "@/lib/auth-middleware"
import { db } from "@/lib/firebase"
import { collection, query, where, orderBy, getDocs, addDoc, serverTimestamp } from "firebase/firestore"

// GET /api/chats - Получить все чаты пользователя
export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const chatsRef = collection(db, "chats")
    const q = query(chatsRef, where("userId", "==", req.user.uid), orderBy("updatedAt", "desc"))

    const snapshot = await getDocs(q)
    const chats = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return createApiResponse(chats)
  } catch (error) {
    console.error("Error fetching chats:", error)
    return createApiResponse(null, "Failed to fetch chats", 500)
  }
})

// POST /api/chats - Создать новый чат
export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const { title } = await req.json()

    if (!title || typeof title !== "string") {
      return createApiResponse(null, "Title is required", 400)
    }

    const chatData = {
      title: title.trim(),
      userId: req.user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      messageCount: 0,
    }

    const docRef = await addDoc(collection(db, "chats"), chatData)

    const newChat = {
      id: docRef.id,
      ...chatData,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    return createApiResponse(newChat, undefined, 201)
  } catch (error) {
    console.error("Error creating chat:", error)
    return createApiResponse(null, "Failed to create chat", 500)
  }
})
