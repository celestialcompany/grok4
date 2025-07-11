import type { User } from "firebase/auth"

// Типы для API
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
  userId: string
  chatId: string
}

export interface Chat {
  id: string
  title: string
  userId: string
  createdAt: number
  updatedAt: number
  messageCount: number
  lastMessage?: string
}

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  createdAt: number
  updatedAt: number
  preferences: {
    language: "ru" | "en"
    theme: "dark" | "light"
  }
}

export interface FileUpload {
  id: string
  name: string
  url: string
  type: string
  size: number
  userId: string
  uploadedAt: number
}

// Базовый класс для API клиента
class ApiClient {
  private baseUrl: string
  private user: User | null = null

  constructor(baseUrl = "/api") {
    this.baseUrl = baseUrl
  }

  setUser(user: User | null) {
    this.user = user
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const token = this.user ? await this.user.getIdToken() : null

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}`,
        }
      }

      return {
        success: true,
        data,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  // Chat API
  async getChats(): Promise<ApiResponse<Chat[]>> {
    return this.request<Chat[]>("/chats")
  }

  async getChat(chatId: string): Promise<ApiResponse<Chat>> {
    return this.request<Chat>(`/chats/${chatId}`)
  }

  async createChat(title: string): Promise<ApiResponse<Chat>> {
    return this.request<Chat>("/chats", {
      method: "POST",
      body: JSON.stringify({ title }),
    })
  }

  async updateChat(chatId: string, updates: Partial<Chat>): Promise<ApiResponse<Chat>> {
    return this.request<Chat>(`/chats/${chatId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    })
  }

  async deleteChat(chatId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/chats/${chatId}`, {
      method: "DELETE",
    })
  }

  // Messages API
  async getMessages(chatId: string, limit = 50, offset = 0): Promise<ApiResponse<ChatMessage[]>> {
    return this.request<ChatMessage[]>(`/chats/${chatId}/messages?limit=${limit}&offset=${offset}`)
  }

  async createMessage(chatId: string, content: string, role: "user" | "assistant"): Promise<ApiResponse<ChatMessage>> {
    return this.request<ChatMessage>(`/chats/${chatId}/messages`, {
      method: "POST",
      body: JSON.stringify({ content, role }),
    })
  }

  async deleteMessage(chatId: string, messageId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/chats/${chatId}/messages/${messageId}`, {
      method: "DELETE",
    })
  }

  // User Profile API
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>("/user/profile")
  }

  async updateProfile(updates: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>("/user/profile", {
      method: "PUT",
      body: JSON.stringify(updates),
    })
  }

  // Files API
  async uploadFile(file: File): Promise<ApiResponse<FileUpload>> {
    const formData = new FormData()
    formData.append("file", file)

    const token = this.user ? await this.user.getIdToken() : null

    try {
      const response = await fetch(`${this.baseUrl}/upload`, {
        method: "POST",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}`,
        }
      }

      return {
        success: true,
        data,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Upload failed",
      }
    }
  }

  async getFiles(): Promise<ApiResponse<FileUpload[]>> {
    return this.request<FileUpload[]>("/files")
  }

  async deleteFile(fileId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/files/${fileId}`, {
      method: "DELETE",
    })
  }

  // Analytics API
  async getUsageStats(): Promise<ApiResponse<any>> {
    return this.request("/analytics/usage")
  }
}

// Экспортируем singleton instance
export const apiClient = new ApiClient()
