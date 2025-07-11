import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { doc, getDoc, updateDoc, increment, serverTimestamp, addDoc, collection } from "firebase/firestore"

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

export interface AuthenticatedApiRequest extends NextRequest {
  apiKey: ApiKey
  logUsage: (data: {
    endpoint?: string
    model?: string
    inputTokens?: number
    outputTokens?: number
  }) => Promise<void>
}

export async function withApiAuth(handler: (req: AuthenticatedApiRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    try {
      const authHeader = req.headers.get("authorization")

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return createApiResponse(null, "Missing or invalid API key", 401, "MISSING_API_KEY")
      }

      const apiKeyValue = authHeader.split("Bearer ")[1]

      if (!apiKeyValue.startsWith("grok_")) {
        return createApiResponse(null, "Invalid API key format", 401, "INVALID_API_KEY")
      }

      // Найти API ключ в базе данных
      const apiKeyRef = doc(db, "apiKeys", apiKeyValue)
      const apiKeySnap = await getDoc(apiKeyRef)

      if (!apiKeySnap.exists()) {
        return createApiResponse(null, "Invalid API key", 401, "INVALID_API_KEY")
      }

      const apiKey = { id: apiKeySnap.id, ...apiKeySnap.data() } as ApiKey

      if (!apiKey.isActive) {
        return createApiResponse(null, "API key is inactive", 401, "INACTIVE_API_KEY")
      }

      // Проверить rate limits
      const now = Date.now()
      const currentMinute = Math.floor(now / 60000)
      const currentMonth = new Date().getMonth() + new Date().getFullYear() * 12

      // Сброс счетчиков если нужно
      if (apiKey.usage.lastResetMinute !== currentMinute) {
        apiKey.usage.requestsThisMinute = 0
        apiKey.usage.lastResetMinute = currentMinute
      }

      if (apiKey.usage.lastResetMonth !== currentMonth) {
        apiKey.usage.requestsThisMonth = 0
        apiKey.usage.tokensThisMonth = 0
        apiKey.usage.lastResetMonth = currentMonth
      }

      // Проверить лимиты
      if (apiKey.usage.requestsThisMinute >= apiKey.limits.requestsPerMinute) {
        return createApiResponse(null, "Rate limit exceeded", 429, "RATE_LIMIT_EXCEEDED")
      }

      if (apiKey.usage.requestsThisMonth >= apiKey.limits.requestsPerMonth) {
        return createApiResponse(null, "Monthly request limit exceeded", 429, "RATE_LIMIT_EXCEEDED")
      }

      // Обновить счетчики
      await updateDoc(apiKeyRef, {
        "usage.requestsThisMinute": increment(1),
        "usage.requestsThisMonth": increment(1),
        "usage.lastResetMinute": currentMinute,
        "usage.lastResetMonth": currentMonth,
        lastUsedAt: serverTimestamp(),
      })

      // Функция для логирования использования
      const logUsage = async (data: {
        endpoint?: string
        model?: string
        inputTokens?: number
        outputTokens?: number
      }) => {
        try {
          // Обновить токены если указаны
          if (data.outputTokens) {
            await updateDoc(apiKeyRef, {
              "usage.tokensThisMonth": increment(data.outputTokens),
            })
          }

          // Логировать детальное использование
          await addDoc(collection(db, "apiUsage"), {
            apiKeyId: apiKey.id,
            userId: apiKey.userId,
            endpoint: data.endpoint || req.nextUrl.pathname,
            model: data.model,
            inputTokens: data.inputTokens || 0,
            outputTokens: data.outputTokens || 0,
            timestamp: serverTimestamp(),
            ip: req.ip || req.headers.get("x-forwarded-for"),
            userAgent: req.headers.get("user-agent"),
          })
        } catch (error) {
          console.error("Failed to log usage:", error)
        }
      }

      // Добавить данные к запросу
      const authenticatedReq = req as AuthenticatedApiRequest
      authenticatedReq.apiKey = apiKey
      authenticatedReq.logUsage = logUsage

      const response = await handler(authenticatedReq)

      // Добавить rate limit заголовки
      response.headers.set("X-RateLimit-Limit-Requests", apiKey.limits.requestsPerMinute.toString())
      response.headers.set(
        "X-RateLimit-Remaining-Requests",
        (apiKey.limits.requestsPerMinute - apiKey.usage.requestsThisMinute - 1).toString(),
      )
      response.headers.set("X-RateLimit-Reset-Requests", ((currentMinute + 1) * 60).toString())
      response.headers.set("X-RateLimit-Limit-Tokens", apiKey.limits.tokensPerMonth.toString())
      response.headers.set(
        "X-RateLimit-Remaining-Tokens",
        (apiKey.limits.tokensPerMonth - apiKey.usage.tokensThisMonth).toString(),
      )

      return response
    } catch (error) {
      console.error("API auth middleware error:", error)
      return createApiResponse(null, "Internal server error", 500, "INTERNAL_ERROR")
    }
  }
}

export function createApiResponse<T>(data?: T, error?: string, status = 200, code?: string): NextResponse {
  if (error) {
    return NextResponse.json(
      {
        error: {
          message: error,
          type: status >= 500 ? "server_error" : status === 429 ? "rate_limit_error" : "api_error",
          code,
        },
      },
      { status },
    )
  }

  return NextResponse.json(data, { status })
}
