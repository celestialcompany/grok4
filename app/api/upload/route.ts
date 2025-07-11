import { put } from "@vercel/blob"
import { withAuth, createApiResponse, type AuthenticatedRequest } from "@/lib/auth-middleware"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { validateFile, getFileCategory } from "@/lib/multimodal-utils"

/**
 * Recursively removes undefined values from PLAIN objects.
 * Firestore sentinels (FieldValueImpl) keep their prototype,
 * so we ignore every non-plain object.
 */
function stripUndefined(obj: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => {
        const isPlain = typeof v === "object" && v !== null && v.constructor?.name === "Object" // FieldValueImpl !== 'Object'
        return [k, isPlain ? stripUndefined(v as Record<string, any>) : v]
      }),
  )
}

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) return createApiResponse(null, "No file provided", 400)

    // 1️⃣ basic validation
    const { valid, error } = validateFile(file)
    if (!valid) return createApiResponse(null, error, 400)

    const category = getFileCategory(file.type)
    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`

    // 2️⃣ upload to Vercel Blob
    const blob = await put(safeName, file, { access: "public", addRandomSuffix: true })

    // 3️⃣ lightweight metadata (no huge arrayBuffer reads)
    const metadata = stripUndefined({
      originalName: file.name,
      category,
      format: file.type.split("/")[1],
    })

    // 4️⃣ build Firestore document (we don’t touch sentinels)
    const fileDoc = {
      name: file.name,
      url: blob.url,
      type: file.type,
      size: file.size,
      category,
      metadata, // already sanitised
      userId: req.user.uid,
      uploadedAt: serverTimestamp(), // keep sentinel intact
    }

    const docRef = await addDoc(collection(db, "files"), fileDoc)

    return createApiResponse({ id: docRef.id, ...fileDoc, uploadedAt: Date.now() }, undefined, 201)
  } catch (err) {
    console.error("Upload route error:", err)
    // surface the error message back to the browser
    return createApiResponse(null, (err as Error).message || "Upload failed", 500)
  }
})
