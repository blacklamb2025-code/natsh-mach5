import React from "react";
import { PhoneCall, MapPin, Building2, Shield } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { api } from "@/lib/api";
const CALLS = [
  { label: "Policía", num: "911", color: "#0088FF", Icon: Shield },
  { label: "Ambulancia SAME", num: "107", color: "#DC2626", Icon: PhoneCall },
  { label: "Bomberos", num: "100", color: "#F97316", Icon: PhoneCall },
  { label: "Defensa Civil La Plata", num: "103", color: "#FFD60A", Icon: PhoneCall },
];
// Punch v5.1: overlay fullscreen, 4 botones gigantes con altura mínima 96px.
export function EmergenciaModal({ onClose }) {
  const { openModal } = useApp();
  const [places, setPlaces] = React.useState([]);
  React.useEffect(() => { api.getPlaces().then(setPlaces).catch(() => {}); }, []);
  const seeOnMap = (p) => {
    if (p.lat == null || p.lng == null) { openModal("map", {}); return; }
    openModal("map", { focus: [p.lat, p.lng] });
  };
  return (
    <div className="fixed inset-0 z-50 bg-[#0B0C10] overflow-y-auto" data-testid="emergencia-modal">
      <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-[#DC2626] text-white">
        <h3 className="font-cond font-900 uppercase text-3xl tracking-wide">Emergencias</h3>
        <button data-testid="emergencia-close" onClick={onClose} className="font-bold text-lg px-3 py-1 rounded-lg bg-black/20 hover:bg-black/30">Cerrar</button>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <p className="text-white/60 text-sm mb-4">Toca para llamar. Ante una emergencia, mantene la calma.</p>
        <div className="grid grid-cols-2 gap-4">
          {CALLS.map(({ label, num, color, Icon }) => (
            <a
              key={num}
              data-testid={`call-${num}`}
              href={`tel:${num}`}
              className="rounded-2xl p-6 min-h-[96px] flex flex-col items-center justify-center gap-2 border-2 hover:-translate-y-1 transition-all"
              style={{ borderColor: color, background: `${color}14` }}
            >
              <Icon size={40} style={{ color }} />
              <span className="font-cond font-900 text-5xl" style={{ color }}>{num}</span>
              <span className="text-white/80 text-sm font-semibold uppercase tracking-wide text-center">{label}</span>
            </a>
          ))}
        </div>
        <h4 className="font-cond font-800 uppercase text-2xl text-white mt-8 mb-3">Hospitales y comisarias cerca</h4>
        <div className="space-y-2">
          {places.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-xl bg-[#12141C] border border-[#1F2330] px-4 py-3" data-testid={`place-${p.id}`}>
              <div className="flex items-center gap-3">
                <Building2 size={18} className={p.kind === "hospital" ? "text-[#DC2626]" : "text-[#0088FF]"} />
                <div>
                  <p className="font-semibold text-white text-sm">{p.name}</p>
                  <p className="text-white/50 text-xs">{p.zone}</p>
                </div>
              </div>
              <button data-testid={`place-map-${p.id}`} onClick={() => seeOnMap(p)} className="inline-flex items-center gap-1 text-xs font-semibold text-[#FFD60A] hover:brightness-110">
                <MapPin size={14} /> Ver en mapa
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
