export default function Logo({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', margin: '0 auto', direction: 'ltr' }}>
      <defs>
        <linearGradient id="leftTop" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00e8d0" />
          <stop offset="100%" stopColor="#00b8a8" />
        </linearGradient>
        <linearGradient id="leftBot" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#009988" />
          <stop offset="100%" stopColor="#006655" />
        </linearGradient>
        <linearGradient id="rightTop" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4488ff" />
          <stop offset="100%" stopColor="#2255cc" />
        </linearGradient>
        <linearGradient id="rightBot" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1144bb" />
          <stop offset="100%" stopColor="#002288" />
        </linearGradient>
      </defs>

      {/* Left teal piece - top face */}
      <polygon points="8,8 46,8 34,28 8,28" fill="url(#leftTop)" />
      {/* Left teal piece - front face */}
      <polygon points="8,28 34,28 22,52 8,52" fill="url(#leftBot)" opacity="0.9" />
      {/* Left teal piece - bottom tip face */}
      <polygon points="8,52 22,52 8,70" fill="url(#leftBot)" opacity="0.7" />

      {/* Right blue piece - top face */}
      <polygon points="54,10 92,10 92,30 66,30" fill="url(#rightTop)" />
      {/* Right blue piece - front face */}
      <polygon points="66,30 92,30 92,52 78,52" fill="url(#rightBot)" opacity="0.9" />
      {/* Right blue piece - bottom arrow face */}
      <polygon points="54,10 66,30 50,52 38,32" fill="url(#rightTop)" opacity="0.85" />
      {/* Right blue piece - lower section */}
      <polygon points="50,52 66,30 78,52 64,72 50,52" fill="url(#rightBot)" opacity="0.8" />
    </svg>
  );
}
