import crypto from "crypto"

const FREEKASSA_SECRET_2 = process.env.FREEKASSA_SECRET_2
const BOT_TOKEN = process.env.BOT_TOKEN

async function sendTelegramMessage(userId, text) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: userId,
        text: text,
        parse_mode: "HTML",
      }),
    })
    return response.ok
  } catch (error) {
    console.error("Ошибка:", error)
    return false
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData()
    const data = Object.fromEntries(formData)

    const { MERCHANT_ID: merchantId, AMOUNT: amount, MERCHANT_ORDER_ID: merchantOrderId, SIGN: sign } = data

    const signString = `${merchantId}:${amount}:${FREEKASSA_SECRET_2}:${merchantOrderId}`
    const expectedSign = crypto.createHash("md5").update(signString).digest("hex")

    if (sign === expectedSign) {
      const userId = merchantOrderId.split("_")[0]
      let imagesCount = 0

      if (Number.parseFloat(amount) === 100) imagesCount = 50
      else if (Number.parseFloat(amount) === 180) imagesCount = 100
      else if (Number.parseFloat(amount) === 500) imagesCount = 300

      if (imagesCount > 0) {
        const text = `✅ Платеж успешен!\n💰 ${amount}₽\n🖼️ +${imagesCount} изображений\n🎨 Используйте /start`
        await sendTelegramMessage(userId, text)
        return new Response("YES", { status: 200 })
      }
    }

    return new Response("NO", { status: 400 })
  } catch (error) {
    return new Response("NO", { status: 500 })
  }
}
