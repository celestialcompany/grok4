export async function GET() {
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Оплата успешна</title>
  <meta charset="UTF-8">
  <style>
    body {font-family: Arial; background: linear-gradient(135deg, #667eea, #764ba2); margin: 0; padding: 20px; min-height: 100vh; display: flex; align-items: center; justify-content: center}
    .container {background: white; padding: 40px; border-radius: 20px; text-align: center; max-width: 400px}
    .icon {font-size: 64px; margin-bottom: 20px}
    h1 {color: #2d3748; margin-bottom: 10px}
    p {color: #4a5568; margin-bottom: 30px}
    .button {background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 15px 30px; border: none; border-radius: 10px; text-decoration: none; display: inline-block; font-weight: 600}
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">✅</div>
    <h1>Платеж успешен!</h1>
    <p>Изображения добавлены на баланс</p>
    <a href="https://t.me/stackwayai_bot" class="button">🎨 В бот</a>
  </div>
</body>
</html>`
  return new Response(html, { headers: { "Content-Type": "text/html" } })
}
