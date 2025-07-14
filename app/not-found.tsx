import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Frown } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center p-4 text-center">
      <Frown className="h-24 w-24 text-gray-500 mb-6" />
      <h1 className="text-5xl font-bold text-white mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-300 mb-4">Страница не найдена</h2>
      <p className="text-gray-400 mb-8 max-w-md">
        Извините, мы не смогли найти страницу, которую вы ищете. Возможно, она была перемещена или удалена.
      </p>
      <Link href="/" passHref>
        <Button className="bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-800 hover:to-purple-800 text-white text-lg px-8 py-5 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105">
          Вернуться на главную
        </Button>
      </Link>
    </div>
  )
}
