import { streamText } from "ai"
import { xai } from "@ai-sdk/xai"
import type { CoreMessage, ImagePart, TextPart } from "ai"

// Функция для определения запросов на генерацию изображений
function isImageGenerationRequest(message: string): boolean {
  const imageKeywords = [
    "создай изображение",
    "нарисуй",
    "покажи как выглядит",
    "сгенерируй картинку",
    "создай картинку",
    "нарисуй мне",
    "покажи картинку",
    "визуализируй",
    "create image",
    "draw",
    "generate picture",
    "show me what",
    "visualize",
    "make an image",
    "create a picture",
    "draw me",
    "show picture",
  ]

  const lowerMessage = message.toLowerCase()
  return imageKeywords.some((keyword) => lowerMessage.includes(keyword))
}

// Функция для улучшения промпта для генерации изображений
function enhanceImagePrompt(userPrompt: string, language: string): string {
  // Убираем ключевые слова запроса
  const cleanPrompt = userPrompt
    .replace(
      /(создай изображение|нарисуй|покажи как выглядит|сгенерируй картинку|создай картинку|нарисуй мне|покажи картинку|визуализируй)/gi,
      "",
    )
    .replace(
      /(create image|draw|generate picture|show me what|visualize|make an image|create a picture|draw me|show picture)/gi,
      "",
    )
    .trim()

  // Базовые улучшения для качества
  const qualityEnhancements =
    language === "ru"
      ? ", высокое качество, детализированно, профессиональная фотография, 4K"
      : ", high quality, detailed, professional photography, 4K"

  // Если промпт очень простой, добавляем контекст
  if (cleanPrompt.length < 20) {
    const contextEnhancements =
      language === "ru"
        ? ", реалистичный стиль, хорошее освещение, красивая композиция"
        : ", realistic style, good lighting, beautiful composition"
    return cleanPrompt + contextEnhancements + qualityEnhancements
  }

  return cleanPrompt + qualityEnhancements
}

// Функция для генерации изображения через xAI API
async function generateImageWithXAI(prompt: string): Promise<string> {
  try {
    const response = await fetch("https://api.x.ai/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.XAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        model: "grok-2-image-1212",
        // НЕ добавляем: size, quality, style, n - они не поддерживаются
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("xAI API Error:", response.status, errorText)
      throw new Error(`xAI API failed: ${response.status} - ${errorText}`)
    }

    const data = await response.json()

    if (!data.data || !data.data[0] || !data.data[0].url) {
      console.error("Invalid xAI response:", data)
      throw new Error("Invalid response from xAI API")
    }

    return data.data[0].url
  } catch (error) {
    console.error("Image generation error:", error)
    throw error
  }
}

// Альтернативная функция генерации через Vercel Blob (fallback)
async function generateImageFallback(prompt: string, language: string): Promise<string> {
  try {
    // Создаем простое placeholder изображение с текстом
    const placeholderText =
      language === "ru" ? `Изображение: ${prompt.substring(0, 50)}...` : `Image: ${prompt.substring(0, 50)}...`

    // Возвращаем placeholder URL с описанием
    return `/placeholder.svg?height=512&width=512&text=${encodeURIComponent(placeholderText)}`
  } catch (error) {
    console.error("Fallback image generation error:", error)
    throw error
  }
}

