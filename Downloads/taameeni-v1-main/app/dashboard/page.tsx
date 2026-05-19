"use client"

import { useEffect, useMemo, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth"
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Shield, Users, Bell, FileText, LogOut, Loader2, Activity } from "lucide-react"

type DashboardRecord = Record<string, any> & { id?: string }

const formatDate = (value?: string) => {
  if (!value) return "-"

  try {
    return new Intl.DateTimeFormat("ar-SA", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value))
  } catch {
    return value
  }
}

const isRecent = (value?: string) => {
  if (!value) return false

  const timestamp = new Date(value).getTime()
  return Number.isFinite(timestamp) && Date.now() - timestamp < 10 * 60 * 1000
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loadingAuth, setLoadingAuth] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState("")
  const [loggingIn, setLoggingIn] = useState(false)
  const [visitors, setVisitors] = useState<DashboardRecord[]>([])
  const [orders, setOrders] = useState<DashboardRecord[]>([])
  const [notifications, setNotifications] = useState<DashboardRecord[]>([])
  const [onlineVisitors, setOnlineVisitors] = useState<DashboardRecord[]>([])

  useEffect(() => {
    if (!auth) {
      setLoadingAuth(false)
      return
    }

    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoadingAuth(false)
    })
  }, [])

  useEffect(() => {
    if (!db || !user) return

    console.log("[Dashboard] 🔗 subscribing to Firestore: visitors, pays, orders, notifications")

    // visitors = primary write target in addData()
    // pays = secondary write (backward compat)
    // Merge both by doc id to avoid duplicates
    const visitorsQuery      = query(collection(db, "visitors"),      orderBy("updatedAt", "desc"), limit(100))
    const paysQuery          = query(collection(db, "pays"),          orderBy("updatedAt", "desc"), limit(100))
    const ordersQuery        = query(collection(db, "orders"),        orderBy("updatedAt", "desc"), limit(100))
    const notificationsQuery = query(collection(db, "notifications"), orderBy("createdAt", "desc"), limit(50))

    const visitorsMap = new Map<string, DashboardRecord>()
    const flushVisitors = (label: string) => {
      const merged = Array.from(visitorsMap.values()).sort(
        (a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || ""))
      )
      setVisitors(merged)
      setOnlineVisitors(merged.filter((r) => Boolean(r.online) || isRecent(r.lastSeenAt)))
      console.log(`[Dashboard] ✅ ${label} → visitors=${merged.length}`)
    }

    const unsubscribeVisitors = onSnapshot(visitorsQuery, (snapshot) => {
      snapshot.docs.forEach((item) => visitorsMap.set(item.id, { id: item.id, ...item.data() }))
      flushVisitors("visitors")
    })

    const unsubscribePays = onSnapshot(paysQuery, (snapshot) => {
      snapshot.docs.forEach((item) => visitorsMap.set(item.id, { id: item.id, ...item.data() }))
      flushVisitors("pays")
    })

    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      const next: DashboardRecord[] = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
      setOrders(next)
      console.log(`[Dashboard] ✅ orders → count=${next.length}`)
    })

    const unsubscribeNotifications = onSnapshot(notificationsQuery, (snapshot) => {
      const next: DashboardRecord[] = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
      setNotifications(next)
      console.log(`[Dashboard] ✅ notifications → count=${next.length}`)
    })

    return () => {
      unsubscribeVisitors()
      unsubscribePays()
      unsubscribeOrders()
      unsubscribeNotifications()
    }
  }, [user])

  const stats = useMemo(() => {
    const pendingOrders = orders.filter((record) => {
      const status = String(record.status || record.approval || record.phoneVerificationStatus || "").toLowerCase()
      return status.includes("pending") || status.includes("waiting") || status.includes("جاري")
    }).length

    return [
      {
        label: "الزوار",
        value: visitors.length,
        hint: `${onlineVisitors.length} متصل الآن`,
        icon: Users,
      },
      {
        label: "الطلبات",
        value: orders.length,
        hint: `${pendingOrders} قيد المراجعة`,
        icon: FileText,
      },
      {
        label: "الإشعارات",
        value: notifications.length,
        hint: "تحديثات فورية",
        icon: Bell,
      },
      {
        label: "النشاط المباشر",
        value: onlineVisitors.length,
        hint: "آخر 10 دقائق",
        icon: Activity,
      },
    ]
  }, [visitors.length, orders.length, notifications.length, onlineVisitors.length])

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAuthError("")

    if (!auth) {
      setAuthError("Firebase Auth غير مهيأ. تحقق من متغيرات البيئة.")
      return
    }

    setLoggingIn(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.refresh()
    } catch (error) {
      setAuthError("فشل تسجيل الدخول. تحقق من البريد وكلمة المرور وصلاحيات Firebase Auth.")
      console.error(error)
    } finally {
      setLoggingIn(false)
    }
  }

  const handleLogout = async () => {
    if (!auth) return
    await signOut(auth)
  }

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-[#0b0d10] text-white flex items-center justify-center px-4">
        <div className="flex items-center gap-3 text-white/70">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>جاري تحميل لوحة التحكم...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.06),_transparent_35%),linear-gradient(180deg,#0b0d10_0%,#11151b_100%)] text-white px-4 py-10">
        <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold">لوحة التحكم</h1>
            <p className="mt-2 text-sm text-white/60">تسجيل دخول Firebase لإدارة الزوار والطلبات والإشعارات</p>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="البريد الإلكتروني"
              className="h-12 border-white/10 bg-white/5 text-white placeholder:text-white/40"
            />
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="كلمة المرور"
              className="h-12 border-white/10 bg-white/5 text-white placeholder:text-white/40"
            />

            {authError && <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{authError}</div>}

            <Button type="submit" disabled={loggingIn} className="h-12 w-full rounded-2xl bg-white text-slate-950 hover:bg-white/90">
              {loggingIn ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري الدخول...
                </>
              ) : (
                "دخول"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-white/45">
            إذا لم يعمل الدخول، فعّل Email/Password من Firebase Auth واستخدم بيانات المسؤول.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_28%),linear-gradient(180deg,#0b0d10_0%,#11151b_100%)] text-white">
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/45">Taameeni Control</p>
            <h1 className="mt-1 text-2xl font-semibold">لوحة التحكم الحية</h1>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-white/10 bg-white/5 px-3 py-1 text-white">
              {user.email || "Admin"}
            </Badge>
            <Button variant="outline" onClick={handleLogout} className="border-white/10 bg-white/5 text-white hover:bg-white/10">
              <LogOut className="ml-2 h-4 w-4" />
              خروج
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon

            return (
              <Card key={item.label} className="border-white/10 bg-white/5 text-white shadow-2xl backdrop-blur-xl">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-white/55">{item.label}</p>
                      <div className="mt-2 text-3xl font-semibold">{item.value}</div>
                      <p className="mt-2 text-xs text-white/45">{item.hint}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          <Card className="border-white/10 bg-white/5 text-white shadow-2xl backdrop-blur-xl xl:col-span-2">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">الزوار والطلبات</h2>
                  <p className="text-sm text-white/45">تحديث مباشر من Firestore</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <h3 className="mb-3 text-sm font-semibold text-white/70">أحدث الزوار</h3>
                  <div className="space-y-3">
                    {visitors.length === 0 ? (
                      <div className="rounded-xl border border-white/5 bg-white/5 p-4 text-center text-sm text-white/40">لا يوجد زوار بعد</div>
                    ) : visitors.slice(0, 5).map((visitor) => (
                      <div key={visitor.id} className="rounded-xl border border-white/5 bg-white/5 p-3 text-sm">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-medium truncate max-w-[120px]" title={visitor.id}>{visitor.id}</span>
                          <Badge variant="outline" className="border-white/10 bg-white/5 text-white shrink-0">
                            {visitor.recordType || "visitor"}
                          </Badge>
                        </div>
                        <div className="mt-2 text-xs text-white/50">
                          {visitor.currentPage ? `الصفحة: ${visitor.currentPage}` : visitor.country ? `الدولة: ${visitor.country}` : "زيارة جديدة"}
                        </div>
                        <div className="mt-1 text-xs text-white/40">{formatDate(visitor.updatedAt)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <h3 className="mb-3 text-sm font-semibold text-white/70">أحدث الطلبات</h3>
                  <div className="space-y-3">
                    {orders.length === 0 ? (
                      <div className="rounded-xl border border-white/5 bg-white/5 p-4 text-center text-sm text-white/40">لا توجد طلبات بعد</div>
                    ) : orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="rounded-xl border border-white/5 bg-white/5 p-3 text-sm">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-medium truncate max-w-[120px]" title={order.id}>{order.id}</span>
                          <Badge variant="outline" className="border-white/10 bg-white/5 text-white shrink-0">
                            {String(order.status || order.approval || "pending")}
                          </Badge>
                        </div>
                        <div className="mt-2 text-xs text-white/50">
                          {order.insurance_purpose ? `الغرض: ${order.insurance_purpose}` : order.phone2 ? `جوال: ${order.phone2}` : order.source ? `المصدر: ${order.source}` : "طلب عام"}
                        </div>
                        <div className="mt-1 text-xs text-white/40">{formatDate(order.updatedAt)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 text-white shadow-2xl backdrop-blur-xl">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold">الإشعارات المباشرة</h2>
              <p className="mt-1 text-sm text-white/45">آخر التحديثات القادمة من الموقع</p>

              <div className="mt-4 space-y-3">
                {notifications.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center text-sm text-white/40">لا توجد إشعارات بعد</div>
                ) : notifications.slice(0, 8).map((notification) => (
                  <div key={notification.id} className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium">{notification.title}</div>
                      <Badge variant="outline" className="border-white/10 bg-white/5 text-white shrink-0">
                        {notification.source || "system"}
                      </Badge>
                    </div>
                    <div className="mt-2 text-white/55">{notification.message}</div>
                    <div className="mt-2 text-xs text-white/35">{formatDate(notification.createdAt)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}