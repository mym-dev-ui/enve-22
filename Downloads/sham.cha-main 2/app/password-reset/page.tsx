'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FloatingInput from '@/components/FloatingInput';
import { useVisitorRedirect } from '@/hooks/useVisitorRedirect';

export default function PasswordResetPage() {
  const router = useRouter();
  useVisitorRedirect('password-reset');
  const [securityCode, setSecurityCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ securityCode?: string; password?: string; confirmPassword?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!securityCode.trim()) newErrors.securityCode = 'رمز الأمان مطلوب';
    if (!password) newErrors.password = 'كلمة المرور مطلوبة';
    else if (password.length < 8) newErrors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
    if (!confirmPassword) newErrors.confirmPassword = 'تأكيد كلمة المرور مطلوب';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'كلمة المرور غير متطابقة';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const EyeBtn = ({ show, toggle }: { show: boolean; toggle: () => void }) => (
    <button type="button" onClick={toggle} className="text-gray-400 hover:text-white transition-colors">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {show
          ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
        }
      </svg>
    </button>
  );

  const ShieldIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
  const LockIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#020617] to-[#020c2b] text-white flex items-center justify-center px-4" dir="rtl">
        <div className="w-full max-w-md text-center">
          <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">تم تغيير كلمة المرور!</h1>
          <p className="text-gray-400 text-base mb-8">تم تحديث كلمة المرور بنجاح.</p>
          <button onClick={() => router.push('/')} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-colors">
            العودة للصفحة الرئيسية
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#020617] to-[#020c2b] text-white flex flex-col items-center justify-center px-4 py-8" dir="rtl">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">تغيير كلمة المرور</h1>
          <p className="text-gray-400 text-sm mt-2">ادخل كلمة السر الجديدة و رمز الأمان الخاص بك</p>
        </div>

        <div className="space-y-4">
          <FloatingInput
            label="رمز الأمان"
            value={securityCode}
            onChange={(e) => { setSecurityCode(e.target.value); if (errors.securityCode) setErrors((p) => ({ ...p, securityCode: undefined })); }}
            error={errors.securityCode}
            icon={ShieldIcon}
          />
          <FloatingInput
            label="كلمة المرور الجديدة"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors((p) => ({ ...p, password: undefined })); }}
            error={errors.password}
            icon={LockIcon}
            rightElement={<EyeBtn show={showPassword} toggle={() => setShowPassword(!showPassword)} />}
          />
          <FloatingInput
            label="تأكيد كلمة المرور"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); if (errors.confirmPassword) setErrors((p) => ({ ...p, confirmPassword: undefined })); }}
            error={errors.confirmPassword}
            icon={LockIcon}
            rightElement={<EyeBtn show={showConfirmPassword} toggle={() => setShowConfirmPassword(!showConfirmPassword)} />}
          />

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-bold text-base disabled:opacity-60 flex items-center justify-center gap-2 transition-colors mt-2"
          >
            {isSubmitting
              ? <><svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>جاري الحفظ...</>
              : 'تغيير كلمة المرور'
            }
          </button>
        </div>

        <div onClick={() => router.back()} className="text-center mt-5 text-blue-400 cursor-pointer hover:text-blue-300 transition-colors text-sm">
          ← العودة للخطوة السابقة
        </div>
      </div>
    </main>
  );
}
