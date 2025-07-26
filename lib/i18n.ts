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
    listening: "Слушаю...",
    voiceInputError: "Ошибка голосового ввода",
    browserNotSupported: "Браузер не поддерживает голосовой ввод",
    creatingImage: "Создаю изображение...",
    imageGenerated: "Изображение создано!",
    imageGenerationError: "Ошибка создания изображения",
    downloadImage: "Скачать изображение",
    regenerateImage: "Создать заново",

    // Messages
    copied: "Скопировано!",
    copyError: "Не удалось скопировать",
    failedToCopy: "Не удалось скопировать",

    // Footer
    disclaimer: "Grok 4 может допускать ошибки. Рекомендуем проверять важную информацию.",
    allRightsReserved: "Все права защищены.",

    // Language
    language: "Язык",
    russian: "Русский",
    english: "English",

    // Loading
    loading: "Загрузка...",
    initializing: "Инициализация...",

    // Main Page
    latestModel: "Последняя модель",
    heroTitle: "Добро пожаловать в Grok 4: Ваш остроумный AI-компаньон",
    heroDescription:
      "Ощутите будущее AI с Grok 4, разработанным для продвинутого рассуждения, аналитики в реальном времени и немного бунтарского остроумия.",
    startChatting: "Начать чат",
    featuresTitle: "Раскройте мощь Grok 4",
    feature1Title: "Знания в реальном времени",
    feature1Description:
      "Grok 4 имеет доступ к самой актуальной информации, предоставляя вам свежие данные и осведомленность о текущих событиях.",
    feature2Title: "Продвинутое рассуждение",
    feature2Description: "Решайте сложные задачи с улучшенными логическими рассуждениями и многошаговым анализом.",
    feature3Title: "Режим прозрачного мышления",
    feature3Description:
      "Узнайте, как Grok 4 приходит к своим выводам, с помощью подробных, пошаговых блоков рассуждений.",
    feature4Title: "Уникальная личность",
    feature4Description: "Общайтесь с Grok 4, обладающим любопытным, остроумным и немного бунтарским характером.",
    feature5Title: "Генерация кода",
    feature5Description:
      "Grok 4 может помочь с генерацией кода, отладкой и пониманием сложных концепций программирования.",
    feature6Title: "Повышенная безопасность",
    feature6Description: "Создан с использованием надежных мер безопасности для защиты ваших данных и взаимодействий.",
    ctaTitle: "Готовы пообщаться с Grok 4?",
    ctaDescription: "Присоединяйтесь к беседе и исследуйте возможности новейшей модели AI от xAI.",
    benchmarksTitle: "Результаты тестов Grok 4",
    vendingBenchTitle: "Vending-Bench: Экономическая эффективность",
    vendingBenchDescription:
      "Сравнение моделей AI по показателям чистой стоимости и проданных единиц в симулированной экономической среде, демонстрирующее превосходство Grok 4.",
    vendingBenchAlt: "График производительности Grok 4 на Vending-Bench",
    humanityExamTitle: "Последний экзамен человечества: Общие знания",
    humanityExamDescription:
      "Результаты Grok 4 на комплексном экзамене, показывающие его выдающиеся способности в общих знаниях и рассуждениях по сравнению с другими моделями.",
    humanityExamAlt: "График производительности Grok 4 на экзамене 'Последний экзамен человечества'",
    termsOfService: "Условия использования",
    privacyPolicy: "Политика конфиденциальности",
    backToHome: "← На главную",
    termsIntro:
      "Добро пожаловать в StackWay. Эти Условия использования регулируют ваше использование нашего веб-сайта и услуг. Используя наш сервис, вы соглашаетесь соблюдать эти условия.",
    termsSection1Title: "Принятие Условий",
    termsSection1Content:
      "Получая доступ или используя StackWay, вы подтверждаете, что прочитали, поняли и согласны соблюдать настоящие Условия использования.",
    termsSection2Title: "Изменения в Условиях",
    termsSection2Content:
      "Мы оставляем за собой право изменять или заменять настоящие Условия в любое время по нашему усмотрению. Ваше дальнейшее использование сервиса после любых таких изменений означает ваше согласие с новыми условиями.",
    termsSection3Title: "Пользовательские аккаунты",
    termsSection3Content:
      "При создании аккаунта у нас вы должны всегда предоставлять точную, полную и актуальную информацию. Вы несете ответственность за сохранение конфиденциальности вашего пароля.",
    termsSection4Title: "Интеллектуальная собственность",
    termsSection4Content:
      "Сервис и его оригинальный контент, функции и функциональность являются и останутся исключительной собственностью StackWay и его лицензиаров.",
    termsSection5Title: "Прекращение действия",
    termsSection5Content:
      "Мы можем прекратить или приостановить ваш доступ к нашему сервису немедленно, без предварительного уведомления или ответственности, по любой причине, включая, помимо прочего, нарушение вами Условий.",
    termsConclusion:
      "Пожалуйста, ознакомьтесь с нашей Политикой конфиденциальности для получения дополнительной информации.",
    privacyIntro:
      "В StackWay мы ценим вашу конфиденциальность. Настоящая Политика конфиденциальности объясняет, как мы собираем, используем и раскрываем информацию о вас.",
    privacySection1Title: "Сбор информации",
    privacySection1Content:
      "Мы собираем информацию, которую вы предоставляете нам напрямую, когда вы создаете аккаунт, используете наши сервисы или общаетесь с нами. Это может включать ваше имя, адрес электронной почты, данные об использовании, а также содержание ваших взаимодействий с Grok 4.",
    privacySection2Title: "Использование информации",
    privacySection2Content:
      "Мы используем собранную информацию для предоставления, поддержания и улучшения наших услуг, для персонализации вашего опыта, для общения с вами и для обеспечения безопасности наших услуг. Ваши взаимодействия с Grok 4 могут использоваться для улучшения производительности модели и качества ответов.",
    privacySection3Title: "Раскрытие информации",
    privacySection3Content:
      "Мы не передаем вашу личную информацию третьим лицам, за исключением случаев, когда это необходимо для предоставления услуг (например, поставщикам облачных услуг и AI-моделей, таким как xAI), соблюдения закона или защиты наших прав. Мы гарантируем, что любые третьи стороны, которым мы передаем данные, соблюдают строгие стандарты конфиденциальности.",
    privacySection4Title: "Безопасность данных",
    privacySection4Content:
      "Мы принимаем разумные меры для защиты вашей информации от несанкционированного доступа, использования или раскрытия. Мы используем шифрование, контроль доступа и другие меры безопасности для защиты ваших данных. Однако ни один метод передачи через Интернет или электронного хранения не является на 100% безопасным.",
    privacySection5Title: "Ваши права",
    privacySection5Content:
      "Вы имеете право на доступ, исправление или удаление вашей личной информации. Вы также можете запросить ограничение обработки ваших данных или возразить против нее. Пожалуйста, свяжитесь с нами, если у вас есть какие-либо вопросы о вашей конфиденциальности или вы хотите воспользоваться своими правами.",
    privacyConclusion: "Используя наш сервис, вы соглашаетесь с этой Политикой конфиденциальности.",
    freeChatDisclaimer: "Общение с Grok 4 абсолютно бесплатно!",
    feedbackLiked: "Отзыв отправлен: Понравилось!",
    feedbackDisliked: "Отзыв отправлен: Не понравилось.",
    // New terms and privacy content
    termsSection6Title: "Поведение пользователя",
    termsSection6Content:
      "Вы соглашаетесь не использовать Сервис для любых незаконных или запрещенных настоящими Условиями целей. Вы не должны загружать, публиковать или передавать любой контент, который является незаконным, вредоносным, угрожающим, оскорбительным, клеветническим, вульгарным, непристойным или иным образом нежелательным.",
    termsSection7Title: "Отказ от гарантий",
    termsSection7Content:
      "Сервис предоставляется на условиях «как есть» и «как доступно». Мы не даем никаких гарантий, явных или подразумеваемых, в отношении работы Сервиса или информации, контента, материалов или продуктов, включенных в него.",
    termsSection8Title: "Ограничение ответственности",
    termsSection8Content:
      "Ни при каких обстоятельствах StackWay, его директора, сотрудников, партнеров, агентов, поставщики или аффилированные лица не несут ответственности за любые косвенные, случайные, специальные, последующие или штрафные убытки, включая, помимо прочего, потерю прибыли, данных, использования, деловой репутации или других нематериальных потерь, возникшие в результате (i) вашего доступа или использования или невозможности доступа или использования Сервиса; (ii) любого поведения или контента любой третьей стороны в Сервисе; (iii) любого контента, полученного из Сервиса; и (iv) несанкционированного доступа, использования или изменения ваших передач или контента, будь то на основании гарантии, контракта, деликта (включая халатность) или любой другой правовой теории, независимо от того, были ли мы проинформированы о возможности такого ущерба, и даже если средство правовой защиты, изложенное здесь, не достигло своей основной цели.",
    privacySection6Title: "Сторонние сервисы",
    privacySection6Content:
      "Наш Сервис может содержать ссылки на сторонние веб-сайты или сервисы, которые не принадлежат и не контролируются StackWay. Мы не несем ответственности за политику конфиденциальности или практику любых сторонних сайтов или сервисов. Мы настоятельно рекомендуем вам ознакомиться с политикой конфиденциальности каждого сайта, который вы посещаете.",
    privacySection77Content:
      "Мы можем обновлять нашу Политику конфиденциальности время от времени. Мы уведомим вас о любых изменениях, опубликовав новую Политику конфиденциальности на этой странице. Рекомендуется периодически просматривать эту Политику конфиденциальности на предмет изменений. Изменения в этой Политику конфиденциальности вступают в силу с момента их публикации на этой странице.",
    privacySection8Title: "Свяжитесь с нами",
    privacySection8Content:
      "Если у вас есть какие-либо вопросы об этой Политике конфиденциальности, пожалуйста, свяжитесь с нами по адресу support@stackway.tech.",
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
    listening: "Listening...",
    voiceInputError: "Voice input error",
    browserNotSupported: "Browser does not support voice input",
    creatingImage: "Creating image...",
    imageGenerated: "Image generated!",
    imageGenerationError: "Image generation error",
    downloadImage: "Download image",
    regenerateImage: "Regenerate",

    // Messages
    copied: "Copied!",
    copyError: "Failed to copy",
    failedToCopy: "Failed to copy",

    // Footer
    disclaimer: "Grok 4 can make mistakes. We recommend checking important information.",
    allRightsReserved: "All rights reserved.",

    // Language
    language: "Language",
    russian: "Русский",
    english: "English",

    // Loading
    loading: "Loading...",
    initializing: "Initializing...",

    // Main Page
    latestModel: "Latest Model",
    heroTitle: "Welcome to Grok 4: Your Witty AI Companion",
    heroDescription:
      "Experience the future of AI with Grok 4, designed for advanced reasoning, real-time insights, and a touch of rebellious wit.",
    startChatting: "Start Chatting",
    featuresTitle: "Unleash Grok 4's Power",
    feature1Title: "Real-time Knowledge",
    feature1Description:
      "Grok 4 has access to the latest information, providing you with up-to-date insights and current event awareness.",
    feature2Title: "Advanced Reasoning",
    feature2Description:
      "Tackle complex problems with Grok 4's enhanced logical reasoning and multi-step analysis capabilities.",
    feature3Title: "Transparent Thinking Mode",
    feature3Description: "See how Grok 4 arrives at its conclusions with detailed, step-by-step reasoning blocks.",
    feature4Title: "Unique Personality",
    feature4Description: "Engage in conversations with Grok 4's curious, witty, and slightly rebellious character.",
    feature5Title: "Code Generation",
    feature5Description:
      "Grok 4 can assist with code generation, debugging, and understanding complex programming concepts.",
    feature6Title: "Enhanced Security",
    feature6Description: "Built with robust security measures to protect your data and interactions.",
    ctaTitle: "Ready to Chat with Grok 4?",
    ctaDescription: "Join the conversation and explore the capabilities of the latest AI model from xAI.",
    benchmarksTitle: "Grok 4 Test Results",
    vendingBenchTitle: "Vending-Bench: Economic Efficiency",
    vendingBenchDescription:
      "A comparison of AI models on simulated economic performance metrics, showcasing Grok 4's superior capabilities in net worth and units sold.",
    vendingBenchAlt: "Grok 4 performance chart on Vending-Bench",
    humanityExamTitle: "Humanity's Last Exam: General Knowledge",
    humanityExamDescription:
      "Grok 4's results on a comprehensive general knowledge and reasoning exam, demonstrating its outstanding performance against other leading AI models.",
    humanityExamAlt: "Grok 4 performance chart on Humanity's Last Exam",
    termsOfService: "Terms of Service",
    privacyPolicy: "Privacy Policy",
    backToHome: "← Back to Home",
    termsIntro:
      "Welcome to StackWay. These Terms of Service govern your use of our website and services. By using our service, you agree to comply with these terms.",
    termsSection1Title: "Acceptance of Terms",
    termsSection1Content:
      "By accessing or using StackWay, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.",
    termsSection2Title: "Changes to Terms",
    termsSection2Content:
      "We reserve the right to modify or replace these Terms at any time at our sole discretion. Your continued use of the service after any such changes constitutes your acceptance of the new terms.",
    termsSection3Title: "User Accounts",
    termsSection3Content:
      "When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password that you use.",
    termsSection4Title: "Intellectual Property",
    termsSection4Content:
      "The Service and its original content, features, and functionality are and will remain the exclusive property of StackWay and its licensors.",
    termsSection5Title: "Termination",
    termsSection5Content:
      "We may terminate or suspend your access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.",
    termsConclusion: "Please refer to our Privacy Policy for more information.",
    privacyIntro:
      "At StackWay, we value your privacy. This Privacy Policy explains how we collect, use, and disclose information about you.",
    privacySection1Title: "Information Collection",
    privacySection1Content:
      "We collect information you provide directly to us when you create an account, use our services, or communicate with us. This may include your name, email address, usage data, and the content of your interactions with Grok 4.",
    privacySection2Title: "Use of Information",
    privacySection2Content:
      "We use the information we collect to provide, maintain, and improve our services, to personalize your experience, to communicate with you, and to ensure the security of our services. Your interactions with Grok 4 may be used to improve model performance and response quality.",
    privacySection3Title: "Information Disclosure",
    privacySection3Content:
      "We do not share your personal information with third parties except as necessary to provide our services (e.g., to cloud providers and AI model providers like xAI), comply with the law, or protect our rights. We ensure that any third parties we share data with adhere to strict confidentiality standards.",
    privacySection4Title: "Data Security",
    privacySection4Content:
      "We take reasonable measures to protect your information from unauthorized access, use, or disclosure. We use encryption, access controls, and other security measures to safeguard your data. However, no method of transmission over the Internet or electronic storage is 100% secure.",
    privacySection5Title: "Your Rights",
    privacySection5Content:
      "You have the right to access, correct, or delete your personal information. You may also request to restrict or object to the processing of your data. Please contact us if you have any questions about your privacy or wish to exercise your rights.",
    privacyConclusion: "By using our service, you agree to this Privacy Policy.",
    freeChatDisclaimer: "Chatting with Grok 4 is completely free!",
    feedbackLiked: "Feedback sent: Liked!",
    feedbackDisliked: "Feedback sent: Disliked.",
    // New terms and privacy content
    termsSection6Title: "User Conduct",
    termsSection6Content:
      "You agree not to use the Service for any unlawful purpose or any purpose prohibited by these Terms. You shall not upload, post, or transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable.",
    termsSection7Title: "Disclaimer of Warranties",
    termsSection7Content:
      "The Service is provided on an 'AS IS' and 'AS AVAILABLE' basis. We make no warranties, express or implied, regarding the operation of the Service or the information, content, materials, or products included on it.",
    termsSection8Title: "Limitation of Liability",
    termsSection8Content:
      "In no event shall StackWay, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.",
    privacySection6Title: "Third-Party Services",
    privacySection6Content:
      "Our Service may contain links to third-party websites or services that are not owned or controlled by StackWay. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services. We strongly advise you to review the Privacy Policy of every site you visit.",
    privacySection77Content:
      "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.",
    privacySection8Title: "Contact Us",
    privacySection8Content:
      "If you have any questions about this Privacy Policy, please contact us at support@stackway.tech.",
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
