# Grok 4 Chat API Documentation

## Обзор

Grok 4 Chat API предоставляет полный набор endpoints для управления чатами, сообщениями, пользователями и файлами. API использует Firebase Authentication для авторизации и Firestore для хранения данных.

## Базовый URL

\`\`\`
https://your-domain.com/api
\`\`\`

## Аутентификация

Все API endpoints требуют аутентификации через Firebase ID Token. Токен должен быть передан в заголовке Authorization:

\`\`\`
Authorization: Bearer <firebase-id-token>
\`\`\`

## Общий формат ответов

Все API endpoints возвращают JSON в следующем формате:

\`\`\`json
{
"success": boolean,
"data": any,      // Присутствует при success: true
"error": string   // Присутствует при success: false
}
\`\`\`

## Коды состояния HTTP

- `200` - Успешный запрос
- `201` - Ресурс создан
- `400` - Неверный запрос
- `401` - Не авторизован
- `403` - Доступ запрещен
- `404` - Ресурс не найден
- `500` - Внутренняя ошибка сервера

---

## Чаты (Chats)

### GET /api/chats

Получить все чаты пользователя.

**Ответ:**
\`\`\`json
{
"success": true,
"data": [
  {
    "id": "chat_id",
    "title": "Название чата",
    "userId": "user_id",
    "createdAt": 1234567890,
    "updatedAt": 1234567890,
    "messageCount": 5,
    "lastMessage": "Последнее сообщение..."
  }
]
}
\`\`\`

### POST /api/chats

Создать новый чат.

**Тело запроса:**
\`\`\`json
{
"title": "Название нового чата"
}
\`\`\`

**Ответ:**
\`\`\`json
{
"success": true,
"data": {
  "id": "new_chat_id",
  "title": "Название нового чата",
  "userId": "user_id",
  "createdAt": 1234567890,
  "updatedAt": 1234567890,
  "messageCount": 0
}
}
\`\`\`

### GET /api/chats/{chatId}

Получить конкретный чат.

**Параметры:**
- `chatId` - ID чата

**Ответ:**
\`\`\`json
{
"success": true,
"data": {
  "id": "chat_id",
  "title": "Название чата",
  "userId": "user_id",
  "createdAt": 1234567890,
  "updatedAt": 1234567890,
  "messageCount": 5
}
}
\`\`\`

### PUT /api/chats/{chatId}

Обновить чат.

**Параметры:**
- `chatId` - ID чата

**Тело запроса:**
\`\`\`json
{
"title": "Новое название чата"
}
\`\`\`

**Ответ:**
\`\`\`json
{
"success": true,
"data": {
  "id": "chat_id",
  "title": "Новое название чата",
  "userId": "user_id",
  "createdAt": 1234567890,
  "updatedAt": 1234567891,
  "messageCount": 5
}
}
\`\`\`

### DELETE /api/chats/{chatId}

Удалить чат.

**Параметры:**
- `chatId` - ID чата

**Ответ:**
\`\`\`json
{
"success": true,
"data": {
  "message": "Chat deleted successfully"
}
}
\`\`\`

---

## Сообщения (Messages)

### GET /api/chats/{chatId}/messages

Получить сообщения чата.

**Параметры:**
- `chatId` - ID чата

**Query параметры:**
- `limit` - Количество сообщений (по умолчанию: 50)
- `offset` - Смещение (по умолчанию: 0)

**Ответ:**
\`\`\`json
{
"success": true,
"data": [
  {
    "id": "message_id",
    "content": "Текст сообщения",
    "role": "user",
    "chatId": "chat_id",
    "userId": "user_id",
    "timestamp": 1234567890
  }
]
}
\`\`\`

### POST /api/chats/{chatId}/messages

Создать новое сообщение.

**Параметры:**
- `chatId` - ID чата

**Тело запроса:**
\`\`\`json
{
"content": "Текст сообщения",
"role": "user"
}
\`\`\`

**Ответ:**
\`\`\`json
{
"success": true,
"data": {
  "id": "new_message_id",
  "content": "Текст сообщения",
  "role": "user",
  "chatId": "chat_id",
  "userId": "user_id",
  "timestamp": 1234567890
}
}
\`\`\`

---

## Профиль пользователя (User Profile)

### GET /api/user/profile

Получить профиль пользователя.

**Ответ:**
\`\`\`json
{
"success": true,
"data": {
  "uid": "user_id",
  "email": "user@example.com",
  "displayName": "Имя пользователя",
  "photoURL": "https://example.com/photo.jpg",
  "createdAt": 1234567890,
  "updatedAt": 1234567890,
  "preferences": {
    "language": "ru",
    "theme": "dark"
  }
}
}
\`\`\`

### PUT /api/user/profile

Обновить профиль пользователя.

**Тело запроса:**
\`\`\`json
{
"displayName": "Новое имя",
"preferences": {
  "language": "en",
  "theme": "light"
}
}
\`\`\`

**Ответ:**
\`\`\`json
{
"success": true,
"data": {
  "uid": "user_id",
  "email": "user@example.com",
  "displayName": "Новое имя",
  "createdAt": 1234567890,
  "updatedAt": 1234567891,
  "preferences": {
    "language": "en",
    "theme": "light"
  }
}
}
\`\`\`

---

## Аналитика (Analytics)

### GET /api/analytics/usage

Получить статистику использования.

**Ответ:**
\`\`\`json
{
"success": true,
"data": {
  "totalChats": 10,
  "totalMessages": 150,
  "totalFiles": 5,
  "averageMessagesPerChat": 15,
  "recentChats": [
    {
      "id": "chat_id",
      "title": "Последний чат",
      "updatedAt": 1234567890
    }
  ]
}
}
\`\`\`

---

## Обработка ошибок

### Типичные ошибки

**401 Unauthorized:**
\`\`\`json
{
"success": false,
"error": "Unauthorized: Missing or invalid token"
}
\`\`\`

**403 Forbidden:**
\`\`\`json
{
"success": false,
"error": "Access denied"
}
\`\`\`

**404 Not Found:**
\`\`\`json
{
"success": false,
"error": "Chat not found"
}
\`\`\`

**400 Bad Request:**
\`\`\`json
{
"success": false,
"error": "Title is required"
}
\`\`\`

**500 Internal Server Error:**
\`\`\`json
{
"success": false,
"error": "Failed to create chat"
}
\`\`\`

---

## Примеры использования

### JavaScript/TypeScript

\`\`\`typescript
import { apiClient } from '@/lib/api-client'

// Установить пользователя
apiClient.setUser(firebaseUser)

// Получить чаты
const response = await apiClient.getChats()
if (response.success) {
console.log('Чаты:', response.data)
} else {
console.error('Ошибка:', response.error)
}

// Создать чат
const newChat = await apiClient.createChat('Новый чат')

// Загрузить файл
const file = document.getElementById('file').files[0]
const uploadResult = await apiClient.uploadFile(file)
\`\`\`

### cURL

\`\`\`bash
# Получить чаты
curl -H "Authorization: Bearer <token>" \
   https://your-domain.com/api/chats

# Создать чат
curl -X POST \
   -H "Authorization: Bearer <token>" \
   -H "Content-Type: application/json" \
   -d '{"title":"Новый чат"}' \
   https://your-domain.com/api/chats

# Загрузить файл
curl -X POST \
   -H "Authorization: Bearer <token>" \
   -F "file=@document.pdf" \
   https://your-domain.com/api/upload
\`\`\`

---

## Переменные окружения

Для работы API необходимы следующие переменные окружения:

\`\`\`env
# Firebase Admin
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY=your-private-key

# Vercel Blob
BLOB_READ_WRITE_TOKEN=your-blob-token
\`\`\`

---

## Лимиты и ограничения

- **Размер файла**: максимум 10MB
- **Количество чатов**: без ограничений
- **Количество сообщений**: без ограничений
- **Rate limiting**: 100 запросов в минуту на пользователя
- **Типы файлов**: изображения, PDF, текст, Word документы

---

## Версионирование

Текущая версия API: **v1**

При внесении breaking changes будет создана новая версия с соответствующим префиксом в URL.
