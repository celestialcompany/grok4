import { streamText } from "ai"
import { xai } from "@ai-sdk/xai"
import { withApiAuth, createApiResponse, type AuthenticatedApiRequest } from "@/lib/api-gateway-middleware"

// POST /api/v1/chat/completions - OpenAI-compatible chat completions
export const POST = withApiAuth(async (req: AuthenticatedApiRequest) => {
  try {
    const { messages, model = "grok-4-0709", temperature = 0.7, max_tokens = 4000, stream = false } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return createApiResponse(null, "Messages array is required", 400)
    }

    // Валидация модели
    const validModels = ["grok-4-0709", "grok-vision-beta"]
    const selectedModel = validModels.includes(model) ? model : "grok-4-0709"

    // Добавляем системный промпт с поддержкой thinking
    const systemMessage = {
      role: "system",
      content: `You are Grok 4, an advanced AI assistant created by xAI. You are curious, witty, and have a bit of rebellious streak.
      
      When you need to think through complex problems, use thinking blocks:
      \`\`\`thinking
      Here I analyze the problem step by step...
      Consider different approaches...
      Evaluate the best solution...
      \`\`\`
      
      After thinking, provide a clear, helpful, and slightly witty response.
      Be honest if you don't know something. You have access to real-time information and can provide current data.`,
    }

    const allMessages = [systemMessage, ...messages]

    // Логируем использование
    await req.logUsage({
      endpoint: "/chat/completions",
      model: selectedModel,
      inputTokens: JSON.stringify(allMessages).length / 4, // Приблизительная оценка
    })

    if (stream) {
      const result = await streamText({
        model: xai(selectedModel),
        messages: allMessages,
        temperature,
        maxTokens: max_tokens,
      })

      // Преобразуем в OpenAI-совместимый стрим
      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        async start(controller) {
          const reader = result.textStream.getReader()
          const id = `chatcmpl-${Date.now()}`

          try {
            while (true) {
              const { done, value } = await reader.read()

              if (done) {
                const finalChunk = {
                  id,
                  object: "chat.completion.chunk",
                  created: Math.floor(Date.now() / 1000),
                  model: selectedModel,
                  choices: [
                    {
                      index: 0,
                      delta: {},
                      finish_reason: "stop",
                    },
                  ],
                }
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(finalChunk)}\n\n`))
                controller.enqueue(encoder.encode("data: [DONE]\n\n"))
                break
              }

              const chunk = {
                id,
                object: "chat.completion.chunk",
                created: Math.floor(Date.now() / 1000),
                model: selectedModel,
                choices: [
                  {
                    index: 0,
                    delta: { content: value },
                    finish_reason: null,
                  },
                ],
              }

              controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`))
            }
          } catch (error) {
            controller.error(error)
          } finally {
            controller.close()
          }
        },
      })

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      })
    } else {
      const result = await streamText({
        model: xai(selectedModel),
        messages: allMessages,
        temperature,
        maxTokens: max_tokens,
      })

      const fullText = await result.text
      const outputTokens = fullText.length / 4 // Приблизительная оценка

      // Логируем выходные токены
      await req.logUsage({
        outputTokens,
      })

      const response = {
        id: `chatcmpl-${Date.now()}`,
        object: "chat.completion",
        created: Math.floor(Date.now() / 1000),
        model: selectedModel,
        choices: [
          {
            index: 0,
            message: {
              role: "assistant",
              content: fullText,
            },
            finish_reason: "stop",
          },
        ],
        usage: {
          prompt_tokens: Math.ceil(JSON.stringify(allMessages).length / 4),
          completion_tokens: Math.ceil(outputTokens),
          total_tokens: Math.ceil(JSON.stringify(allMessages).length / 4 + outputTokens),
        },
      }

      return createApiResponse(response)
    }
  } catch (error) {
    console.error("Chat completion error:", error)
    return createApiResponse(null, "Failed to generate completion", 500)
  }
})
