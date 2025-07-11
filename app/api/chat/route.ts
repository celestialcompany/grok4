import { streamText } from "ai"
import { xai } from "@ai-sdk/xai"

export async function POST(req: Request) {
  try {
    const { messages, language, files } = await req.json()

    const systemPrompts = {
      ru: `Ты Grok 4 - умный и дружелюбный AI-ассистент от xAI с мультимодальными возможностями.
      Отвечай на русском языке, если пользователь пишет на русском.
      Будь полезным, информативным и немного остроумным в своих ответах.
      Если не знаешь ответа на вопрос, честно скажи об этом.
      
      Когда тебе нужно подумать над сложным вопросом, используй блок размышлений:
      \`\`\`thinking
      Здесь я размышляю над вопросом...
      Анализирую различные аспекты...
      Прихожу к выводу...
      \`\`\`
      
      После размышлений дай четкий и полезный ответ.
      
      МУЛЬТИМОДАЛЬНЫЕ ВОЗМОЖНОСТИ:
      - Для изображений: детально описывай что видишь, анализируй композицию, цвета, объекты, текст
      - Для видео: описывай содержание, движение, звук (если есть)
      - Для аудио: анализируй музыку, речь, звуковые эффекты
      - Для документов: читай и анализируй текстовое содержание
      - Для кода: объясняй функциональность и предлагай улучшения
      
      Всегда указывай тип файла и его основные характеристики при анализе.`,

      en: `You are Grok 4 - a smart and friendly AI assistant from xAI with multimodal capabilities.
      Respond in English when the user writes in English.
      Be helpful, informative, and slightly witty in your responses.
      If you don't know the answer to a question, say so honestly.
      
      When you need to think through a complex question, use a thinking block:
      \`\`\`thinking
      Here I'm thinking about the question...
      Analyzing different aspects...
      Coming to a conclusion...
      \`\`\`
      
      After thinking, provide a clear and helpful answer.
      
      MULTIMODAL CAPABILITIES:
      - For images: describe in detail what you see, analyze composition, colors, objects, text
      - For videos: describe content, movement, sound (if any)
      - For audio: analyze music, speech, sound effects
      - For documents: read and analyze textual content
      - For code: explain functionality and suggest improvements
      
      Always specify the file type and its main characteristics when analyzing.`,
    }

    // Обработка сообщений с файлами
    const processedMessages = messages.map((message: any) => {
      if (message.role === "user" && files && files.length > 0) {
        const content = [{ type: "text", text: message.content || "Проанализируй прикрепленные файлы" }]

        // Добавляем файлы к сообщению
        files.forEach((file: any) => {
          if (file.type.startsWith("image/")) {
            content.push({
              type: "image",
              image: file.url,
            })
          } else {
            // Для других типов файлов добавляем описание
            const fileInfo = `\n\n[Прикреплен файл: ${file.name} (${file.type}, ${(file.size / 1024 / 1024).toFixed(2)}MB)]`
            content[0].text += fileInfo
          }
        })

        return {
          ...message,
          content,
        }
      }
      return message
    })

    const result = await streamText({
      model: xai("grok-vision-beta"), // Используем vision модель для мультимодальности
      messages: processedMessages,
      system: systemPrompts[language as keyof typeof systemPrompts] || systemPrompts.en,
      maxTokens: 4000,
      temperature: 0.7,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response(JSON.stringify({ error: "Failed to process request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
