import React, { useState } from "react";
import { Truck, MapPin, Flag, Navigation2, PhoneCall, Bookmark, ChevronDown, Gauge } from "lucide-react";
import { useApp } from "@/context/AppContext";

// Wheel buttons. Backlog block 5: D is now DESVIOS (orange), not the privacy shield.
const BUTTONS = [
  { key: "A", label: "Auxilio", color: "#FF2A3B", Icon: Truck, testid: "mach5-auxilio", modal: "auxilio" },
  { key: "B", label: "Combustible", color: "#0088FF", Icon: MapPin, testid: "mach5-map", modal: "map" },
  { key: "C", label: "Sitios", color: "#10B981", Icon: Flag, testid: "mach5-sitios", modal: "sitios" },
  { key: "D", label: "Desvios", color: "#F97316", Icon: Navigation2, testid: "mach5-desvios", modal: "desvios" },
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
        className="fixed bottom-5 right-5 z-40 bg-[#FFD60A] text-[#0B0C10] font-cond font-900 uppercase tracking-widest rounded-full px-5 py-3 shadow-lg shadow-black/40 flex items-center gap-2 hover:brightness-95 transition"
      >
        <Gauge size={20} /> Mach 5
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-40" data-testid="mach5-bar">
      <div className="bg-[#12141C]/95 backdrop-blur-md border border-[#1F2330] rounded-2xl p-2 shadow-lg shadow-black/40">
        <div className="flex items-center justify-between px-2 pb-2">
          <span className="font-cond font-900 uppercase tracking-widest text-[#FFD60A] text-sm">Mach 5</span>
          <button data-testid="mach5-collapse" onClick={() => setCollapsed(true)} className="text-white/50 hover:text-white">
            <ChevronDown size={18} />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {BUTTONS.map(({ key, label, color, Icon, testid, modal }) => (
            <button
              key={key}
              data-testid={testid}
              onClick={() => openModal(modal, modal === "map" ? { initial: "combustible" } : {})}
              className="w-20 h-20 rounded-xl flex flex-col items-center justify-center gap-1 border border-[#1F2330] hover:-translate-y-0.5 transition-all"
              style={{ background: `${color}1A` }}
            >
              <Icon size={22} style={{ color }} />
              <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color }}>{key} - {label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
