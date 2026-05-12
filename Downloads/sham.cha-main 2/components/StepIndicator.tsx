'use client';

import React from 'react';

interface Step {
  number: number;
  label: string;
}

const STEPS: Step[] = [
  { number: 1, label: 'البيانات' },
  { number: 2, label: 'التسجيل' },
  { number: 3, label: 'رمز الأمان' },
  { number: 4, label: 'التحقق' },
];

interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8 w-full" dir="ltr">
      {STEPS.map((step, index) => {
        const isCompleted = step.number < currentStep;
        const isActive = step.number === currentStep;

        return (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  isCompleted
                    ? 'bg-[#4A7FFF] text-white'
                    : isActive
                    ? 'bg-[#4A7FFF] text-white ring-4 ring-[#4A7FFF]/30'
                    : 'bg-[#1a2c4a] text-[#a0aec0] border border-[#2d4070]'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <span
                className={`text-xs ${
                  isActive ? 'text-[#4A7FFF] font-semibold' : 'text-[#a0aec0]'
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`h-0.5 w-8 mb-4 transition-all duration-300 ${
                  step.number < currentStep ? 'bg-[#4A7FFF]' : 'bg-[#2d4070]'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
