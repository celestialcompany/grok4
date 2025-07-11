import { streamText } from "ai"
import { xai } from "@ai-sdk/xai"

export async function POST(req: Request) {
  try {
    const { messages, language } = await req.json()

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

    const selectedModel = "grok-4-0709" // Теперь всегда используем текстовую модель
    const processedMessages = messages // Файлов нет, сообщения остаются как есть

    const result = await streamText({
      model: xai(selectedModel), // Динамический выбор модели
      messages: processedMessages,
      system: systemPrompts[language as keyof typeof systemPrompts] || systemPrompts.en,
      maxTokens: 2000, // Уменьшено максимальное количество токенов для более быстрых ответов
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
