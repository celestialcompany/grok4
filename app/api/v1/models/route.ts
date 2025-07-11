import { withApiAuth, createApiResponse, type AuthenticatedApiRequest } from "@/lib/api-gateway-middleware"

// GET /api/v1/models - List available models
export const GET = withApiAuth(async (req: AuthenticatedApiRequest) => {
  try {
    const models = [
      {
        id: "grok-4-0709",
        object: "model",
        created: 1720483200, // July 9, 2025
        owned_by: "xai",
        permission: [],
        root: "grok-4-0709",
        parent: null,
        description:
          "Grok 4 - The latest and most advanced model from xAI with enhanced reasoning and real-time capabilities",
        context_length: 131072,
        capabilities: ["text", "reasoning", "real-time", "thinking"],
        version: "4.0",
        release_date: "2025-07-09",
      },
      {
        id: "grok-vision-beta",
        object: "model",
        created: 1699200000,
        owned_by: "xai",
        permission: [],
        root: "grok-vision-beta",
        parent: null,
        description: "Grok with vision capabilities for image understanding and analysis",
        context_length: 131072,
        capabilities: ["text", "vision", "reasoning", "real-time"],
        version: "beta",
      },
    ]

    const response = {
      object: "list",
      data: models,
    }

    return createApiResponse(response)
  } catch (error) {
    console.error("Models list error:", error)
    return createApiResponse(null, "Failed to fetch models", 500)
  }
})
