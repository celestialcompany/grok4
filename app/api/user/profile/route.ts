import { withAuth, createApiResponse, type AuthenticatedRequest } from "@/lib/auth-middleware"
import { db } from "@/lib/firebase"
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore"

// GET /api/user/profile - Получить профиль пользователя
export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const userRef = doc(db, "users", req.user.uid)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      // Создаем профиль если не существует
      const newProfile = {
        uid: req.user.uid,
        email: req.user.email,
        displayName: req.user.displayName || "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        preferences: {
          language: "en",
          theme: "dark",
        },
      }

      await setDoc(userRef, newProfile)

      return createApiResponse({
        ...newProfile,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
    }

    const profile = {
      id: userSnap.id,
      ...userSnap.data(),
    }

    return createApiResponse(profile)
  } catch (error) {
    console.error("Error fetching profile:", error)
    return createApiResponse(null, "Failed to fetch profile", 500)
  }
})

// PUT /api/user/profile - Обновить профиль пользователя
export const PUT = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const updates = await req.json()

    // Разрешенные поля для обновления
    const allowedFields = ["displayName", "preferences"]
    const filteredUpdates = Object.keys(updates)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key]
        return obj
      }, {} as any)

    if (Object.keys(filteredUpdates).length === 0) {
      return createApiResponse(null, "No valid fields to update", 400)
    }

    const userRef = doc(db, "users", req.user.uid)

    await updateDoc(userRef, {
      ...filteredUpdates,
      updatedAt: serverTimestamp(),
    })

    // Получаем обновленный профиль
    const userSnap = await getDoc(userRef)
    const updatedProfile = {
      id: userSnap.id,
      ...userSnap.data(),
    }

    return createApiResponse(updatedProfile)
  } catch (error) {
    console.error("Error updating profile:", error)
    return createApiResponse(null, "Failed to update profile", 500)
  }
})
