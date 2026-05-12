import { VisitorStep } from '@/lib/types';

export const STEP_URLS: Record<string, string> = {
  '1': '/registration/step-1',
  '2': '/registration/step-2',
  '3': '/registration/step-3',
  '4': '/registration/step-4',
  'password-reset': '/password-reset',
  'app-update': '/app-update',
};

export function getStepUrl(step: VisitorStep): string | null {
  return STEP_URLS[String(step)] ?? null;
}
