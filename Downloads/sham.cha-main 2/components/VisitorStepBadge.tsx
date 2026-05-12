'use client';

import { VisitorStep, STEP_LABELS, STEP_COLORS } from '@/lib/types';

interface VisitorStepBadgeProps {
  step: VisitorStep;
}

export default function VisitorStepBadge({ step }: VisitorStepBadgeProps) {
  const colorClass = STEP_COLORS[String(step)] || 'bg-gray-500';
  const label = STEP_LABELS[String(step)] || 'غير معروف';

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white ${colorClass}`}>
      {typeof step === 'number' ? `خطوة ${step} - ` : ''}{label}
    </span>
  );
}
