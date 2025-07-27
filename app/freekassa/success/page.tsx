import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function FreeKassaSuccessPage() {
  return (
    <div className="min-h-screen bg-[#212121] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#2f2f2f] border-gray-600 text-white text-center">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-3xl font-bold">Платеж успешно завершен!</CardTitle>
          <CardDescription className="text-gray-400 mt-2">
            Спасибо за вашу покупку. Ваш платеж был успешно обработан.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Link href="https://t.me/your_bot" passHref>
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg py-3 rounded-lg shadow-md transition-all duration-200"
            >
              Вернуться в бот
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
