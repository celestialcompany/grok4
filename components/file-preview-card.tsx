"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { X, Eye, Download, FileText, ImageIcon, Video, Music, File, Volume2 } from "lucide-react"
import type { MultimodalFile } from "@/lib/multimodal-utils"

interface FilePreviewCardProps {
  file: MultimodalFile
  onRemove: (id: string) => void
  compact?: boolean
}

export default function FilePreviewCard({ file, onRemove, compact = false }: FilePreviewCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [imageError, setImageError] = useState(false)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  const getFileIcon = () => {
    if (file.type.startsWith("image/")) return <ImageIcon className="h-5 w-5 text-blue-400" />
    if (file.type.startsWith("video/")) return <Video className="h-5 w-5 text-purple-400" />
    if (file.type.startsWith("audio/")) return <Music className="h-5 w-5 text-green-400" />
    if (file.type.includes("pdf")) return <FileText className="h-5 w-5 text-red-400" />
    return <File className="h-5 w-5 text-gray-400" />
  }

  const getCategoryColor = () => {
    if (file.type.startsWith("image/")) return "bg-blue-500"
    if (file.type.startsWith("video/")) return "bg-purple-500"
    if (file.type.startsWith("audio/")) return "bg-green-500"
    if (file.type.includes("pdf")) return "bg-red-500"
    return "bg-gray-500"
  }

  // Компактный вид для области ввода
  if (compact) {
    return (
      <div className="flex items-center gap-2 bg-gray-700 rounded-lg px-3 py-2 text-sm">
        {getFileIcon()}
        <span className="text-gray-200 truncate max-w-32">{file.name}</span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-4 w-4 p-0 text-gray-400 hover:text-red-400"
          onClick={() => onRemove(file.id)}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    )
  }

  // Полный вид для превью
  return (
    <Card className="bg-gray-800 border-gray-700 overflow-hidden">
      {/* Изображения */}
      {file.type.startsWith("image/") && (
        <div className="relative group">
          {!imageError ? (
            <img
              src={file.preview || file.url}
              alt={file.name}
              className="w-full max-h-64 object-cover"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-32 bg-gray-700 flex items-center justify-center">
              <div className="text-center">
                <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-400">Не удалось загрузить изображение</p>
              </div>
            </div>
          )}

          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                  <Eye className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl bg-gray-900 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">{file.name}</DialogTitle>
                </DialogHeader>
                <div className="max-h-[80vh] overflow-auto">
                  <img src={file.preview || file.url} alt={file.name} className="w-full h-auto" />
                </div>
              </DialogContent>
            </Dialog>

            <Button size="sm" variant="destructive" className="h-8 w-8 p-0" onClick={() => onRemove(file.id)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Видео */}
      {file.type.startsWith("video/") && (
        <div className="relative">
          <video
            src={file.url}
            controls
            className="w-full max-h-64 bg-black"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            preload="metadata"
          >
            Ваш браузер не поддерживает видео.
          </video>
          <Button
            size="sm"
            variant="destructive"
            className="absolute top-2 right-2 h-8 w-8 p-0"
            onClick={() => onRemove(file.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Аудио */}
      {file.type.startsWith("audio/") && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <Volume2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-white font-medium truncate max-w-48">{file.name}</p>
                <p className="text-gray-400 text-sm">{formatFileSize(file.size)}</p>
              </div>
            </div>
            <Button size="sm" variant="destructive" className="h-8 w-8 p-0" onClick={() => onRemove(file.id)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <audio
            src={file.url}
            controls
            className="w-full"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            preload="metadata"
          >
            Ваш браузер не поддерживает аудио.
          </audio>
        </div>
      )}

      {/* Документы и другие файлы */}
      {!file.type.startsWith("image/") && !file.type.startsWith("video/") && !file.type.startsWith("audio/") && (
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${getCategoryColor()} rounded-lg flex items-center justify-center`}>
                <span className="text-white text-xs font-bold">
                  {file.type.split("/")[1]?.toUpperCase().slice(0, 3) || "FILE"}
                </span>
              </div>
              <div>
                <p className="text-white font-medium truncate max-w-48">{file.name}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {file.type}
                  </Badge>
                  <span className="text-gray-400 text-xs">{formatFileSize(file.size)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0 bg-transparent"
                onClick={() => window.open(file.url, "_blank")}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="destructive" className="h-8 w-8 p-0" onClick={() => onRemove(file.id)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Метаданные */}
      {file.metadata && (
        <div className="px-4 pb-4">
          <div className="flex gap-4 text-xs text-gray-400">
            {file.metadata.width && file.metadata.height && (
              <span>
                {file.metadata.width} × {file.metadata.height}
              </span>
            )}
            {file.metadata.duration && <span>{formatDuration(file.metadata.duration)}</span>}
          </div>
        </div>
      )}
    </Card>
  )
}
