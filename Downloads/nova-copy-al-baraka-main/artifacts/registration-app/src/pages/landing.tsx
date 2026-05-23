import { motion } from "framer-motion";
import {
  ShieldCheck,
  Zap,
  Globe,
  Smartphone,
  Lock,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import RegisterForm from "@/components/RegisterForm";
import bankLogo from "@assets/01f05c9d-1725-44a0-bf1e-f4d1170160bc_1779004686391.jpeg";
import cardAd from "@assets/98a24187-74d6-4488-8b0a-9450ed926847_1779004461115.jpeg";

const FEATURES = [
  {
    icon: Zap,
    title: "دفع سريع وآمن",
    desc: "أتمم مدفوعاتك خلال ثوانٍ بحماية كاملة تطابق أعلى معايير الأمان البنكية.",
  },
  {
    icon: Globe,
    title: "مقبولة داخل وخارج سوريا",
    desc: "استخدم بطاقتك في كل مكان — متاجر ومواقع وأجهزة صراف داخل سوريا وحول العالم.",
  },
  {
    icon: Smartphone,
    title: "تحكم كامل بمصروفك",
    desc: "تابع رصيدك ومعاملاتك من تطبيقك وتحكم بحدود الإنفاق بأي وقت.",
  },
  {
    icon: ShieldCheck,
    title: "حماية متقدمة",
    desc: "تشفير كامل لبياناتك ورمز تحقق فوري عند كل عملية حساسة.",
  },
  {
    icon: Lock,
    title: "خصوصية تامة",
    desc: "بياناتك لا تُشارك مع أي طرف خارجي وتبقى محفوظة بسرية كاملة.",
  },
  {
    icon: Sparkles,
    title: "تفعيل فوري",
    desc: "احصل على بطاقتك خلال دقائق مع رمز تحقق يصلك مباشرة على هاتفك.",
  },
];

const scrollToForm = () => {
  const el = document.getElementById("register");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <img
            src={bankLogo}
            alt="بنك البركة"
            className="h-10 w-auto object-contain rounded"
          />
          <button
            onClick={scrollToForm}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/35 transition-all"
          >
            اطلبها الآن
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="hero-bg relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center md:text-right order-2 md:order-1"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-5">
                <Sparkles className="w-3.5 h-3.5" />
                عدد محدود من البطاقات
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight tracking-tight">
                بطاقتك..
                <span className="block text-primary mt-2">
                  أسهل مع البركة
                </span>
              </h1>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto md:mx-0">
                بطاقة الدفع الإلكتروني من بنك البركة سورية — آمنة، سريعة،
                ومقبولة داخل وخارج سوريا.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <button
                  onClick={scrollToForm}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-base shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 active:scale-[0.98] transition-all"
                >
                  اطلبها الآن
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <a
                  href="#features"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-border bg-card text-foreground font-semibold hover:bg-secondary transition-all"
                >
                  تعرف على المزيد
                </a>
              </div>

              <div className="mt-8 flex items-center justify-center md:justify-start gap-5 text-sm text-muted-foreground flex-wrap">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span>آمنة 100%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-primary" />
                  <span>مقبولة عالميًا</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-primary" />
                  <span>استخدام فوري</span>
                </div>
              </div>
            </motion.div>

            {/* Hero card — actual bank ad image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative flex items-center justify-center order-1 md:order-2"
            >
              <div className="relative w-full max-w-sm">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                <img
                  src={cardAd}
                  alt="بطاقة البركة الإلكترونية"
                  className="relative w-full h-auto rounded-3xl shadow-2xl shadow-primary/30"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-16 md:py-24 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
              لماذا بطاقة البركة؟
            </h2>
            <p className="mt-3 text-muted-foreground">
              تجربة مالية متكاملة بتفاصيل صُمّمت لتسهيل حياتك اليومية.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group bg-card border border-card-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-1.5">
                    {f.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {f.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-primary to-[hsl(357_71%_38%)] p-8 md:p-12 text-center shadow-2xl shadow-primary/30"
          >
            <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-black/10 blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                للحصول على البطاقة
              </h2>
              <p className="mt-3 text-white/90 max-w-xl mx-auto">
                سارع واطلبها الآن — العدد محدود! ثلاث خطوات بسيطة فقط لتحصل
                على بطاقتك.
              </p>
              <button
                onClick={scrollToForm}
                className="mt-7 inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-primary font-bold text-lg shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all"
              >
                اطلبها الآن
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* REGISTER FORM */}
      <section id="register" className="py-16 md:py-24 bg-secondary/40 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-xl mx-auto mb-10"
          >
            <img
              src={bankLogo}
              alt="بنك البركة"
              className="h-14 w-auto object-contain rounded mx-auto mb-6"
            />
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary">
              !أهلاً بك
            </h2>
            <p className="mt-3 text-muted-foreground">يرجى إدخال بياناتك</p>
          </motion.div>
          <RegisterForm />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-8 bg-background">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <img src={bankLogo} alt="بنك البركة" className="h-7 w-auto object-contain rounded" />
            <span>© {new Date().getFullYear()} جميع الحقوق محفوظة</span>
          </div>
          <div className="flex items-center gap-4">
            <span>سياسة الخصوصية</span>
            <span>الشروط والأحكام</span>
            <span>الدعم</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
