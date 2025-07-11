"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronRight, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ThinkingBlockProps {
  children: React.ReactNode
  defaultOpen?: boolean
}

export default function ThinkingBlock({ children, defaultOpen = false }: ThinkingBlockProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="my-4 border border-blue-500/30 rounded-lg bg-gradient-to-r from-blue-900/10 to-purple-900/10 overflow-hidden">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 justify-start text-left border-b border-blue-500/30 hover:bg-blue-900/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-blue-400" />
          ) : (
            <ChevronRight className="h-4 w-4 text-blue-400" />
          )}
          <Brain className="h-4 w-4 text-blue-400" />
          <span className="text-blue-400 font-medium">Размышления Grok</span>
          <span className="text-xs text-gray-400 ml-auto">{isOpen ? "скрыть" : "показать процесс мышления"}</span>
        </div>
      </Button>

      {isOpen && (
        <div className="px-4 py-3 text-gray-300 text-sm leading-relaxed animate-in slide-in-from-top-2 duration-200">
          <div className="whitespace-pre-wrap font-mono text-xs bg-gray-900/50 p-3 rounded border-l-2 border-blue-500/50">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}
