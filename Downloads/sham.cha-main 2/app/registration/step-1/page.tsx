'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import StepIndicator from '@/components/StepIndicator';
import Logo from '@/components/Logo';
import FloatingInput from '@/components/FloatingInput';
import { useVisitorContext } from '@/contexts/VisitorContext';
import { useSoundSystem } from '@/hooks/useSound';
import { useVisitorRedirect } from '@/hooks/useVisitorRedirect';

interface FormData {
  fullName: string;
  phone: string;
  idNumber: string;
  address: string;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  idNumber?: string;
  address?: string;
}

export default function Step1Page() {
  const router = useRouter();
  const { addVisitor, updateVisitorStep } = useVisitorContext();
  const { play } = useSoundSystem();
  useVisitorRedirect(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    idNumber: '',
    address: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'الاسم الكامل مطلوب';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'الاسم يجب أن يكون 3 أحرف على الأقل';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    } else if (!/^[0-9+\-\s]{7,15}$/.test(formData.phone.trim())) {
      newErrors.phone = 'رقم الهاتف غير صحيح';
    }

    if (!formData.idNumber.trim()) {
      newErrors.idNumber = 'رقم الهوية مطلوب';
    } else if (!/^[0-9]{7,15}$/.test(formData.idNumber.trim())) {
      newErrors.idNumber = 'رقم الهوية يجب أن يكون أرقاماً (7-15 رقم)';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'العنوان مطلوب';
    } else if (formData.address.trim().length < 5) {
      newErrors.address = 'العنوان يجب أن يكون 5 أحرف على الأقل';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formError) {
      setFormError('');
    }
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      setFormError('يرجى تصحيح الحقول المميزة بالأحمر للمتابعة');
      play('alert');
      return;
    }

    setFormError('');
    setIsSubmitting(true);
    try {
      const visitorId = await addVisitor({
        name: formData.fullName.trim(),
        phone: formData.phone.trim(),
        currentStep: 1,
        status: 'active',
        registrationData: {
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          idNumber: formData.idNumber.trim(),
          address: formData.address.trim(),
        },
      });
      await updateVisitorStep(visitorId, 2);
      sessionStorage.setItem('currentVisitorId', visitorId);
      play('basic-info');
      await new Promise((r) => setTimeout(r, 400));
      router.push('/registration/step-2');
    } catch {
      setFormError('تعذر إرسال البيانات. يرجى المحاولة مرة أخرى.');
      play('alert');
    } finally {
      setIsSubmitting(false);
    }
  };

  const UserIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
  const PhoneIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
  const IdIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4z" />
    </svg>
  );
  const PinIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
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

        <StepIndicator currentStep={1} />

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-4" noValidate>
          <FloatingInput
            label="الاسم الكامل"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            error={errors.fullName}
            icon={UserIcon}
            dir="rtl"
          />
          <FloatingInput
            label="رقم الهاتف"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            error={errors.phone}
            icon={PhoneIcon}
            dir="ltr"
            inputMode="tel"
          />
          <FloatingInput
            label="رقم الهوية"
            value={formData.idNumber}
            onChange={(e) => handleChange('idNumber', e.target.value)}
            error={errors.idNumber}
            icon={IdIcon}
            dir="rtl"
            inputMode="numeric"
          />
          <FloatingInput
            label="العنوان"
            multiline
            rows={3}
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            error={errors.address}
            icon={PinIcon}
            dir="rtl"
          />

          {formError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm text-center">
              {formError}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 mt-2 active:scale-95"
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
        </form>

        <div className="text-center mt-4 sm:mt-6">
          <button
            onClick={() => router.push('/')}
            className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors active:scale-95"
          >
            ← العودة للصفحة الرئيسية
          </button>
        </div>
      </div>
    </main>
  );
}
