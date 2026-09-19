import React, { useState } from "react";
import { Star, ChevronLeft, BadgeCheck } from "lucide-react";
import { useApp } from "@/context/AppContext";

export function StarRating({ value = 0, size = 16, className = "" }) {
  return (
    <div className={`inline-flex items-center gap-0.5 ${className}`} data-testid="star-rating">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} className={i <= Math.round(value) ? "fill-[#FFD60A] text-[#FFD60A]" : "text-white/25"} />
      ))}
    </div>
  );
}

export function StarInput({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="inline-flex items-center gap-1" data-testid="star-input">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          data-testid={`star-input-${i}`}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
        >
          <Star size={26} className={i <= (hover || value) ? "fill-[#FFD60A] text-[#FFD60A]" : "text-white/25"} />
        </button>
      ))}
    </div>
  );
}

export function VerificadoBadge({ className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-[#10B981]/15 text-[#10B981] text-xs font-semibold px-2 py-0.5 border border-[#10B981]/30 ${className}`} data-testid="verificado-badge">
      <BadgeCheck size={13} /> VERIFICADO
    </span>
  );
}

export function BackButton({ className = "" }) {
  const { back, stackDepth } = useApp();
  if (stackDepth <= 1) return null;
  return (
    <button
      onClick={back}
      data-testid="back-button"
      className={`inline-flex items-center gap-1 text-sm font-bold rounded-full px-3 py-1.5 bg-[#FFD60A] text-[#0B0C10] hover:brightness-95 transition ${className}`}
    >
      <ChevronLeft size={18} /> Volver
    </button>
  );
}
