export async function GET() {
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Ошибка оплаты</title>
  <style>
    body {font-family: Arial; background: linear-gradient(135deg, #fc466b, #3f5efb); margin: 0; padding: 20px; min-height: 100vh; display: flex; align-items: center; justify-content: center}
    .container {background: white; padding: 40px; border-radius: 20px; text-align: center; max-width: 400px}
    .icon {font-size: 64px; margin-bottom: 20px}
    h1 {color: #2d3748; margin-bottom: 10px}
    p {color: #4a5568; margin-bottom: 30px}
    .button {background: linear-gradient(135deg, #fc466b, #3f5efb); color: white; padding: 15px 30px; border: none; border-radius: 10px; text-decoration: none; display: inline-block; font-weight: 600; margin: 10px}
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">❌</div>
    <h1>Ошибка оплаты</h1>
    <p>Попробуйте еще раз</p>
    <a href="https://t.me/stackwayai_bot" class="button">🔄 Повторить</a>
  </div>
</body>
</html>`
  return new Response(html, { headers: { "Content-Type": "text/html" } })
}
