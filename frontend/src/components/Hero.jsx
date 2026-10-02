import React from "react";

// Portada: arte "AUTO MOTOS - La Plata y alrededores" (diseño del cliente, sin modificar).
// Full-width en escritorio, se reduce proporcionalmente en celular.
export function Hero() {
  return (
    <section className="bg-[#0B0C10] border-b border-[#1F2330]" data-testid="hero">
      <img
        src="/hero-automotos.webp"
        alt="AUTO MOTOS - La Plata y alrededores"
        className="block w-full h-auto select-none"
        data-testid="hero-image"
        draggable={false}
      />
    </section>
  );
}
