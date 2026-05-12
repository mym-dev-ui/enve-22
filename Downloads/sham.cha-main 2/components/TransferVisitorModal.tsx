'use client';

import { useState } from 'react';
import { VisitorStep, STEP_LABELS, Visitor } from '@/lib/types';

interface TransferVisitorModalProps {
  visitor: Visitor;
  onTransfer: (visitorId: string, targetStep: VisitorStep) => void;
  onClose: () => void;
}

const TRANSFER_OPTIONS: { step: VisitorStep; icon: string; description: string }[] = [
  {
    step: 1,
    icon: '👤',
    description: 'إدخال الاسم، الهاتف، رقم الهوية، والعنوان',
  },
  {
    step: 2,
    icon: '📧',
    description: 'إدخال البريد الإلكتروني وكلمة السر',
  },
  {
    step: 3,
    icon: '🔐',
    description: 'إدخال رمز الأمان للتحقق',
  },
  {
    step: 4,
    icon: '✅',
    description: 'التحقق النهائي من الرمز',
  },
  {
    step: 'password-reset',
    icon: '🔑',
    description: 'إعادة تعيين كلمة السر (رمز الأمان أولاً)',
  },
  {
    step: 'app-update',
    icon: '🔄',
    description: 'توجيه الزائر لصفحة تحديث التطبيق',
  },
];

export default function TransferVisitorModal({
  visitor,
  onTransfer,
  onClose,
}: TransferVisitorModalProps) {
  const [selectedStep, setSelectedStep] = useState<VisitorStep | null>(null);
  const [confirming, setConfirming] = useState(false);

  const handleTransfer = () => {
    if (!selectedStep) return;
    onTransfer(visitor.id, selectedStep);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#1e2d3d] rounded-2xl border border-[#2d3a4f] w-full max-w-md p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-xl">نقل الزائر</h2>
          <button
            onClick={onClose}
            className="text-[#a0aec0] hover:text-white transition-colors p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Visitor Info */}
        <div className="bg-[#2d3a4f] rounded-xl p-4 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#4A7FFF]/20 rounded-full flex items-center justify-center text-[#4A7FFF] font-bold">
            {visitor.name.charAt(0)}
          </div>
          <div>
            <p className="text-white font-semibold">{visitor.name}</p>
            <p className="text-[#a0aec0] text-sm">{visitor.phone}</p>
          </div>
          <div className="mr-auto text-sm text-[#a0aec0]">
            الخطوة الحالية:{' '}
            <span className="text-[#4A7FFF] font-semibold">
              {STEP_LABELS[String(visitor.currentStep)]}
            </span>
          </div>
        </div>

        {/* Step Options */}
        <p className="text-[#a0aec0] text-sm mb-4">اختر الخطوة المستهدفة:</p>
        <div className="space-y-3 mb-6">
          {TRANSFER_OPTIONS.map(({ step, icon, description }) => {
            const isCurrentStep = visitor.currentStep === step;
            const isSelected = selectedStep === step;

            return (
              <button
                key={String(step)}
                onClick={() => !isCurrentStep && setSelectedStep(step)}
                disabled={isCurrentStep}
                className={`w-full flex items-start gap-3 p-4 rounded-xl border transition-all duration-200 text-right ${
                  isCurrentStep
                    ? 'border-[#4a5568] bg-[#2d3a4f]/50 opacity-50 cursor-not-allowed'
                    : isSelected
                    ? 'border-[#4A7FFF] bg-[#4A7FFF]/10'
                    : 'border-[#4a5568] bg-[#2d3a4f]/30 hover:border-[#4A7FFF]/50 hover:bg-[#4A7FFF]/5'
                }`}
              >
                <span className="text-2xl mt-0.5 shrink-0">{icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold text-sm ${isSelected ? 'text-[#4A7FFF]' : 'text-white'}`}>
                      {STEP_LABELS[String(step)]}
                    </span>
                    {isCurrentStep && (
                      <span className="text-xs bg-[#4A7FFF]/20 text-[#4A7FFF] px-2 py-0.5 rounded-full">
                        الحالية
                      </span>
                    )}
                  </div>
                  <p className="text-[#a0aec0] text-xs mt-0.5">{description}</p>
                </div>
                {isSelected && (
                  <svg className="w-5 h-5 text-[#4A7FFF] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-medium bg-[#2d3a4f] hover:bg-[#3a4a5f] text-[#a0aec0] hover:text-white transition-all duration-200"
          >
            إلغاء
          </button>
          <button
            onClick={handleTransfer}
            disabled={!selectedStep}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
              selectedStep
                ? 'bg-[#4A7FFF] hover:bg-[#3a6fee] text-white'
                : 'bg-[#2d3a4f] text-[#a0aec0] cursor-not-allowed'
            }`}
          >
            تأكيد النقل
          </button>
        </div>
      </div>
    </div>
  );
}
