import React from "react";

// Big lockup for hero / footer: LA PLATA band + AU/MO box + TOS + vertical ALREDEDORES
export function LogoBig({ className = "" }) {
  return (
    <div className={`inline-flex flex-col items-start ${className}`} data-testid="logo-big">
      <div className="bg-[#FFD60A] text-[#0B0C10] font-cond font-800 tracking-[0.35em] text-xs px-3 py-1 uppercase">
        La Plata
      </div>
      <div className="flex items-stretch mt-1">
        <div className="flex flex-col font-cond font-900 leading-[0.82] text-white text-5xl sm:text-6xl">
          <span className="bg-white text-[#0B0C10] px-2">AU/MO</span>
          <span className="px-2">TOS</span>
        </div>
        <div className="ml-1 bg-[#FFD60A] text-[#0B0C10] font-cond font-800 uppercase text-[10px] tracking-[0.3em] writing-vertical px-1 flex items-center">
          <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>Alrededores</span>
        </div>
      </div>
      <div className="text-white/50 font-cond tracking-[0.3em] text-xs mt-1 uppercase">L.P.</div>
    </div>
  );
}

// Compact lockup for sticky nav: AU/MO | TOS
export function LogoCompact({ className = "" }) {
  return (
    <div className={`inline-flex items-center font-cond font-900 leading-none ${className}`} data-testid="logo-compact">
      <span className="bg-white text-[#0B0C10] px-1.5 py-0.5 text-lg sm:text-xl">AU/MO</span>
      <span className="text-white/40 mx-1 text-lg">|</span>
      <span className="text-white text-lg sm:text-xl">TOS</span>
      <span className="text-[#FFD60A] ml-1 text-xs font-800 tracking-widest">L.P.</span>
    </div>
  );
}

export function VerificadoStamp({ className = "" }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <circle cx="50" cy="50" r="46" fill="none" stroke="#10B981" strokeWidth="4" strokeDasharray="6 4" />
      <path d="M32 52 l12 12 l24 -28" fill="none" stroke="#10B981" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AutoIcon({ className = "", color = "currentColor" }) {
  return (
    <svg viewBox="0 0 64 40" className={className} fill="none">
      <path d="M6 26 L12 14 C14 10 18 8 24 8 L40 8 C46 8 50 10 53 15 L58 24" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <rect x="4" y="24" width="56" height="8" rx="3" fill={color} />
      <circle cx="18" cy="33" r="5" fill="#0B0C10" stroke={color} strokeWidth="3" />
      <circle cx="46" cy="33" r="5" fill="#0B0C10" stroke={color} strokeWidth="3" />
    </svg>
  );
}

export function MotoIcon({ className = "", color = "currentColor" }) {
  return (
    <svg viewBox="0 0 64 40" className={className} fill="none">
      <circle cx="14" cy="28" r="8" stroke={color} strokeWidth="3" />
      <circle cx="50" cy="28" r="8" stroke={color} strokeWidth="3" />
      <path d="M14 28 L26 28 L34 16 L44 16 M30 28 L40 20 M44 16 L50 28" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M42 14 L50 14" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function MotoSilhouette({ className = "" }) {
  return <MotoIcon className={className} color="#FFD60A" />;
}
