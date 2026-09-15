import React from "react";
import { LogoBig } from "@/components/graphics";
import { HERO_PHOTOS, LARGADA_IMG } from "@/lib/api";

// Backlog block 1: three vertical bands + film-strip gallery
export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[#1F2330]" data-testid="hero">
      {/* three vertical bands */}
      <div className="grid grid-cols-1 md:grid-cols-3 min-h-[440px] md:min-h-[520px]">
        {/* (a) left band: full black with big logo lockup */}
        <div className="bg-[#0B0C10] flex items-center justify-center p-8 fade-in-up" style={{ animationDelay: "0.05s" }}>
          <LogoBig className="scale-110" />
        </div>

        {/* (b) center band: black checks over speed yellow -> fading to dashed grid */}
        <div className="relative bg-[#FFD60A] fade-in-up" style={{ animationDelay: "0.15s" }}>
          <div className="absolute inset-0 checkered opacity-90" style={{ maskImage: "linear-gradient(to bottom, black 30%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 30%, transparent 100%)" }} />
          <div className="absolute bottom-0 left-0 right-0 h-24 speed-dashes opacity-60" />
          <div className="relative h-full flex flex-col items-center justify-center text-center px-6 py-10">
            <h1 className="font-cond font-900 uppercase text-[#0B0C10] leading-[0.85] text-6xl sm:text-7xl lg:text-8xl">
              Posicionate<br />en tu<br />largada
            </h1>
          </div>
        </div>

        {/* (c) right band: speed yellow with largada image at 35% opacity */}
        <div className="relative bg-[#FFD60A] flex items-end justify-center overflow-hidden fade-in-up" style={{ animationDelay: "0.25s" }}>
          <img src={LARGADA_IMG} alt="Largada" className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-luminosity" />
          <div className="relative z-10 p-8 text-center">
            <p className="font-medium text-[#0B0C10] text-lg">Tu largada empieza aca</p>
          </div>
        </div>
      </div>

      {/* subtle shine sweep across the whole hero */}
      <div className="absolute inset-0 hood-shine pointer-events-none" />

      {/* film-strip gallery of the 5 artistic photos */}
      <div className="bg-[#0B0C10] px-4 py-5">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1" data-testid="hero-film-strip">
            {HERO_PHOTOS.map((p, i) => (
              <figure
                key={i}
                className="relative shrink-0 w-44 sm:w-56 rounded-sm bg-black border-2 border-black fade-in-up"
                style={{ animationDelay: `${0.3 + i * 0.08}s` }}
              >
                {/* perforations */}
                <div className="absolute -left-0.5 top-0 bottom-0 w-2 flex flex-col justify-around py-1 z-10">
                  {Array.from({ length: 6 }).map((_, k) => <span key={k} className="w-1.5 h-1.5 bg-[#0B0C10] rounded-[1px] mx-auto ring-1 ring-white/10" />)}
                </div>
                <div className="absolute -right-0.5 top-0 bottom-0 w-2 flex flex-col justify-around py-1 z-10">
                  {Array.from({ length: 6 }).map((_, k) => <span key={k} className="w-1.5 h-1.5 bg-[#0B0C10] rounded-[1px] mx-auto ring-1 ring-white/10" />)}
                </div>
                <div className="px-2 py-1">
                  <img src={p.url} alt={p.label} className="w-full h-28 sm:h-32 object-cover grayscale-[0.15]" />
                  <figcaption className="text-[10px] uppercase tracking-widest text-white/50 py-1 text-center font-cond">{p.label}</figcaption>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
