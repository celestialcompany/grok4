"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useApi } from "@/hooks/use-api"
import { toast } from "sonner"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function ApiTest() {
  const api = useApi()
  const [testResults, setTestResults] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(false)

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    setIsLoading(true)
    try {
      const result = await testFn()
      setTestResults((prev) => ({
        ...prev,
        [testName]: { success: true, data: result },
      }))
      toast.success(`${testName} - успешно!`)
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        [testName]: { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      }))
      toast.error(`${testName} - ошибка!`)
    } finally {
      setIsLoading(false)
    }
  }

  const testPublicEndpoint = async () => {
    const response = await fetch("/api/test")
    const data = await response.json()
    if (!response.ok) throw new Error(data.error)
    return data
  }

  const testProtectedEndpoint = async () => {
    const response = await fetch("/api/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await api.user?.getIdToken()}`,
      },
      body: JSON.stringify({ test: "data" }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error)
    return data
  }

  const testApiClient = async () => {
    const result = await api.getProfile()
    if (!result.success) throw new Error(result.error)
    return result.data
  }

  const tests = [
    { name: "Публичный endpoint", fn: testPublicEndpoint },
    { name: "Защищенный endpoint", fn: testProtectedEndpoint },
    { name: "API Client", fn: testApiClient },
  ]

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>🧪 Тестирование API</CardTitle>
        <CardDescription>Проверка работоспособности API endpoints</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {tests.map((test) => (
            <div key={test.name} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {testResults[test.name] ? (
                  testResults[test.name].success ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                )}
                <span className="font-medium">{test.name}</span>
              </div>
              <Button onClick={() => runTest(test.name, test.fn)} disabled={isLoading} size="sm">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Тест"}
              </Button>
            </div>
          ))}
        </div>

        <Button
          onClick={() => {
            tests.forEach((test) => runTest(test.name, test.fn))
          }}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Запустить все тесты
        </Button>

        {Object.keys(testResults).length > 0 && (
          <div className="mt-6 space-y-3">
            <h3 className="font-semibold">Результаты тестов:</h3>
            {Object.entries(testResults).map(([testName, result]) => (
              <div key={testName} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {result.success ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="font-medium">{testName}</span>
                </div>
                <pre className="text-xs bg-white p-2 rounded border overflow-auto">
                  {JSON.stringify(result.success ? result.data : result.error, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
