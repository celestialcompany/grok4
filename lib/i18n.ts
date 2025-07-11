export const translations = {
  ru: {
    // Auth
    welcome: "Добро пожаловать",
    signIn: "Вход",
    signUp: "Регистрация",
    email: "Email",
    password: "Пароль",
    fullName: "Полное имя",
    forgotPassword: "Забыли пароль?",
    resetPassword: "Восстановление пароля",
    sendResetEmail: "Отправить письмо",
    backToSignIn: "← Вернуться к входу",
    signInWithGoogle: "Войти через Google",
    signUpWithGoogle: "Зарегистрироваться через Google",
    or: "или",

    // Auth descriptions
    authDescription: "Войдите, чтобы начать общение с AI",
    authWelcomeDescription: "Войдите в свой аккаунт или создайте новый",
    resetPasswordDescription: "Введите ваш email для получения ссылки восстановления",

    // Auth placeholders
    emailPlaceholder: "Введите ваш email",
    passwordPlaceholder: "Введите пароль",
    passwordMinPlaceholder: "Пароль (минимум 6 символов)",
    fullNamePlaceholder: "Введите полное имя",
    resetEmailPlaceholder: "Email для восстановления",

    // Auth buttons
    signInButton: "Войти",
    signUpButton: "Зарегистрироваться",
    signingIn: "Выполняется вход...",
    signingUp: "Создание аккаунта...",
    sendingReset: "Отправляем письмо...",

    // Auth validation
    emailRequired: "Email обязателен",
    passwordRequired: "Пароль обязателен",
    passwordTooShort: "Пароль должен содержать минимум 6 символов",
    fullNameRequired: "Полное имя обязательно",

    // Auth success messages
    accountCreated: "Аккаунт успешно создан!",
    welcomeBack: "Добро пожаловать!",
    resetEmailSent: "Письмо для восстановления пароля отправлено!",
    checkYourEmail: "Проверьте вашу почту",
    signedOut: "Вы вышли из аккаунта",

    // Auth error messages
    registrationError: "Ошибка при регистрации",
    signInError: "Ошибка при входе",
    googleSignInError: "Ошибка входа через Google",
    resetPasswordError: "Ошибка отправки письма",
    signOutError: "Ошибка при выходе",
    invalidEmail: "Неверный формат email",
    weakPassword: "Слишком простой пароль",
    emailAlreadyInUse: "Email уже используется",
    userNotFound: "Пользователь не найден",
    wrongPassword: "Неверный пароль",
    tooManyRequests: "Слишком много попыток. Попробуйте позже",

    // Chat
    hello: "Привет",
    helloUser: "Привет, {name}!",
    howCanIHelp: "Чем могу помочь?",
    askSomething: "Спросите что-нибудь...",
    you: "Вы",
    grok: "Grok",
    share: "Поделиться",
    settings: "Настройки",
    signOut: "Выйти",
    stopGeneration: "Остановить генерацию",
    generating: "Генерирую ответ...",
    generationStopped: "Генерация остановлена",

    // File upload
    filesUploaded: "Загружено файлов: {count}",
    uploadError: "Ошибка загрузки {fileName}",

    // Messages
    copied: "Скопировано!",
    copyError: "Не удалось скопировать",
    failedToCopy: "Не удалось скопировать",

    // Footer
    disclaimer: "Grok 4 может допускать ошибки. Рекомендуем проверять важную информацию.",

    // Language
    language: "Язык",
    russian: "Русский",
    english: "English",

    // Loading
    loading: "Загрузка...",
    initializing: "Инициализация...",
    multimodal: {
      attachedFiles: "Прикрепленные файлы",
      fileUploaded: "Файл загружен",
      fileAnalysis: "Анализ файла",
      analyzing: "Анализирую...",
      imageAnalysis: "Анализ изображения",
      videoAnalysis: "Анализ видео",
      audioAnalysis: "Анализ аудио",
      documentAnalysis: "Анализ документа",
      unsupportedFile: "Неподдерживаемый тип файла",
      fileTooLarge: "Файл слишком большой",
      maxFileSize: "Максимальный размер файла",
      dragDropFiles: "Перетащите файлы сюда или нажмите для выбора",
      supportedFormats: "Поддерживаемые форматы",
      preview: "Предварительный просмотр",
      metadata: "Метаданные",
      aiAnalysis: "Анализ ИИ",
      confidence: "Уверенность",
      detectedObjects: "Обнаруженные объекты",
      mainColors: "Основные цвета",
      extractedText: "Извлеченный текст",
      duration: "Длительность",
      resolution: "Разрешение",
      fileSize: "Размер файла",
      fileType: "Тип файла",
    },
  },
  en: {
    // Auth
    welcome: "Welcome",
    signIn: "Sign In",
    signUp: "Sign Up",
    email: "Email",
    password: "Password",
    fullName: "Full Name",
    forgotPassword: "Forgot password?",
    resetPassword: "Reset Password",
    sendResetEmail: "Send Reset Email",
    backToSignIn: "← Back to Sign In",
    signInWithGoogle: "Sign in with Google",
    signUpWithGoogle: "Sign up with Google",
    or: "or",

    // Auth descriptions
    authDescription: "Sign in to start chatting with AI",
    authWelcomeDescription: "Sign in to your account or create a new one",
    resetPasswordDescription: "Enter your email to receive a reset link",

    // Auth placeholders
    emailPlaceholder: "Enter your email",
    passwordPlaceholder: "Enter password",
    passwordMinPlaceholder: "Password (minimum 6 characters)",
    fullNamePlaceholder: "Enter your full name",
    resetEmailPlaceholder: "Email for password reset",

    // Auth buttons
    signInButton: "Sign In",
    signUpButton: "Sign Up",
    signingIn: "Signing in...",
    signingUp: "Creating account...",
    sendingReset: "Sending email...",

    // Auth validation
    emailRequired: "Email is required",
    passwordRequired: "Password is required",
    passwordTooShort: "Password must be at least 6 characters",
    fullNameRequired: "Full name is required",

    // Auth success messages
    accountCreated: "Account created successfully!",
    welcomeBack: "Welcome back!",
    resetEmailSent: "Password reset email sent!",
    checkYourEmail: "Check your email",
    signedOut: "You have signed out",

    // Auth error messages
    registrationError: "Registration error",
    signInError: "Sign in error",
    googleSignInError: "Google sign in error",
    resetPasswordError: "Reset email error",
    signOutError: "Sign out error",
    invalidEmail: "Invalid email format",
    weakPassword: "Password is too weak",
    emailAlreadyInUse: "Email already in use",
    userNotFound: "User not found",
    wrongPassword: "Wrong password",
    tooManyRequests: "Too many requests. Try again later",

    // Chat
    hello: "Hello",
    helloUser: "Hello, {name}!",
    howCanIHelp: "How can I help you?",
    askSomething: "Ask something...",
    you: "You",
    grok: "Grok",
    share: "Share",
    settings: "Settings",
    signOut: "Sign Out",
    stopGeneration: "Stop generation",
    generating: "Generating response...",
    generationStopped: "Generation stopped",

    // File upload
    filesUploaded: "Files uploaded: {count}",
    uploadError: "Upload error {fileName}",

    // Messages
    copied: "Copied!",
    copyError: "Failed to copy",
    failedToCopy: "Failed to copy",

    // Footer
    disclaimer: "Grok 4 can make mistakes. We recommend checking important information.",

    // Language
    language: "Language",
    russian: "Русский",
    english: "English",

    // Loading
    loading: "Loading...",
    initializing: "Initializing...",
    multimodal: {
      attachedFiles: "Attached files",
      fileUploaded: "File uploaded",
      fileAnalysis: "File analysis",
      analyzing: "Analyzing...",
      imageAnalysis: "Image analysis",
      videoAnalysis: "Video analysis",
      audioAnalysis: "Audio analysis",
      documentAnalysis: "Document analysis",
      unsupportedFile: "Unsupported file type",
      fileTooLarge: "File too large",
      maxFileSize: "Maximum file size",
      dragDropFiles: "Drag files here or click to select",
      supportedFormats: "Supported formats",
      preview: "Preview",
      metadata: "Metadata",
      aiAnalysis: "AI Analysis",
      confidence: "Confidence",
      detectedObjects: "Detected objects",
      mainColors: "Main colors",
      extractedText: "Extracted text",
      duration: "Duration",
      resolution: "Resolution",
      fileSize: "File size",
      fileType: "File type",
    },
  },
} as const

export type Language = keyof typeof translations
export type TranslationKey = keyof typeof translations.en

// Функция для определения языка браузера
export const getBrowserLanguage = (): Language => {
  if (typeof window === "undefined") return "en"

  const browserLang = navigator.language.toLowerCase()

  // Проверяем русский язык
  if (browserLang.startsWith("ru")) return "ru"

  // По умолчанию английский
  return "en"
}

// Функция для определения языка по геолокации (упрощенная версия)
export const getLanguageByLocation = async (): Promise<Language> => {
  try {
    // Используем API для определения страны по IP
    const response = await fetch("https://ipapi.co/json/")
    const data = await response.json()

    // Русскоязычные страны
    const russianSpeakingCountries = ["RU", "BY", "KZ", "KG", "TJ", "UZ", "UA"]

    if (russianSpeakingCountries.includes(data.country_code)) {
      return "ru"
    }

    return "en"
  } catch (error) {
    // Если не удалось определить по геолокации, используем язык браузера
    return getBrowserLanguage()
  }
}

// Функция для интерполяции строк
export const interpolate = (template: string, values: Record<string, string | number>): string => {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return values[key]?.toString() || match
  })
}
