export type VisitorStep = 1 | 2 | 3 | 4 | 'password-reset' | 'app-update';

export interface RegistrationData {
  fullName?: string;
  phone?: string;
  idNumber?: string;
  address?: string;
  email?: string;
  password?: string;
  securityCode?: string;
  verificationCode?: string;
}

export interface Visitor {
  id: string;
  name: string;
  phone: string;
  email?: string;
  currentStep: VisitorStep;
  registrationData: RegistrationData;
  createdAt: string;
  status: 'active' | 'completed' | 'pending' | 'rejected';
}

export const STEP_LABELS: Record<string, string> = {
  '1': 'المعلومات الشخصية',
  '2': 'البريد الإلكتروني وكلمة السر',
  '3': 'رمز الأمان',
  '4': 'التحقق من الرمز',
  'password-reset': 'إعادة تعيين كلمة السر',
  'app-update': 'تحديث التطبيق',
};

export const STEP_COLORS: Record<string, string> = {
  '1': 'bg-blue-500',
  '2': 'bg-purple-500',
  '3': 'bg-yellow-500',
  '4': 'bg-green-500',
  'password-reset': 'bg-orange-500',
  'app-update': 'bg-teal-500',
};
