import { withAuth, createApiResponse, type AuthenticatedRequest } from "@/lib/auth-middleware"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore"

// GET /api/analytics/usage - Получить статистику использования
export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    // Получаем статистику чатов
    const chatsRef = collection(db, "chats")
    const chatsQuery = query(chatsRef, where("userId", "==", req.user.uid))
    const chatsSnapshot = await getDocs(chatsQuery)
    const totalChats = chatsSnapshot.size

    // Получаем статистику сообщений
    const messagesRef = collection(db, "messages")
    const messagesQuery = query(messagesRef, where("userId", "==", req.user.uid))
    const messagesSnapshot = await getDocs(messagesQuery)
    const totalMessages = messagesSnapshot.size

    // Последние чаты
    const recentChatsQuery = query(
      chatsRef,
      where("userId", "==", req.user.uid),
      orderBy("updatedAt", "desc"),
      limit(5),
    )
    const recentChatsSnapshot = await getDocs(recentChatsQuery)
    const recentChats = recentChatsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    const stats = {
      totalChats,
      totalMessages,
      recentChats,
      averageMessagesPerChat: totalChats > 0 ? Math.round(totalMessages / totalChats) : 0,
    }

    return createApiResponse(stats)
  } catch (error) {
    console.error("Error fetching usage stats:", error)
    return createApiResponse(null, "Failed to fetch usage stats", 500)
  }
})
