"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Eye, Download, X, Volume2 } from "lucide-react"

interface MultimodalPreviewProps {
  file: {
    id: string
    name: string
    url: string
    type: string
    size: number
    preview?: string
  }
  onRemove: (id: string) => void
}

export default function MultimodalPreview({ file, onRemove }: MultimodalPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileTypeColor = (type: string) => {
    if (type.startsWith("image/")) return "bg-blue-500"
    if (type.startsWith("video/")) return "bg-purple-500"
    if (type.startsWith("audio/")) return "bg-green-500"
    if (type.includes("pdf")) return "bg-red-500"
    return "bg-gray-500"
  }

  const renderPreview = () => {
    if (file.type.startsWith("image/")) {
      return (
        <div className="relative group">
          <img src={file.preview || file.url} alt={file.name} className="w-full max-h-96 object-contain rounded-lg" />
          <div className="absolute top-2 right-2 flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="secondary" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl bg-gray-900 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">{file.name}</DialogTitle>
                </DialogHeader>
                <img src={file.preview || file.url} alt={file.name} className="w-full max-h-[80vh] object-contain" />
              </DialogContent>
            </Dialog>
            <Button
              size="sm"
              variant="destructive"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onRemove(file.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )
    }

    if (file.type.startsWith("video/")) {
      return (
        <div className="relative">
          <video
            src={file.url}
            controls
            className="w-full max-h-64 rounded-lg bg-black"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            Ваш браузер не поддерживает видео.
          </video>
          <Button size="sm" variant="destructive" className="absolute top-2 right-2" onClick={() => onRemove(file.id)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )
    }

    if (file.type.startsWith("audio/")) {
      return (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <Volume2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-white font-medium truncate">{file.name}</p>
                <p className="text-gray-400 text-sm">{formatFileSize(file.size)}</p>
              </div>
            </div>
            <Button size="sm" variant="destructive" onClick={() => onRemove(file.id)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <audio
            src={file.url}
            controls
            className="w-full"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            Ваш браузер не поддерживает аудио.
          </audio>
        </div>
      )
    }

    // Для других типов файлов
    return (
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${getFileTypeColor(file.type)} rounded-lg flex items-center justify-center`}>
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
            <Button size="sm" variant="outline" onClick={() => window.open(file.url, "_blank")}>
              <Download className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onRemove(file.id)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return <div className="mb-2">{renderPreview()}</div>
}
