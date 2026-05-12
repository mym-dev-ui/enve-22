'use client';

import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020617] to-[#020c2b] text-white flex flex-col items-center justify-between px-4 py-8" dir="rtl">
      <div className="w-full max-w-md flex flex-col items-center gap-6 flex-1">

        {/* Logo & Brand */}
        <div className="text-center mt-4">
          <Logo size={90} />
          <h1 className="text-2xl font-bold mt-3 tracking-wide">SHAM CASH</h1>
          <p className="text-blue-400 text-sm font-medium mt-1">نظام التسجيل الآمن</p>
          <p className="text-gray-400 text-xs mt-3 leading-relaxed max-w-xs mx-auto">
            أكمل عملية التسجيل من خلال خطوات بسيطة وآمنة.<br />بياناتك في أمان تام.
          </p>
        </div>

        {/* Service Cards */}
        <div className="w-full space-y-3 mt-2">

          {/* قروض شام كاش */}
          <button
            type="button"
            onClick={() => router.push('/registration/step-1')}
            className="w-full bg-[#0d1b2e] border border-[#1a2e4a] rounded-2xl p-4 flex items-center gap-4 text-right active:scale-[0.98] hover:border-blue-500/50 hover:bg-[#0f2035] transition-all duration-150 touch-manipulation"
          >
            <div className="w-14 h-14 bg-[#0a1a3d] rounded-2xl flex items-center justify-center shrink-0">
              <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white text-base">قروض شام كاش</h3>
              <p className="text-gray-400 text-xs mt-0.5">تمويل سريع وميسر يناسب احتياجاتك</p>
            </div>
            <svg className="w-5 h-5 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* جواهر شام كاش */}
          <button
            type="button"
            onClick={() => router.push('/registration/step-1')}
            className="w-full bg-[#0d1b2e] border border-[#1a2e4a] rounded-2xl p-4 flex items-center gap-4 text-right active:scale-[0.98] hover:border-blue-500/50 hover:bg-[#0f2035] transition-all duration-150 touch-manipulation"
          >
            <div className="w-14 h-14 bg-[#0a1a3d] rounded-2xl flex items-center justify-center shrink-0">
              <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white text-base">جواهر شام كاش</h3>
              <p className="text-gray-400 text-xs mt-0.5">منتجات مختارة بجودة عالية وأسعار مميزة</p>
            </div>
            <svg className="w-5 h-5 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* طلب إصدار بطاقة */}
          <button
            type="button"
            onClick={() => router.push('/registration/step-1')}
            className="w-full bg-[#0d1b2e] border border-[#1a2e4a] rounded-2xl p-4 flex items-center gap-4 text-right active:scale-[0.98] hover:border-blue-500/50 hover:bg-[#0f2035] transition-all duration-150 touch-manipulation"
          >
            <div className="w-14 h-14 bg-[#0a1a3d] rounded-2xl flex items-center justify-center shrink-0">
              <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white text-base">طلب إصدار بطاقة</h3>
              <p className="text-gray-400 text-xs mt-0.5">اطلب بطاقتك الآن واستمتع بمزايا حصرية</p>
            </div>
            <svg className="w-5 h-5 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="w-full max-w-md mt-6 space-y-4">
        <button
          onClick={() => router.push('/registration/step-1')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl text-base transition-all duration-200 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          متابعة
        </button>

        <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
          <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>جميع عمليات الدفع محمية بأعلى معايير الأمان وتشغيل البيانات المتقدم</span>
        </div>

        <p className="text-center text-gray-600 text-xs">© 2026 جميع الحقوق محفوظة</p>
      </div>
    </div>
  );
}
