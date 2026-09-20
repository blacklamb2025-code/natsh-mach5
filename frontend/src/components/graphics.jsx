import React from "react";

// Marca AUTOMOTOS L.P.: LA PLATA (amarillo) + [AU / MO] blancos a la izquierda + TOS negro a la derecha + alrededores (amarillo, abajo derecha)
export function LogoBig({ className = "" }) {
  return (
    <div className={`inline-flex flex-col items-start ${className}`} data-testid="logo-big">
      {/* LA PLATA - solo letras amarillas, un poco mas grande */}
      <div className="text-[#FFD60A] font-cond font-800 uppercase tracking-[0.35em] text-sm sm:text-base mb-1.5">
        La Plata
      </div>

      {/* 3 rectangulos: [AU / MO] blancos a la izquierda + TOS negro a la derecha (alto = ambos blancos) */}
      <div className="flex items-stretch gap-1">
        <div className="flex flex-col gap-1 font-cond font-900 leading-none text-5xl sm:text-6xl">
          <span className="bg-white text-[#0B0C10] px-3 py-1.5 text-center">AU</span>
          <span className="bg-white text-[#0B0C10] px-3 py-1.5 text-center">MO</span>
        </div>
        <div className="flex items-center justify-center overflow-hidden bg-[#0B0C10] border border-[#1F2330] text-white font-cond font-900 leading-none text-5xl sm:text-6xl px-4">
          <span className="inline-block origin-center scale-y-[1.9]">TOS</span>
        </div>
      </div>

      {/* alrededores - abajo a la derecha, solo letras amarillas */}
      <div className="self-end text-[#FFD60A] font-cond font-800 uppercase tracking-[0.35em] text-xs sm:text-sm mt-1.5">
        alrededores
      </div>
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
