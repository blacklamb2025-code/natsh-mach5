import React from "react";
import { useApp } from "@/context/AppContext";

export function VehicleSelect() {
  const { push, setMotoIntro, motoIntro } = useApp();

  const pick = (vehicle) => {
    if (vehicle === "moto") {
      setMotoIntro(true);
      setTimeout(() => { setMotoIntro(false); push({ screen: "categories", vehicle }); }, 750);
    } else {
      push({ screen: "categories", vehicle });
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-12" data-testid="vehicle-select">
      <h2 className="font-cond font-900 uppercase text-4xl sm:text-5xl text-white text-center tracking-wide">
        Toma tu posición de largada
      </h2>
      <p className="text-white/50 text-center mt-2 text-base">
        Elegí tu vehículo y encontrá el servicio exacto que buscás.
      </p>

      <div className="grid sm:grid-cols-2 gap-5 mt-8">
        <button
          data-testid="select-auto"
          onClick={() => pick("auto")}
          className="group relative overflow-hidden rounded-2xl bg-[#12141C] border border-[#1F2330] p-6 flex items-center gap-4 text-left hover:border-[#FFD60A]/60 transition-all hover:-translate-y-1"
        >
          <img
            src="/btn-autos.png"
            alt="Autos"
            className="w-28 h-28 sm:w-32 sm:h-32 object-contain shrink-0 group-hover:scale-105 transition-transform select-none pointer-events-none"
          />
          <div>
            <h3 className="font-cond font-900 text-4xl uppercase text-white leading-none">Autos</h3>
            <p className="text-white/60 text-sm mt-2">Hacé clic y entrá a la guía de servicios e info actual que buscás.</p>
          </div>
        </button>

        <button
          data-testid="select-moto"
          onClick={() => pick("moto")}
          className="group relative overflow-hidden rounded-2xl bg-[#12141C] border border-[#1F2330] p-6 flex items-center gap-4 text-left hover:border-[#FFD60A]/60 transition-all hover:-translate-y-1"
        >
          <img
            src="/btn-motos.png"
            alt="Motos"
            className={`w-28 h-28 sm:w-32 sm:h-32 object-contain shrink-0 group-hover:scale-105 transition-transform select-none pointer-events-none ${motoIntro ? "moto-pass" : ""}`}
          />
          <div>
            <h3 className="font-cond font-900 text-4xl uppercase text-white leading-none">Motos</h3>
            <p className="text-white/60 text-sm mt-2">Hacé clic y entrá a la guía de servicios e info actual que buscás.</p>
          </div>
        </button>
      </div>
    </section>
  );
}
