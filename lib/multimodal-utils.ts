export interface MultimodalFile {
  id: string
  name: string
  url: string
  type: string
  size: number
  preview?: string
  metadata?: {
    width?: number
    height?: number
    duration?: number
    format?: string
  }
}

export const SUPPORTED_FILE_TYPES = {
  images: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"],
  videos: ["video/mp4", "video/webm", "video/ogg", "video/avi", "video/mov"],
  audio: ["audio/mp3", "audio/wav", "audio/ogg", "audio/m4a", "audio/flac", "audio/mpeg"],
  documents: [
    "application/pdf",
    "text/plain",
    "text/csv",
    "application/json",
    "application/xml",
    "text/xml",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
}

export const MAX_FILE_SIZES = {
  image: 10 * 1024 * 1024, // 10MB
  video: 100 * 1024 * 1024, // 100MB
  audio: 50 * 1024 * 1024, // 50MB
  document: 25 * 1024 * 1024, // 25MB
}

export function getFileCategory(mimeType: string): "image" | "video" | "audio" | "document" | "unknown" {
  if (SUPPORTED_FILE_TYPES.images.includes(mimeType)) return "image"
  if (SUPPORTED_FILE_TYPES.videos.includes(mimeType)) return "video"
  if (SUPPORTED_FILE_TYPES.audio.includes(mimeType)) return "audio"
  if (SUPPORTED_FILE_TYPES.documents.includes(mimeType)) return "document"
  return "unknown"
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  const category = getFileCategory(file.type)

  if (category === "unknown") {
    return { valid: false, error: "Неподдерживаемый тип файла" }
  }

  const maxSize = MAX_FILE_SIZES[category]
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Файл слишком большой. Максимальный размер: ${(maxSize / 1024 / 1024).toFixed(0)}MB`,
    }
  }

  // Дополнительные проверки
  if (file.size === 0) {
    return { valid: false, error: "Файл пустой" }
  }

  if (file.name.length > 255) {
    return { valid: false, error: "Слишком длинное имя файла" }
  }

  return { valid: true }
}

export async function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsDataURL(file)
  })
}

export async function getImageMetadata(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
      URL.revokeObjectURL(img.src)
    }
    img.onerror = () => reject(new Error("Failed to load image"))
    img.src = URL.createObjectURL(file)
  })
}

export async function getVideoMetadata(file: File): Promise<{ duration: number; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video")
    video.onloadedmetadata = () => {
      resolve({
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
      })
      URL.revokeObjectURL(video.src)
    }
    video.onerror = () => reject(new Error("Failed to load video"))
    video.src = URL.createObjectURL(file)
  })
}

export async function getAudioMetadata(file: File): Promise<{ duration: number }> {
  return new Promise((resolve, reject) => {
    const audio = document.createElement("audio")
    audio.onloadedmetadata = () => {
      resolve({ duration: audio.duration })
      URL.revokeObjectURL(audio.src)
    }
    audio.onerror = () => reject(new Error("Failed to load audio"))
    audio.src = URL.createObjectURL(audio)
  })
}

export function formatDuration(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return "0:00"

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function getFileIcon(mimeType: string): string {
  const category = getFileCategory(mimeType)

  switch (category) {
    case "image":
      return "🖼️"
    case "video":
      return "🎥"
    case "audio":
      return "🎵"
    case "document":
      if (mimeType.includes("pdf")) return "📄"
      if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) return "📊"
      if (mimeType.includes("word") || mimeType.includes("document")) return "📝"
      return "📄"
    default:
      return "📎"
  }
}

// Проверка поддержки браузером
export function checkBrowserSupport() {
  const support = {
    fileAPI: !!(window.File && window.FileReader && window.FileList && window.Blob),
    dragDrop: "draggable" in document.createElement("div"),
    canvas: !!document.createElement("canvas").getContext,
    video: !!document.createElement("video").canPlayType,
    audio: !!document.createElement("audio").canPlayType,
  }

  return support
}
