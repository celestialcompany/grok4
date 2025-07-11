import { put } from "@vercel/blob"
import { withAuth, createApiResponse, type AuthenticatedRequest } from "@/lib/auth-middleware"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

// POST /api/upload - Загрузить файл
export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return createApiResponse(null, "No file provided", 400)
    }

    // Проверка размера файла (максимум 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return createApiResponse(null, "File too large (max 10MB)", 400)
    }

    // Проверка типа файла
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]

    if (!allowedTypes.includes(file.type)) {
      return createApiResponse(null, "File type not allowed", 400)
    }

    // Загрузка в Vercel Blob
    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
    })

    // Сохраняем информацию о файле в Firestore
    const fileData = {
      name: file.name,
      url: blob.url,
      type: file.type,
      size: file.size,
      userId: req.user.uid,
      uploadedAt: serverTimestamp(),
    }

    const docRef = await addDoc(collection(db, "files"), fileData)

    const uploadedFile = {
      id: docRef.id,
      ...fileData,
      uploadedAt: Date.now(),
    }

    return createApiResponse(uploadedFile, undefined, 201)
  } catch (error) {
    console.error("Upload error:", error)
    return createApiResponse(null, "Upload failed", 500)
  }
})
