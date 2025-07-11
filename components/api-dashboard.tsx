"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Copy, Plus, Trash2, Eye, EyeOff, Activity, Key, TrendingUp } from "lucide-react"
import { createApiKey, getUserApiKeys, toggleApiKey, deleteApiKey, type ApiKey } from "@/lib/api-keys"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebase"

export default function ApiDashboard() {
  const [user] = useAuthState(auth)
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newKeyName, setNewKeyName] = useState("")
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  useEffect(() => {
    if (user) {
      loadApiKeys()
    }
  }, [user])

  const loadApiKeys = async () => {
    if (!user) return

    try {
      const keys = await getUserApiKeys(user.uid)
      setApiKeys(keys)
    } catch (error) {
      toast.error("Failed to load API keys")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateKey = async () => {
    if (!user || !newKeyName.trim()) return

    setCreating(true)
    try {
      const newKey = await createApiKey(user.uid, newKeyName)
      setApiKeys([...apiKeys, newKey])
      setNewKeyName("")
      setIsCreateDialogOpen(false)
      toast.success("API key created successfully!")
    } catch (error) {
      toast.error("Failed to create API key")
    } finally {
      setCreating(false)
    }
  }

  const handleToggleKey = async (keyId: string, isActive: boolean) => {
    try {
      await toggleApiKey(keyId, !isActive)
      setApiKeys(apiKeys.map((key) => (key.id === keyId ? { ...key, isActive: !isActive } : key)))
      toast.success(`API key ${!isActive ? "activated" : "deactivated"}`)
    } catch (error) {
      toast.error("Failed to update API key")
    }
  }

  const handleDeleteKey = async (keyId: string) => {
    if (!confirm("Are you sure you want to delete this API key?")) return

    try {
      await deleteApiKey(keyId)
      setApiKeys(apiKeys.filter((key) => key.id !== keyId))
      toast.success("API key deleted")
    } catch (error) {
      toast.error("Failed to delete API key")
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Copied to clipboard!")
    } catch (error) {
      toast.error("Failed to copy")
    }
  }

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys((prev) => ({ ...prev, [keyId]: !prev[keyId] }))
  }

  const formatKey = (key: string, show: boolean) => {
    if (show) return key
    return key.substring(0, 12) + "..." + key.substring(key.length - 4)
  }

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.min((used / limit) * 100, 100)
  }

  const totalRequests = apiKeys.reduce((sum, key) => sum + key.usage.requestsThisMonth, 0)
  const totalTokens = apiKeys.reduce((sum, key) => sum + key.usage.tokensThisMonth, 0)
  const activeKeys = apiKeys.filter((key) => key.isActive).length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Active API Keys</CardTitle>
            <Key className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{activeKeys}</div>
            <p className="text-xs text-gray-400">{apiKeys.length} total keys</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Requests This Month</CardTitle>
            <Activity className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalRequests.toLocaleString()}</div>
            <p className="text-xs text-gray-400">Across all API keys</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Tokens Used</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalTokens.toLocaleString()}</div>
            <p className="text-xs text-gray-400">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* API Keys Section */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">API Keys</CardTitle>
              <CardDescription className="text-gray-400">
                Manage your API keys for accessing the Grok API
              </CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create API Key
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Create New API Key</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Enter a name for your new API key. This will help you identify it later.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="API Key Name (e.g., 'Production App')"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                      className="border-gray-600 text-gray-300"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateKey}
                      disabled={creating || !newKeyName.trim()}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {creating ? "Creating..." : "Create Key"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {apiKeys.length === 0 ? (
            <div className="text-center py-8">
              <Key className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">No API Keys</h3>
              <p className="text-gray-400 mb-4">Create your first API key to get started</p>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Create API Key
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="border border-gray-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-white">{apiKey.name}</h3>
                      <Badge variant={apiKey.isActive ? "default" : "secondary"}>
                        {apiKey.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleKey(apiKey.id, apiKey.isActive)}
                        className="text-gray-400 hover:text-white"
                      >
                        {apiKey.isActive ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteKey(apiKey.id)}
                        className="text-gray-400 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <code className="bg-gray-700 px-2 py-1 rounded text-sm font-mono text-gray-300 flex-1">
                      {formatKey(apiKey.key, showKeys[apiKey.id])}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                      className="text-gray-400 hover:text-white"
                    >
                      {showKeys[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(apiKey.key)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400 mb-1">Requests this month</div>
                      <div className="text-white font-medium">
                        {apiKey.usage.requestsThisMonth.toLocaleString()} /{" "}
                        {apiKey.limits.requestsPerMonth.toLocaleString()}
                      </div>
                      <Progress
                        value={getUsagePercentage(apiKey.usage.requestsThisMonth, apiKey.limits.requestsPerMonth)}
                        className="mt-1 h-2"
                      />
                    </div>

                    <div>
                      <div className="text-gray-400 mb-1">Tokens this month</div>
                      <div className="text-white font-medium">
                        {apiKey.usage.tokensThisMonth.toLocaleString()} /{" "}
                        {apiKey.limits.tokensPerMonth.toLocaleString()}
                      </div>
                      <Progress
                        value={getUsagePercentage(apiKey.usage.tokensThisMonth, apiKey.limits.tokensPerMonth)}
                        className="mt-1 h-2"
                      />
                    </div>

                    <div>
                      <div className="text-gray-400 mb-1">Rate limit</div>
                      <div className="text-white font-medium">{apiKey.limits.requestsPerMinute} req/min</div>
                      <div className="text-xs text-gray-400 mt-1">
                        Created {new Date(apiKey.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
