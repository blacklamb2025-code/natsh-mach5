import React from "react";

// Portada: video "AUTO MOTOS - La Plata y alrededores" (reprodución automática, sin sonido, en loop).
// Full-width en escritorio, se reduce proporcionalmente en celular.
export function Hero() {
  return (
    <section className="bg-[#0B0C10] border-b border-[#1F2330]" data-testid="hero">
      <video
        src="/hero-video.mp4"
        poster="/hero-automotos.webp"
        preload="auto"
        autoPlay
        muted
        loop
        playsInline
        className="block w-full h-auto select-none"
        data-testid="hero-video"
        draggable={false}
      />
    </section>
  );
}
