import React from "react";
import { useApp } from "@/context/AppContext";
import { AutoIcon, MotoIcon } from "@/components/graphics";

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
        Que manejas?
      </h2>
      <p className="text-white/50 text-center mt-2 text-base">Elegi tu fierro y encontra el taller ideal.</p>

      <div className="grid sm:grid-cols-2 gap-5 mt-8">
        <button
          data-testid="select-auto"
          onClick={() => pick("auto")}
          className="group relative overflow-hidden rounded-2xl bg-[#12141C] border border-[#1F2330] p-8 text-left hover:border-[#FFD60A]/60 transition-all hover:-translate-y-1"
        >
          <div className="absolute right-4 top-4 text-[#FFD60A]/10 group-hover:text-[#FFD60A]/25 transition">
            <AutoIcon className="w-32 h-20" />
          </div>
          <span className="text-xs font-cond uppercase tracking-[0.3em] text-[#FFD60A]">4 ruedas</span>
          <h3 className="font-cond font-900 text-5xl uppercase text-white mt-2">Auto</h3>
          <p className="text-white/50 text-sm mt-2">Mecanica, GNC, chapa, VTV y mas.</p>
        </button>

        <button
          data-testid="select-moto"
          onClick={() => pick("moto")}
          className="group relative overflow-hidden rounded-2xl bg-[#12141C] border border-[#1F2330] p-8 text-left hover:border-[#FFD60A]/60 transition-all hover:-translate-y-1"
        >
          <div className="absolute right-4 top-4 text-[#FFD60A]/10 group-hover:text-[#FFD60A]/25 transition">
            <MotoIcon className={`w-32 h-20 ${motoIntro ? "moto-pass" : ""}`} />
          </div>
          <span className="text-xs font-cond uppercase tracking-[0.3em] text-[#FFD60A]">2 ruedas</span>
          <h3 className="font-cond font-900 text-5xl uppercase text-white mt-2">Moto</h3>
          <p className="text-white/50 text-sm mt-2">Service, cascos, seguridad y mas.</p>
        </button>
      </div>
    </section>
  );
}
