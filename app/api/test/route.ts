import { withAuth, createApiResponse, type AuthenticatedRequest } from "@/lib/auth-middleware"

// GET /api/test - Тестовый endpoint для проверки API
export async function GET() {
  try {
    return createApiResponse({
      message: "API работает!",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    })
  } catch (error) {
    return createApiResponse(null, "Test endpoint error", 500)
  }
}

// POST /api/test - Тестовый защищенный endpoint
export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const body = await req.json()

    return createApiResponse({
      message: "Защищенный endpoint работает!",
      user: req.user,
      receivedData: body,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return createApiResponse(null, "Protected test endpoint error", 500)
  }
})
