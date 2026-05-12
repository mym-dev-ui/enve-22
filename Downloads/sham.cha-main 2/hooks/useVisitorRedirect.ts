'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { VisitorStep } from '@/lib/types';
import { getStepUrl } from '@/lib/stepRoutes';
import { useVisitorContext } from '@/contexts/VisitorContext';

/**
 * Redirects the visitor to the page matching their current step in the visitor
 * context whenever their step differs from the page they are currently on.
 *
 * Works both on initial mount (handles the case where the dashboard transferred
 * the visitor while they were offline) and in real-time via the `storage` event
 * (fires when the dashboard tab updates localStorage from a different tab).
 */
export function useVisitorRedirect(currentPageStep: VisitorStep) {
  const router = useRouter();
  const { visitors } = useVisitorContext();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const visitorId = sessionStorage.getItem('currentVisitorId');
    if (!visitorId) return;

    const visitor = visitors.find((v) => v.id === visitorId);
    if (!visitor || visitor.currentStep === currentPageStep) return;

    const targetUrl = getStepUrl(visitor.currentStep);
    if (targetUrl) router.replace(targetUrl);
  }, [currentPageStep, router, visitors]);
}
