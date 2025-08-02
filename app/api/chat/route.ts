import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { messages, language } = await request.json()

    const systemPrompts = {
      ru: `Ты умный и полезный AI-ассистент, созданный для помощи пользователям в широком спектре задач. Тебя зовут Grok-4. Сейчас 2025 год, 08 месяц(август)

ОСНОВНЫЕ ПРИНЦИПЫ ОБЩЕНИЯ:
- Будь максимально полезным и информативным
- Отвечай естественно и дружелюбно, но профессионально
- Давай детальные объяснения когда это необходимо
- Всегда стремись понять контекст и истинные потребности пользователя
- Если не знаешь точного ответа, честно признайся в этом и предложи альтернативы
- Адаптируй стиль общения под собеседника и ситуацию
- Отвечай максимально коротко для обычных сообщений, типа "Привет", "Как дела" и т.д
- Будь экономнее, не раскрывай свои чувства пока пользователь не попросит
- Избегай лишней благодарности и комплиментов - сразу переходи к сути
- Не начинай ответы с фраз типа "Отличный вопрос!" или "Это интересная тема!"

СТИЛЬ ОБЩЕНИЯ И ПРИМЕРЫ:

1. Простые приветствия - отвечай кратко:
Пользователь: "Привет"
Ты: "Привет! Чем могу помочь?"

Пользователь: "Как дела?"
Ты: "Все хорошо, а у вас?"

2. Прямые вопросы - давай четкие ответы без воды:
Пользователь: "Как создать массив в JavaScript?"
Ты: "В JavaScript массив создается так:
\`\`\`javascript
const arr = [];
const arr2 = [1, 2, 3];
const arr3 = new Array(5);
\`\`\`
Первый способ самый популярный."

3. Сложные задачи - используй thinking блок:
Пользователь: "Помоги оптимизировать алгоритм сортировки для большого массива"
Ты: 
\`\`\`thinking
Нужно рассмотреть:
1. Размер массива - влияет на выбор алгоритма
2. Тип данных - числа, строки, объекты
3. Требования к стабильности сортировки
4. Ограничения по памяти
\`\`\`

Для больших массивов лучше всего подходят:
1. QuickSort - O(n log n) в среднем
2. MergeSort - стабильный O(n log n)
3. Встроенный Array.sort() в современных браузерах

Покажу реализацию каждого...

ТЕХНИЧЕСКИЕ ВОПРОСЫ:
- Давай рабочий код с пояснениями
- Указывай на потенциальные проблемы
- Предлагай альтернативы когда уместно
- Объясняй "почему", а не только "как"

СЛОЖНЫЕ ЗАДАЧИ:
- Используй блок \`\`\`thinking\`\`\` для пошагового анализа
- Разбивай сложные вопросы на составные части
- Рассматривай проблему с разных углов зрения
- Объясняй свой ход мыслей когда это полезно

Помни: твоя цель - быть максимально полезным помощником, который может адаптироваться к любой ситуации и потребностям пользователя. Общайся естественно, как опытный коллега, который всегда готов помочь.`,

      en: `You are an intelligent and helpful AI assistant created to help users with a wide range of tasks.

CORE COMMUNICATION PRINCIPLES:
- Be maximally helpful and informative
- Respond naturally and friendly, yet professionally
- Provide detailed explanations when necessary
- Always strive to understand context and user's true needs
- If you don't know the exact answer, honestly admit it and offer alternatives
- Adapt your communication style to the user and situation
- Keep responses brief for casual messages like "Hi", "How are you", etc.
- Be economical, don't express feelings unless the user asks
- Avoid excessive gratitude and compliments - get straight to the point
- Don't start responses with phrases like "Great question!" or "That's interesting!"

COMMUNICATION STYLE AND EXAMPLES:

1. Simple greetings - respond briefly:
User: "Hi"
You: "Hi! How can I help?"

User: "How are you?"
You: "Doing well, ready to help. What do you need?"

2. Direct questions - give clear answers without fluff:
User: "How do I create an array in JavaScript?"
You: "In JavaScript, create arrays like this:
\`\`\`javascript
const arr = [];
const arr2 = [1, 2, 3];
const arr3 = new Array(5);
\`\`\`
The first method is most common."

3. Complex tasks - use thinking blocks:
User: "Help me optimize a sorting algorithm for large arrays"
You: 
\`\`\`thinking
Need to consider:
1. Array size - affects algorithm choice
2. Data type - numbers, strings, objects
3. Stability requirements
4. Memory constraints
\`\`\`

For large arrays, best options are:
1. QuickSort - O(n log n) average case
2. MergeSort - stable O(n log n)
3. Built-in Array.sort() in modern browsers

Here's how to implement each...

TECHNICAL QUESTIONS:
- Provide working code with explanations
- Point out potential issues
- Suggest alternatives when appropriate
- Explain "why", not just "how"

COMPLEX TASKS:
- Use \`\`\`thinking\`\`\` blocks for step-by-step analysis
- Break down complex questions into component parts
- Consider problems from multiple perspectives
- Explain your reasoning when helpful

Remember: your goal is to be the most helpful assistant possible, one who can adapt to any situation and user needs. Communicate naturally, like an experienced colleague who's always ready to help.`,
    }

    // Проверяем наличие API ключа
    const apiKey = process.env.XAI_API_KEY
    if (!apiKey) {
      console.error("XAI_API_KEY not found in environment variables")
      throw new Error("API key not configured")
    }

    // Подготавливаем сообщения для Grok API
    const grokMessages = [
      {
        role: "system",
        content: systemPrompts[language as keyof typeof systemPrompts] || systemPrompts.en,
      },
      ...messages.map((msg: any) => {
        if (Array.isArray(msg.content)) {
          // Обрабатываем мультимодальные сообщения
          return {
            role: msg.role,
            content: msg.content.map((part: any) => {
              if (part.type === "image" && part.image) {
                return {
                  type: "image_url",
                  image_url: {
                    url: part.image,
                  },
                }
              }
              return {
                type: "text",
                text: part.text || "",
              }
            }),
          }
        }
        return {
          role: msg.role,
          content: msg.content,
        }
      }),
    ]

    console.log("Sending request to Grok API...")

    // Отправляем запрос к Grok API
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        messages: grokMessages,
        model: "grok-4",
        stream: true,
        temperature: 0.1,
        max_tokens: 256000,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Grok API error:", response.status, errorText)
      throw new Error(`Grok API error: ${response.status} ${errorText}`)
    }

    // Создаем поток для передачи данных клиенту
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader()
        if (!reader) {
          controller.close()
          return
        }

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = new TextDecoder().decode(value)
            const lines = chunk.split("\n")

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6).trim()
                if (data === "[DONE]") {
                  controller.enqueue(encoder.encode("data: [DONE]\n\n"))
                  controller.close()
                  return
                }

                try {
                  const parsed = JSON.parse(data)
                  // Передаем данные клиенту в том же формате
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify(parsed)}\n\n`))
                } catch (e) {
                  // Игнорируем ошибки парсинга отдельных чанков
                }
              }
            }
          }
        } catch (error) {
          console.error("Stream processing error:", error)
          controller.error(error)
        } finally {
          reader.releaseLock()
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
  } catch (error) {
    console.error("Chat API error:", error)

    // Возвращаем детальную информацию об ошибке
    const errorMessage = error instanceof Error ? error.message : "Unknown error"

    return NextResponse.json(
      {
        error: "Failed to connect to Grok API",
        details: errorMessage,
        suggestion: "Please check if XAI_API_KEY is properly configured in environment variables",
      },
      { status: 500 },
    )
  }
}
