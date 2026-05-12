import { Sparkles, Trophy, ShieldCheck, FileCheck } from "lucide-react"

export function LexusHero() {
  return (
    <div className="relative overflow-hidden">
      {/* Background ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-gold/10 via-background to-background pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 pt-10 pb-8 md:pt-16 md:pb-12">
        {/* Top badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-sm font-bold text-gold">فرصة ذهبية - تسليم رسمي داخل سوريا</span>
            <Sparkles className="w-4 h-4 text-gold" />
          </div>
        </div>

        {/* Main Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 leading-tight">
            <span className="block text-foreground">تهانينا</span>
            <span className="block text-gold-gradient mt-2">لقد فزت بسيارة</span>
            <span className="block text-foreground mt-2">لكزس LX 700</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            سجّل بياناتك الآن لاستلام جائزتك. سيارتك جاهزة بأوراق ثبوتية كاملة
            <br className="hidden md:block" />
            وتسليم رسمي داخل الأراضي السورية
          </p>
        </div>

        {/* Prize Image */}
        <div className="relative max-w-3xl mx-auto mb-10">
          <div className="absolute inset-0 bg-gold/20 blur-3xl rounded-full" />
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-gold/30 shadow-gold bg-secondary/40">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3e7c5085-6cc1-4bfd-8c4d-d0669a6c84b7-1bFhEQ0ZaoEkTsf92bkYWzxe6i5UUY.jpeg"
              alt="لكزس LX 700 - الجائزة الكبرى"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>
        </div>

        {/* Trust indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto">
          <div className="bg-card/60 backdrop-blur border border-gold/20 rounded-xl p-4 text-center">
            <Trophy className="w-7 h-7 text-gold mx-auto mb-2" />
            <p className="text-xs md:text-sm font-bold text-foreground">جائزة ذهبية</p>
            <p className="text-xs text-muted-foreground mt-1">قيمة عالية</p>
          </div>
          <div className="bg-card/60 backdrop-blur border border-gold/20 rounded-xl p-4 text-center">
            <ShieldCheck className="w-7 h-7 text-gold mx-auto mb-2" />
            <p className="text-xs md:text-sm font-bold text-foreground">تسليم رسمي</p>
            <p className="text-xs text-muted-foreground mt-1">داخل سوريا</p>
          </div>
          <div className="bg-card/60 backdrop-blur border border-gold/20 rounded-xl p-4 text-center">
            <FileCheck className="w-7 h-7 text-gold mx-auto mb-2" />
            <p className="text-xs md:text-sm font-bold text-foreground">أوراق ثبوتية</p>
            <p className="text-xs text-muted-foreground mt-1">كاملة ورسمية</p>
          </div>
          <div className="bg-card/60 backdrop-blur border border-gold/20 rounded-xl p-4 text-center">
            <Sparkles className="w-7 h-7 text-gold mx-auto mb-2" />
            <p className="text-xs md:text-sm font-bold text-foreground">موديل 2025</p>
            <p className="text-xs text-muted-foreground mt-1">جديدة كلياً</p>
          </div>
        </div>
      </div>
    </div>
  )
}
