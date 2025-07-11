"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, ImageIcon, Video, Music, Eye, Brain, Zap, HardDrive } from "lucide-react"
import { formatDuration } from "@/lib/multimodal-utils"

interface FileAnalyzerProps {
  file: {
    id: string
    name: string
    url: string
    type: string
    size: number
    category: string
    metadata?: any
  }
  analysis?: {
    description: string
    objects: string[]
    colors: string[]
    text?: string
    sentiment?: string
    confidence: number
  }
}

export default function FileAnalyzer({ file, analysis }: FileAnalyzerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentAnalysis, setCurrentAnalysis] = useState(analysis)

  const analyzeFile = async () => {
    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/analyze-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId: file.id, fileUrl: file.url, fileType: file.type }),
      })

      if (response.ok) {
        const result = await response.json()
        setCurrentAnalysis(result.analysis)
      }
    } catch (error) {
      console.error("Analysis failed:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB"]
    if (bytes === 0) return "0 Bytes"
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
  }

  const getCategoryIcon = () => {
    switch (file.category) {
      case "image":
        return <ImageIcon className="h-5 w-5 text-blue-400" />
      case "video":
        return <Video className="h-5 w-5 text-purple-400" />
      case "audio":
        return <Music className="h-5 w-5 text-green-400" />
      default:
        return <FileText className="h-5 w-5 text-gray-400" />
    }
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getCategoryIcon()}
            <div>
              <CardTitle className="text-white text-lg">{file.name}</CardTitle>
              <CardDescription className="text-gray-400">
                {file.type} • {formatFileSize(file.size)}
              </CardDescription>
            </div>
          </div>
          <Button onClick={analyzeFile} disabled={isAnalyzing} className="bg-blue-600 hover:bg-blue-700">
            {isAnalyzing ? (
              <>
                <Brain className="h-4 w-4 mr-2 animate-pulse" />
                Анализирую...
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Анализировать
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-700">
            <TabsTrigger value="info" className="text-gray-300 data-[state=active]:bg-gray-600">
              Информация
            </TabsTrigger>
            <TabsTrigger value="metadata" className="text-gray-300 data-[state=active]:bg-gray-600">
              Метаданные
            </TabsTrigger>
            <TabsTrigger value="analysis" className="text-gray-300 data-[state=active]:bg-gray-600">
              Анализ ИИ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <HardDrive className="h-4 w-4" />
                  Размер файла
                </div>
                <div className="text-white font-medium">{formatFileSize(file.size)}</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <FileText className="h-4 w-4" />
                  Тип файла
                </div>
                <Badge variant="secondary">{file.type}</Badge>
              </div>
            </div>

            {file.category === "image" && (
              <div className="mt-4">
                <img
                  src={file.url || "/placeholder.svg"}
                  alt={file.name}
                  className="w-full max-h-64 object-contain rounded-lg border border-gray-600"
                />
              </div>
            )}

            {file.category === "video" && (
              <div className="mt-4">
                <video src={file.url} controls className="w-full max-h-64 rounded-lg border border-gray-600">
                  Ваш браузер не поддерживает видео.
                </video>
              </div>
            )}

            {file.category === "audio" && (
              <div className="mt-4">
                <audio src={file.url} controls className="w-full">
                  Ваш браузер не поддерживает аудио.
                </audio>
              </div>
            )}
          </TabsContent>

          <TabsContent value="metadata" className="space-y-4">
            {file.metadata ? (
              <div className="space-y-3">
                {file.metadata.width && file.metadata.height && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Разрешение:</span>
                    <span className="text-white">
                      {file.metadata.width} × {file.metadata.height}
                    </span>
                  </div>
                )}

                {file.metadata.duration && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Длительность:</span>
                    <span className="text-white">{formatDuration(file.metadata.duration)}</span>
                  </div>
                )}

                {file.metadata.format && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Формат:</span>
                    <Badge variant="outline">{file.metadata.format}</Badge>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Метаданные недоступны</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            {currentAnalysis ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-white font-medium">Результат анализа</h4>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm text-gray-400">
                      Уверенность: {Math.round(currentAnalysis.confidence * 100)}%
                    </span>
                  </div>
                </div>

                <Progress value={currentAnalysis.confidence * 100} className="h-2" />

                <div className="bg-gray-900 rounded-lg p-4">
                  <p className="text-gray-200 leading-relaxed">{currentAnalysis.description}</p>
                </div>

                {currentAnalysis.objects && currentAnalysis.objects.length > 0 && (
                  <div>
                    <h5 className="text-white font-medium mb-2">Обнаруженные объекты:</h5>
                    <div className="flex flex-wrap gap-2">
                      {currentAnalysis.objects.map((object, index) => (
                        <Badge key={index} variant="secondary">
                          {object}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {currentAnalysis.colors && currentAnalysis.colors.length > 0 && (
                  <div>
                    <h5 className="text-white font-medium mb-2">Основные цвета:</h5>
                    <div className="flex gap-2">
                      {currentAnalysis.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 rounded-full border border-gray-600"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {currentAnalysis.text && (
                  <div>
                    <h5 className="text-white font-medium mb-2">Извлеченный текст:</h5>
                    <div className="bg-gray-900 rounded-lg p-3 text-sm text-gray-300 font-mono">
                      {currentAnalysis.text}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="mb-4">Анализ не выполнен</p>
                <Button onClick={analyzeFile} disabled={isAnalyzing}>
                  {isAnalyzing ? "Анализирую..." : "Запустить анализ"}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
