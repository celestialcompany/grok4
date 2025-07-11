import { withAuth, createApiResponse, type AuthenticatedRequest } from "@/lib/auth-middleware"
import { db } from "@/lib/firebase"
import { collection, query, where, orderBy, getDocs } from "firebase/firestore"

// GET /api/files - Получить файлы пользователя
export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const filesRef = collection(db, "files")
    const q = query(filesRef, where("userId", "==", req.user.uid), orderBy("uploadedAt", "desc"))

    const snapshot = await getDocs(q)
    const files = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return createApiResponse(files)
  } catch (error) {
    console.error("Error fetching files:", error)
    return createApiResponse(null, "Failed to fetch files", 500)
  }
})
