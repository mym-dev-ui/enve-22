import type { Metadata } from 'next';
import './globals.css';
import { VisitorProvider } from '@/contexts/VisitorContext';

export const metadata: Metadata = {
  title: 'شام كاش - نظام إدارة الزوار',
  description: 'نظام إدارة الزوار وتسجيل الحسابات',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <VisitorProvider>{children}</VisitorProvider>
      </body>
    </html>
  );
}