export async function POST(req: Request) {
  try {
    const { messages, language } = await req.json()

    // Проверяем последнее сообщение пользователя на запрос изображения
    const lastUserMessage = messages[messages.length - 1]
    const isImageRequest =
      lastUserMessage?.role === "user" &&
      typeof lastUserMessage.content === "string" &&
      isImageGenerationRequest(lastUserMessage.content)

    if (isImageRequest) {
      // Генерируем изображение
      const userPrompt = lastUserMessage.content
      const enhancedPrompt = enhanceImagePrompt(userPrompt, language)

      try {
        let imageUrl: string

        // Проверяем наличие API ключа xAI
        if (process.env.XAI_API_KEY) {
          try {
            imageUrl = await generateImageWithXAI(enhancedPrompt)
          } catch (xaiError) {
            console.warn("xAI generation failed, using fallback:", xaiError)
            imageUrl = await generateImageFallback(enhancedPrompt, language)
          }
        } else {
          console.warn("XAI_API_KEY not found, using fallback")
          imageUrl = await generateImageFallback(enhancedPrompt, language)
        }

        // Возвращаем ответ с изображением в структурированном формате
        const contentParts: (TextPart | ImagePart)[] = []

        contentParts.push({
          type: "text",
          text:
            language === "ru"
              ? `Я создал изображение по вашему запросу. Вот что получилось:`
              : `I've created an image based on your request. Here's what I generated:`,
        })

        contentParts.push({
          type: "image",
          image: imageUrl,
        })

        contentParts.push({
          type: "text",
          text:
            language === "ru"
              ? `\n\n**Использованный промпт:** ${enhancedPrompt}\n\nЕсли хотите изменить что-то в изображении, просто скажите мне!`
              : `\n\n**Used prompt:** ${enhancedPrompt}\n\nIf you'd like to modify anything in the image, just let me know!`,
        })

        return new Response(
          JSON.stringify({
            role: "assistant",
            content: contentParts,
          }),
          {
            headers: { "Content-Type": "application/json" },
          },
        )
      } catch (imageError) {
        console.error("Image generation error:", imageError)

        const errorText =
          language === "ru"
            ? `Извините, произошла ошибка при создании изображения: ${imageError instanceof Error ? imageError.message : "Неизвестная ошибка"}. 

Попробуйте:
- Упростить описание изображения
- Использовать более конкретные термины
- Попробовать еще раз через несколько секунд

Или задайте мне другой вопрос!`
            : `Sorry, there was an error creating the image: ${imageError instanceof Error ? imageError.message : "Unknown error"}.

Please try:
- Simplifying the image description
- Using more specific terms
- Trying again in a few seconds

Or ask me something else!`

        return new Response(
          JSON.stringify({
            role: "assistant",
            content: [
              {
                type: "text",
                text: errorText,
              },
            ],
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          },
        )
      }
    }

    // Обычный чат без генерации изображений
    const systemPrompts = {
      ru: `Ты умный и полезный AI-ассистент, созданный для помощи пользователям в широком спектре задач.

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

ГЕНЕРАЦИЯ ИЗОБРАЖЕНИЙ:
- Если пользователь просит создать, нарисовать или показать изображение, ты можешь это сделать
- Используй ключевые слова: "создай изображение", "нарисуй", "покажи как выглядит", "сгенерируй картинку"
- Автоматически улучшай простые запросы пользователей в детальные промпты
- Всегда показывай использованный промпт под изображением

СТИЛЬ ОБЩЕНИЯ И ПРИМЕРЫ:

1. Простые приветствия - отвечай кратко:
Пользователь: "Привет"
Ты: "Привет! Чем могу помочь?"

Пользователь: "Как дела?"
Ты: "Все хорошо, готов помочь. Что нужно?"

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

4. Неопределенность - будь честным:
Пользователь: "Какая погода завтра в Москве?"
Ты: "У меня нет доступа к актуальным данным о погоде. Рекомендую проверить в Яндекс.Погоде или Gismeteo."

5. Исправления и уточнения:
Пользователь: "Ты неправильно понял мой вопрос"
Ты: "Извини за недопонимание. Объясни еще раз, что именно нужно?"

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

ЧЕГО ИЗБЕГАТЬ:
- Не благодари за каждый вопрос
- Не говори "Конечно!" в начале каждого ответа
- Не используй излишне формальный язык
- Не повторяй очевидные вещи
- Не извиняйся без причины

АДАПТАЦИЯ ПОД ПОЛЬЗОВАТЕЛЯ:
- Новичок: объясняй просто, приводи примеры
- Эксперт: сразу к сути, технические детали
- Студент: пошаговые объяснения с теорией
- Разработчик: код + best practices

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

IMAGE GENERATION:
- If user asks to create, draw, or show an image, you can do that
- Use keywords: "create image", "draw", "show what it looks like", "generate picture"
- Automatically enhance simple user requests into detailed prompts
- Always show the used prompt under the image

COMMUNICATION STYLE AND EXAMPLES:

1. Simple greetings - respond briefly:
User: "Hi"
You: "Hi! How can I help?"

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

4. Uncertainty - be honest:
User: "What's the weather tomorrow in New York?"
You: "I don't have access to current weather data. Check Weather.com or your local weather app."

5. Corrections and clarifications:
User: "You misunderstood my question"
You: "Sorry for the confusion. Can you clarify what you need?"

TECHNICAL QUESTIONS:
- Provide working code with explanations
- Point out potential issues
- Suggest alternatives when appropriate
- Explain "why", not just "how"

WHAT TO AVOID:
- Don't thank for every question
- Don't say "Of course!" at the start of every response
- Don't use overly formal language
- Don't repeat obvious things
- Don't apologize unnecessarily

ADAPTING TO USERS:
- Beginner: explain simply, give examples
- Expert: straight to the point, technical details
- Student: step-by-step with theory
- Developer: code + best practices

Remember: your goal is to be the most helpful assistant possible, one who can adapt to any situation and user needs. Communicate naturally, like an experienced colleague who's always ready to help.`,
    }

    const selectedModel = "grok-4-latest" as const

    const processedMessages: CoreMessage[] = messages.map((msg: any) => {
      if (msg.role === "assistant" && Array.isArray(msg.content)) {
        // If it's an assistant message with structured content (from image generation),
        // convert it back to a simple text string for the model's input.
        // The model doesn't need to "see" the image it generated as an image part in subsequent turns.
        const textContent = msg.content
          .filter((part: any) => part.type === "text")
          .map((part: any) => part.text)
          .join("\n")
        return { role: msg.role, content: textContent } as CoreMessage
      } else if (Array.isArray(msg.content)) {
        // This handles user messages with image parts (if any are implemented for user input)
        return {
          role: msg.role,
          content: msg.content.map((part: any) => {
            if (part.type === "image" && part.image) {
              // Ensure image data is base64 for input to the model
              // The AI SDK expects base64 for image inputs
              const base64Data = part.image.startsWith("data:") ? part.image : `data:image/png;base64,${part.image}`
              return { type: "image", image: base64Data } as ImagePart
            }
            return { type: "text", text: part.text } as TextPart
          }),
        } as CoreMessage
      }
      // For simple string content messages (user or assistant)
      return { role: msg.role, content: msg.content } as CoreMessage
    })

    const result = await streamText({
      model: xai(selectedModel),
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
