'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import StepIndicator from '@/components/StepIndicator';
import Logo from '@/components/Logo';
import { useVisitorContext } from '@/contexts/VisitorContext';
import { useSoundSystem } from '@/hooks/useSound';
import { useVisitorRedirect } from '@/hooks/useVisitorRedirect';

export default function Step4Page() {
  const router = useRouter();
  const { getVisitor, completeVisitor, updateVisitorStep } = useVisitorContext();
  const { play } = useSoundSystem();
  useVisitorRedirect(4);
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const MOCK_VERIFICATION_CODE = '123456';

  useEffect(() => {
    // Update visitor step to 4 and load their data for display
    const visitorId = sessionStorage.getItem('currentVisitorId');
    if (visitorId) {
      void updateVisitorStep(visitorId, 4);
      const visitor = getVisitor(visitorId);
      if (visitor) {
        setVisitorName(visitor.registrationData.fullName || visitor.name);
        setVisitorEmail(visitor.registrationData.email || '');
        setVisitorPhone(visitor.registrationData.phone || visitor.phone);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!verificationCode.trim()) {
      setError('رمز التحقق مطلوب');
      return;
    }

    if (verificationCode.trim() !== MOCK_VERIFICATION_CODE) {
      setError(`رمز التحقق غير صحيح. الرمز الصحيح هو: ${MOCK_VERIFICATION_CODE}`);
      play('alert');
      return;
    }

    setError('');
    setIsSubmitting(true);

    await new Promise((r) => setTimeout(r, 800));

    // Complete the visitor in the global context so they appear in the dashboard
    const visitorId = sessionStorage.getItem('currentVisitorId');
    if (visitorId) {
      await completeVisitor(visitorId);
      sessionStorage.removeItem('currentVisitorId');
    }

    play('registration-complete');
    setIsCompleted(true);
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#020617] to-[#020c2b] flex items-center justify-center p-4" dir="rtl">
        <div className="w-full max-w-md text-center">
          {/* Success Animation */}
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white mb-3">تم التسجيل بنجاح!</h1>
          <p className="text-[#a0aec0] text-base mb-8">
            تم إنشاء حسابك بنجاح. يمكنك الآن الاستمتاع بخدمات شام كاش.
          </p>

          {(visitorName || visitorEmail || visitorPhone) && (
            <div className="bg-[#1e2d3d] rounded-2xl p-5 border border-[#2d3a4f] mb-6 text-right space-y-3">
              {visitorName && (
                <div className="flex justify-between">
                  <span className="text-white font-medium">{visitorName}</span>
                  <span className="text-[#a0aec0] text-sm">الاسم</span>
                </div>
              )}
              {visitorEmail && (
                <div className="flex justify-between">
                  <span className="text-white font-medium text-sm">{visitorEmail}</span>
                  <span className="text-[#a0aec0] text-sm">البريد الإلكتروني</span>
                </div>
              )}
              {visitorPhone && (
                <div className="flex justify-between">
                  <span className="text-white font-medium">{visitorPhone}</span>
                  <span className="text-[#a0aec0] text-sm">الهاتف</span>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Link
              href="/dashboard"
              className="btn-primary flex items-center justify-center gap-2 no-underline"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              عرض لوحة التحكم
            </Link>
            <Link
              href="/"
              className="btn-secondary flex items-center justify-center no-underline"
            >
              العودة للصفحة الرئيسية
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#020617] to-[#020c2b] text-white flex flex-col items-center px-4 py-6" dir="rtl">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-5">
          <Logo size={80} />
          <h1 className="text-xl font-bold mt-2">SHAM CASH</h1>
          <p className="text-blue-400 text-sm">نظام إدارة الزوار والمدفوعات</p>
        </div>

        <div className="text-center mb-5">
          <h2 className="text-lg font-bold">التحقق النهائي</h2>
          <p className="text-gray-400 text-sm mt-1">أدخل رمز التحقق لإتمام التسجيل</p>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={4} />

        {/* Form Card */}
        <div className="bg-[#1e2d3d] rounded-2xl p-6 border border-[#2d3a4f]">
          {/* Hint */}
          <div className="bg-[#4A7FFF]/10 border border-[#4A7FFF]/30 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[#4A7FFF] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-[#a0aec0] text-sm">
                تم إرسال رمز التحقق إلى بريدك الإلكتروني أو هاتفك.
                <br />
                <span className="text-[#4A7FFF]">للتجربة: استخدم الرمز <strong>123456</strong></span>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="block text-[#a0aec0] text-sm font-medium mb-2">
                رمز التحقق
              </label>
              <div className="relative">
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a0aec0] pointer-events-none">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => {
                    setVerificationCode(e.target.value.replace(/\D/g, ''));
                    if (error) setError('');
                  }}
                  placeholder="أدخل رمز التحقق"
                  maxLength={6}
                  className={`input-field text-center text-xl font-bold tracking-widest ${error ? 'error' : ''}`}
                  dir="ltr"
                  inputMode="numeric"
                />
              </div>
              {error && <p className="error-text">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  جاري التحقق...
                </>
              ) : (
                <>
                  إتمام التسجيل
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back link */}
        <div className="text-center mt-4">
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            ← العودة للخطوة السابقة
          </button>
        </div>
      </div>
    </main>
  );
}
