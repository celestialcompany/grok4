"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, ImageIcon, Video, Music, File, AlertCircle, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { validateFile, getFileCategory, type MultimodalFile } from "@/lib/multimodal-utils"
import { getAuth } from "firebase/auth"

interface FileUploadZoneProps {
  onFilesUploaded: (files: MultimodalFile[]) => void
  maxFiles?: number
  disabled?: boolean
}

export default function FileUploadZone({ onFilesUploaded, maxFiles = 5, disabled = false }: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState<
    Array<{
      file: File
      progress: number
      status: "uploading" | "success" | "error"
      error?: string
    }>
  >([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      if (!disabled) {
        setIsDragging(true)
      }
    },
    [disabled],
  )

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      if (disabled) return

      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        handleFiles(files)
      }
    },
    [disabled],
  )

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      handleFiles(files)
    }
    // Очищаем input для возможности повторной загрузки того же файла
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [])

  const handleFiles = async (files: File[]) => {
    if (files.length > maxFiles) {
      toast.error(`Можно загрузить максимум ${maxFiles} файлов за раз`)
      return
    }

    // Валидация файлов
    const validFiles: File[] = []
    for (const file of files) {
      const validation = validateFile(file)
      if (validation.valid) {
        validFiles.push(file)
      } else {
        toast.error(`${file.name}: ${validation.error}`)
      }
    }

    if (validFiles.length === 0) return

    // Инициализация состояния загрузки
    const uploadStates = validFiles.map((file) => ({
      file,
      progress: 0,
      status: "uploading" as const,
    }))
    setUploadingFiles(uploadStates)

    const uploadedFiles: MultimodalFile[] = []

    // Загрузка файлов
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i]
      try {
        // Create preview for images
        let preview: string | undefined
        if (file.type.startsWith("image/")) {
          preview = URL.createObjectURL(file)
        }

        const formData = new FormData()
        formData.append("file", file)

        // 🔑  ── get the current Firebase ID token
        const user = getAuth().currentUser
        const token = user ? await user.getIdToken() : null

        const response = await fetch("/api/upload", {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          body: formData,
        })

        if (!response.ok) {
          // Try JSON first …
          let serverError = `HTTP ${response.status}`
          try {
            const data = await response.clone().json()
            if (typeof data === "object" && (data.error || data.message)) {
              serverError = data.error ?? data.message
            }
          } catch {
            // … then fall back to plain text
            try {
              serverError = await response.text()
            } catch {
              /* ignore – keep default */
            }
          }
          throw new Error(serverError)
        }

        const { data } = await response.json()

        uploadedFiles.push({
          id: data.id,
          name: file.name,
          url: data.url,
          type: file.type,
          size: file.size,
          preview,
          metadata: data.metadata,
        })

        // Update progress
        setUploadingFiles((prev) =>
          prev.map((item, index) => (index === i ? { ...item, progress: 100, status: "success" } : item)),
        )
      } catch (error) {
        console.error("Upload error:", error)
        setUploadingFiles((prev) =>
          prev.map((item, index) =>
            index === i
              ? {
                  ...item,
                  status: "error",
                  error: error instanceof Error ? error.message : "Upload failed",
                }
              : item,
          ),
        )
        toast.error(`${file.name}: ${error instanceof Error ? error.message : "Upload failed"}`)
      }
    }

    // Передаем успешно загруженные файлы
    if (uploadedFiles.length > 0) {
      onFilesUploaded(uploadedFiles)
      toast.success(`Загружено файлов: ${uploadedFiles.length}`)
    }

    // Очищаем состояние через 3 секунды
    setTimeout(() => {
      setUploadingFiles([])
    }, 3000)
  }

  const getFileIcon = (type: string) => {
    const category = getFileCategory(type)
    switch (category) {
      case "image":
        return <ImageIcon className="h-5 w-5 text-blue-400" />
      case "video":
        return <Video className="h-5 w-5 text-purple-400" />
      case "audio":
        return <Music className="h-5 w-5 text-green-400" />
      case "document":
        return <FileText className="h-5 w-5 text-orange-400" />
      default:
        return <File className="h-5 w-5 text-gray-400" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-3">
      {/* Upload Zone */}
      <Card
        className={`
          border-2 border-dashed transition-all duration-200 cursor-pointer
          ${isDragging ? "border-blue-400 bg-blue-400/10" : "border-gray-600 hover:border-gray-500"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <div className="p-6 text-center">
          <Upload className={`h-8 w-8 mx-auto mb-3 ${isDragging ? "text-blue-400" : "text-gray-400"}`} />
          <p className="text-gray-300 mb-2">
            {isDragging ? "Отпустите файлы здесь" : "Перетащите файлы сюда или нажмите для выбора"}
          </p>
          <p className="text-xs text-gray-500">
            Поддерживаются изображения, видео, аудио и документы (макс. {maxFiles} файлов)
          </p>
        </div>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,audio/*,.pdf,.txt,.doc,.docx,.csv,.json,.xml"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {/* Upload Progress */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          {uploadingFiles.map((item, index) => (
            <Card key={index} className="p-3 bg-gray-800 border-gray-700">
              <div className="flex items-center gap-3">
                {getFileIcon(item.file.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm text-white truncate">{item.file.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {formatFileSize(item.file.size)}
                      </Badge>
                      {item.status === "success" && <CheckCircle2 className="h-4 w-4 text-green-400" />}
                      {item.status === "error" && <AlertCircle className="h-4 w-4 text-red-400" />}
                    </div>
                  </div>
                  {item.status === "uploading" && <Progress value={item.progress} className="h-1" />}
                  {item.status === "error" && item.error && <p className="text-xs text-red-400">{item.error}</p>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
