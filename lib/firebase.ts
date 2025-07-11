import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getAnalytics } from "firebase/analytics"

const firebaseConfig = {
  apiKey: "AIzaSyCeLoTRoRlx5gEtEzX5Y3RxPjHH07yXdVo",
  authDomain: "device-streaming-f1ff16f2.firebaseapp.com",
  projectId: "device-streaming-f1ff16f2",
  storageBucket: "device-streaming-f1ff16f2.firebasestorage.app",
  messagingSenderId: "910459454381",
  appId: "1:910459454381:web:067ba1f6470afd497dd724",
  measurementId: "G-G48W9Y7Y9G",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Initialize Analytics (only in browser)
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null

export default app
