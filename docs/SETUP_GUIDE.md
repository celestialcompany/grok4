# Руководство по настройке Grok 4 Chat API

## 🔧 Настройка Firebase

### 1. Firebase Client Configuration
Конфигурация уже настроена в `lib/firebase.ts`:

\`\`\`javascript
const firebaseConfig = {
  apiKey: "AIzaSyCeLoTRoRlx5gEtEzX5Y3RxPjHH07yXdVo",
  authDomain: "device-streaming-f1ff16f2.firebaseapp.com",
  projectId: "device-streaming-f1ff16f2",
  storageBucket: "device-streaming-f1ff16f2.firebasestorage.app",
  messagingSenderId: "910459454381",
  appId: "1:910459454381:web:067ba1f6470afd497dd724",
  measurementId: "G-G48W9Y7Y9G"
}
\`\`\`

### 2. Firebase Admin Setup
Для работы API на сервере нужно настроить Firebase Admin SDK.

#### Создание Service Account:
1. Перейдите в [Firebase Console](https://console.firebase.google.com/)
2. Выберите проект `device-streaming-f1ff16f2`
3. Перейдите в **Project Settings** → **Service Accounts**
4. Нажмите **Generate new private key**
5. Скачайте JSON файл с ключами

#### Настройка переменных окружения:
Добавьте в Vercel или `.env.local`:

\`\`\`env
FIREBASE_PROJECT_ID=device-streaming-f1ff16f2
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@device-streaming-f1ff16f2.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
\`\`\`

## 🗄️ Настройка Firestore

### Создание коллекций:
В Firebase Console → Firestore Database создайте следующие коллекции:

1. **users** - профили пользователей
2. **chats** - чаты пользователей  
3. **messages** - сообщения в чатах
4. **files** - загруженные файлы

### Правила безопасности Firestore:
\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Пользователи могут читать и писать только свои данные
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Чаты доступны только их владельцам
    match /chats/{chatId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Сообщения доступны только владельцам чатов
    match /messages/{messageId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Файлы доступны только их владельцам
    match /files/{fileId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
\`\`\`

## 🔐 Настройка Authentication

### Включение провайдеров:
В Firebase Console → Authentication → Sign-in method включите:

1. **Email/Password** ✅
2. **Google** ✅ 
3. **Anonymous** (опционально)

### Настройка домена:
Добавьте ваш домен в **Authorized domains**:
- `localhost` (для разработки)
- `your-domain.vercel.app` (для продакшена)

## 📦 Настройка Vercel Blob

### Получение токена:
1. Перейдите в [Vercel Dashboard](https://vercel.com/dashboard)
2. Выберите проект
3. Перейдите в **Settings** → **Environment Variables**
4. Найдите или создайте `BLOB_READ_WRITE_TOKEN`

### Переменная окружения:
\`\`\`env
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxx
\`\`\`

## 🚀 Развертывание

### 1. Vercel (рекомендуется)
\`\`\`bash
# Установка Vercel CLI
npm i -g vercel

# Развертывание
vercel --prod
\`\`\`

### 2. Переменные окружения в Vercel:
Добавьте все переменные через Vercel Dashboard:

\`\`\`env
# Firebase
FIREBASE_PROJECT_ID=device-streaming-f1ff16f2
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY=your-private-key

# Vercel Blob
BLOB_READ_WRITE_TOKEN=your-blob-token

# xAI (уже настроено)
XAI_API_KEY=your-xai-key
\`\`\`

## 🧪 Тестирование

### Локальное тестирование:
\`\`\`bash
# Запуск в режиме разработки
npm run dev

# Переход на страницу тестирования
http://localhost:3000/test
\`\`\`

### Тестирование API:
1. Войдите в систему
2. Перейдите на `/test`
3. Запустите тесты API
4. Проверьте результаты

### Проверка endpoints:
\`\`\`bash
# Публичный endpoint
curl http://localhost:3000/api/test

# Защищенный endpoint (нужен токен)
curl -H "Authorization: Bearer <token>" \
     -X POST \
     -H "Content-Type: application/json" \
     -d '{"test":"data"}' \
     http://localhost:3000/api/test
\`\`\`

## 📊 Мониторинг

### Логи в Vercel:
- Перейдите в **Functions** → **View Function Logs**
- Отслеживайте ошибки API

### Firebase Console:
- **Authentication** → активные пользователи
- **Firestore** → использование базы данных
- **Storage** → использование хранилища

## 🔍 Отладка

### Частые проблемы:

1. **"Firebase Admin not initialized"**
   - Проверьте переменные окружения
   - Убедитесь, что private key корректный

2. **"Unauthorized: Invalid token"**
   - Проверьте, что пользователь авторизован
   - Убедитесь, что токен передается правильно

3. **"Failed to fetch"**
   - Проверьте CORS настройки
   - Убедитесь, что API endpoint существует

### Включение debug логов:
\`\`\`javascript
// В lib/auth-middleware.ts
console.log('Auth token:', token)
console.log('Decoded token:', decodedToken)
\`\`\`

## ✅ Чек-лист готовности

- [ ] Firebase проект настроен
- [ ] Service Account создан
- [ ] Переменные окружения добавлены
- [ ] Firestore правила настроены
- [ ] Authentication провайдеры включены
- [ ] Vercel Blob настроен
- [ ] Проект развернут
- [ ] API тесты проходят
- [ ] Пользователи могут регистрироваться
- [ ] Чаты создаются и сохраняются
- [ ] Файлы загружаются

## 🆘 Поддержка

При возникновении проблем:
1. Проверьте логи в Vercel Dashboard
2. Убедитесь, что все переменные окружения настроены
3. Проверьте Firebase Console на наличие ошибок
4. Запустите тесты API на странице `/test`
