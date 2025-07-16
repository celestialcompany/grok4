import { streamText } from "ai"
import { xai } from "@ai-sdk/xai"
import type { CoreMessage, ImagePart, TextPart } from "ai" // Import types from ai
import { ReadableStream } from "stream/web" // Import ReadableStream for compatibility

export async function POST(req: Request) {
  try {
    const { messages, language, stream, allMessages } = await req.json()

    const systemPrompts = {
      ru: `Ты Grok 4 - умный и дружелюбный AI-ассистент от xAI.
    Отвечай на русском языке, если пользователь пишет на русском.
    Будь полезным, информативным и немного остроумным в своих ответах.
    Если не знаешь ответа на вопрос, честно скажи об этом.
    
    Когда тебе нужно подумать над сложным вопросом, используй блок размышлений:
    \`\`\`thinking
    Здесь я размышляю над вопросом...
    Анализирую различные аспекты...
    Прихожу к выводу...
    \`\`\`
    
    После размышлений дай четкий и полезный ответ.`,
      en: `You are Grok 4 - a smart and friendly AI assistant from xAI.
    Respond in English when the user writes in English.
    Be helpful, informative, and slightly witty in your responses.
    If you don't know the answer to a question, say so honestly.
    
    When you need to think through a complex question, use a thinking block:
    \`\`\`thinking
    Here I'm thinking about the question...
    Analyzing different aspects...
    Coming to a conclusion...
    \`\`\`
    
    After thinking, provide a clear and helpful answer.`,
    }

    // Всегда используем grok-4-0709, так как она мультимодальна
    const selectedModel = "grok-4-0709" as const

    const processedMessages: CoreMessage[] = messages.map((msg: any) => {
      if (Array.isArray(msg.content)) {
        // Если контент является массивом, это мультимодальное сообщение
        return {
          role: msg.role,
          content: msg.content.map((part: any) => {
            if (part.type === "image" && part.image) {
              // AI SDK ожидает данные base64 без префикса data:image/...;base64,
              const base64Data = part.image.split(",")[1] || part.image
              return { type: "image", image: base64Data } as ImagePart
            }
            return { type: "text", text: part.text } as TextPart
          }),
        }
      }
      return { role: msg.role, content: msg.content } as CoreMessage
    })

    const primaryXaiApiKey = process.env.XAI_API_KEY
    const fallbackXaiApiKey = process.env.XAI_FALLBACK_API_KEY // Ensure this environment variable is set

    let result
    let usedApiKey = "primary" // To track which key was used

    try {
      // Try with primary API key
      const primaryXaiInstance = xai({ apiKey: primaryXaiApiKey })
      result = await streamText({
        model: primaryXaiInstance(selectedModel),
        messages: processedMessages,
        system: systemPrompts[language as keyof typeof systemPrompts] || systemPrompts.en,
        maxTokens: 2000,
        temperature: 0.7,
      })
    } catch (primaryError) {
      console.warn("Primary xAI API key failed, attempting fallback:", primaryError)
      if (!fallbackXaiApiKey) {
        throw primaryError // No fallback key, rethrow primary error
      }
      // Try with fallback API key
      const fallbackXaiInstance = xai({ apiKey: fallbackXaiApiKey })
      result = await streamText({
        model: fallbackXaiInstance(selectedModel),
        messages: processedMessages,
        system: systemPrompts[language as keyof typeof systemPrompts] || systemPrompts.en,
        maxTokens: 2000,
        temperature: 0.7,
      })
      usedApiKey = "fallback"
    }

    console.log(`Successfully used ${usedApiKey} xAI API key.`)

    if (stream) {
      // ... (existing stream logic)
      // Ensure `result` is used here, not `streamText` directly
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
      const fullText = await result.text
      const outputTokens = fullText.length / 4 // Approximate estimate

      // Log output tokens (if you have a logUsage function, ensure it's called here)
      // If req.logUsage is available from a middleware, you might call it here.
      // For this specific file, it's not directly available unless passed.
      // Assuming this is a direct API route, you might need to implement logging separately or ensure it's handled upstream.

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

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    }
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response(JSON.stringify({ error: "Failed to process request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
