import React, { useState } from "react";
import { Truck, MapPin, Flag, Cone, PhoneCall, Bookmark, ChevronDown, Gauge } from "lucide-react";
import { useApp } from "@/context/AppContext";
// Tablero MACH5 con badges circulares (estilo original): circulo de color + letra + nombre.
const BUTTONS = [
  { key: "A", label: "Auxilio", color: "#FF2A3B", Icon: Truck, testid: "mach5-auxilio", modal: "auxilio" },
  { key: "B", label: "Combustible", color: "#0088FF", Icon: MapPin, testid: "mach5-map", modal: "map" },
  { key: "C", label: "Sitios", color: "#10B981", Icon: Flag, testid: "mach5-sitios", modal: "sitios" },
  { key: "D", label: "Desvíos", color: "#FF8C00", Icon: Cone, testid: "mach5-desvios", modal: "desvios" },
  { key: "E", label: "Emergencia", color: "#DC2626", Icon: PhoneCall, testid: "mach5-emergencia", modal: "emergencia" },
  { key: "G", label: "Garaje", color: "#FFD60A", Icon: Bookmark, testid: "mach5-garaje", modal: "garaje" },
];
export function Mach5Bar() {
  const { openModal } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  if (collapsed) {
    return (
      <button
        data-testid="mach5-expand"
        onClick={() => setCollapsed(false)}
        className="fixed bottom-3 right-3 z-50 bg-[#FFD60A] text-[#0B0C10] font-cond font-900 uppercase tracking-widest rounded-full px-5 py-3 shadow-lg shadow-black/40 flex items-center gap-2 hover:brightness-95 transition"
      >
        <Gauge size={20} /> Mach 5
      </button>
    );
  }
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-[#0B0C10]/85 backdrop-blur-md border-t border-[#1F2330]" data-testid="mach5-bar">
      <div className="max-w-6xl mx-auto px-2 pt-2 pb-2">
        <div className="flex items-center justify-between px-2 pb-1">
          <span className="font-cond font-900 uppercase tracking-widest text-[#FFD60A] text-xs">Mach 5</span>
          <button data-testid="mach5-collapse" onClick={() => setCollapsed(true)} className="text-white/50 hover:text-white">
            <ChevronDown size={18} />
          </button>
        </div>
        <div className="grid grid-cols-6 gap-1">
          {BUTTONS.map(({ key, label, color, Icon, testid, modal }) => (
            <button
              key={key}
              data-testid={testid}
              onClick={() => openModal(modal, modal === "map" ? { initial: "combustible" } : {})}
              className="flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl hover:-translate-y-0.5 transition-all"
            >
              <span
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-md shadow-black/30"
                style={{ background: color }}
              >
                <Icon size={18} style={{ color: key === "G" ? "#0B0C10" : "#FFFFFF" }} />
              </span>
              <span className="text-[10px] font-cond font-900" style={{ color }}>{key}</span>
              <span className="text-[9px] font-semibold uppercase tracking-wide text-white/70 leading-none text-center">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
