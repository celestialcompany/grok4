import { streamText } from "ai"
import { xai } from "@ai-sdk/xai"
import { withAuth, createApiResponse, type AuthenticatedRequest } from "@/lib/auth-middleware"

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const { fileUrl, fileType, fileId } = await req.json()

    if (!fileUrl || !fileType) {
      return createApiResponse(null, "File URL and type are required", 400)
    }

    let analysisPrompt = ""

    if (fileType.startsWith("image/")) {
      analysisPrompt = `Проанализируй это изображение детально. Опиши:
      1. Что изображено на картинке
      2. Основные объекты и их расположение
      3. Цветовую гамму
      4. Стиль и композицию
      5. Любой текст, если он есть
      6. Настроение или эмоции, которые передает изображение
      
      Верни результат в формате JSON:
      {
        "description": "подробное описание",
        "objects": ["объект1", "объект2"],
        "colors": ["#цвет1", "#цвет2"],
        "text": "извлеченный текст",
        "sentiment": "настроение",
        "confidence": 0.95
      }`
    } else if (fileType.startsWith("video/")) {
      analysisPrompt = `Проанализируй это видео. Опиши содержание, движение, основные сцены и объекты.`
    } else if (fileType.startsWith("audio/")) {
      analysisPrompt = `Проанализируй этот аудиофайл. Опиши тип звука, музыку, речь или звуковые эффекты.`
    } else {
      analysisPrompt = `Проанализируй содержимое этого файла и предоставь краткое описание.`
    }

    const messages = [
      {
        role: "user",
        content: [
          { type: "text", text: analysisPrompt },
          ...(fileType.startsWith("image/") ? [{ type: "image", image: fileUrl }] : []),
        ],
      },
    ]

    const result = await streamText({
      model: xai("grok-vision-beta"),
      messages,
      temperature: 0.3,
      maxTokens: 1000,
    })

    const analysisText = await result.text

    // Попытка парсинга JSON, если не получается - возвращаем как текст
    let analysis
    try {
      analysis = JSON.parse(analysisText)
    } catch {
      analysis = {
        description: analysisText,
        objects: [],
        colors: [],
        confidence: 0.8,
      }
    }

    return createApiResponse({ analysis })
  } catch (error) {
    console.error("File analysis error:", error)
    return createApiResponse(null, "Failed to analyze file", 500)
  }
})
