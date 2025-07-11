import { type NextRequest, NextResponse } from "next/server"
import { getAuth } from "firebase-admin/auth"
import { initializeApp, getApps, cert } from "firebase-admin/app"

// Инициализация Firebase Admin (только на сервере)
if (!getApps().length) {
  try {
    initializeApp({
      credential: cert({
        projectId: "device-streaming-f1ff16f2",
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    })
  } catch (error) {
    console.error("Firebase Admin initialization error:", error)
  }
}

export interface AuthenticatedRequest extends NextRequest {
  user: {
    uid: string
    email: string
    displayName?: string
  }
}

export async function withAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    try {
      const authHeader = req.headers.get("authorization")

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized: Missing or invalid token" }, { status: 401 })
      }

      const token = authHeader.split("Bearer ")[1]

      // Проверяем наличие Firebase Admin
      if (!getApps().length) {
        console.error("Firebase Admin not initialized")
        return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
      }

      const decodedToken = await getAuth().verifyIdToken(token)

      // Добавляем пользователя к запросу
      const authenticatedReq = req as AuthenticatedRequest
      authenticatedReq.user = {
        uid: decodedToken.uid,
        email: decodedToken.email || "",
        displayName: decodedToken.name,
      }

      return handler(authenticatedReq)
    } catch (error) {
      console.error("Auth middleware error:", error)
      return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 })
    }
  }
}

export function createApiResponse<T>(data?: T, error?: string, status = 200): NextResponse {
  if (error) {
    return NextResponse.json({ success: false, error }, { status: status >= 400 ? status : 400 })
  }

  return NextResponse.json({ success: true, data }, { status })
}
