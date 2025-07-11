"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { auth } from "@/lib/firebase"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  updateProfile,
  sendPasswordResetEmail,
  signInWithPopup,
} from "firebase/auth"
import { toast } from "sonner"
import { Eye, EyeOff, Mail, Lock, User, Bot } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import LanguageSwitcher from "@/components/language-switcher" // Import LanguageSwitcher

export default function AuthForm() {
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isResetMode, setIsResetMode] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)

      // Обновляем профиль пользователя с именем
      if (formData.fullName) {
        await updateProfile(userCredential.user, {
          displayName: formData.fullName,
        })
      }

      toast.success(t("accountCreated"))
    } catch (error: any) {
      console.error("Ошибка регистрации:", error)
      let errorMessage = t("registrationError")

      // Более точные сообщения об ошибках
      if (error.code === "auth/email-already-in-use") {
        errorMessage = t("emailAlreadyInUse")
      } else if (error.code === "auth/weak-password") {
        errorMessage = t("weakPassword")
      } else if (error.code === "auth/invalid-email") {
        errorMessage = t("invalidEmail")
      }

      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password)
      toast.success(t("welcomeBack"))
    } catch (error: any) {
      console.error("Ошибка входа:", error)
      let errorMessage = t("signInError")

      // Более точные сообщения об ошибках
      if (error.code === "auth/user-not-found") {
        errorMessage = t("userNotFound")
      } else if (error.code === "auth/wrong-password") {
        errorMessage = t("wrongPassword")
      } else if (error.code === "auth/invalid-email") {
        errorMessage = t("invalidEmail")
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = t("tooManyRequests")
      }

      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      toast.success(t("welcomeBack"))
    } catch (error: any) {
      console.error("Ошибка входа через Google:", error)
      toast.error(t(error.message) || "Произошла ошибка при входе через Google")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await sendPasswordResetEmail(auth, resetEmail)
      toast.success(t("resetEmailSent"))
      setIsResetMode(false)
      setResetEmail("")
    } catch (error: any) {
      console.error("Ошибка восстановления пароля:", error)
      let errorMessage = t("resetPasswordError")

      // Более точные сообщения об ошибках
      if (error.code === "auth/user-not-found") {
        errorMessage = t("userNotFound")
      } else if (error.code === "auth/invalid-email") {
        errorMessage = t("invalidEmail")
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = t("tooManyRequests")
      }

      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#212121] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-end mb-4">
          {" "}
          {/* Added container for LanguageSwitcher */}
          <LanguageSwitcher />
        </div>
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Bot className="h-8 w-8 text-green-500" />
            <h1 className="text-3xl font-bold text-white">Grok 4</h1>
          </div>
          <p className="text-gray-400">{isResetMode ? t("resetPassword") : t("authDescription")}</p>
        </div>

        <Card className="bg-[#2f2f2f] border-gray-600">
          <CardHeader>
            <CardTitle className="text-white text-center">{isResetMode ? t("resetPassword") : t("welcome")}</CardTitle>
            <CardDescription className="text-gray-400 text-center">
              {isResetMode ? t("resetPasswordDescription") : t("authWelcomeDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isResetMode ? (
              <div className="space-y-4">
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="email"
                        placeholder={t("resetEmailPlaceholder")}
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        required
                        className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                    {isLoading ? t("sendingReset") : t("sendResetEmail")}
                  </Button>
                </form>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-gray-400 hover:text-white"
                  onClick={() => {
                    setIsResetMode(false)
                    setResetEmail("")
                  }}
                >
                  {t("backToSignIn")}
                </Button>
              </div>
            ) : (
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-700">
                  <TabsTrigger value="signin" className="text-white data-[state=active]:bg-gray-600">
                    {t("signIn")}
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="text-white data-[state=active]:bg-gray-600">
                    {t("signUp")}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="space-y-4">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          type="email"
                          name="email"
                          placeholder={t("emailPlaceholder")}
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder={t("passwordPlaceholder")}
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          className="pl-10 pr-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-2 h-6 w-6 p-0 text-gray-400 hover:text-white"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white p-0 h-auto"
                        onClick={() => setIsResetMode(true)}
                      >
                        {t("forgotPassword")}
                      </Button>
                    </div>

                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                      {isLoading ? t("signingIn") : t("signInButton")}
                    </Button>
                  </form>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-[#2f2f2f] px-2 text-gray-400">{t("or")}</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-gray-600 text-white hover:bg-gray-700 bg-transparent"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    {t("signInWithGoogle")}
                  </Button>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          type="text"
                          name="fullName"
                          placeholder={t("fullNamePlaceholder")}
                          value={formData.fullName}
                          onChange={handleInputChange}
                          required
                          className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          type="email"
                          name="email"
                          placeholder={t("emailPlaceholder")}
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder={t("passwordMinPlaceholder")}
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          minLength={6}
                          className="pl-10 pr-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-2 h-6 w-6 p-0 text-gray-400 hover:text-white"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                      {isLoading ? t("signingUp") : t("signUpButton")}
                    </Button>
                  </form>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-[#2f2f2f] px-2 text-gray-400">{t("or")}</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-gray-600 text-white hover:bg-gray-700 bg-transparent"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    {t("signUpWithGoogle")}
                  </Button>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
