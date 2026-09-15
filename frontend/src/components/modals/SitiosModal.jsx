import React, { useEffect, useState } from "react";
import { Flag, MapPin } from "lucide-react";
import { api } from "@/lib/api";
import { Modal } from "@/components/modals/Modal";

export function SitiosModal({ onClose }) {
  const [items, setItems] = useState([]);
  useEffect(() => { api.getSites().then(setItems); }, []);

  return (
    <Modal title="Sitios de encuentro" onClose={onClose} size="lg" testid="sitios-modal">
      <p className="text-white/50 text-sm mb-4">Puntos de encuentro y rodadas en La Plata y alrededores.</p>
      <div className="space-y-2">
        {items.map((s) => (
          <div key={s.id} className="rounded-xl bg-[#0B0C10] border border-[#1F2330] p-4" data-testid={`site-${s.id}`}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Flag size={16} className="text-[#10B981]" />
                <span className="font-cond font-800 text-lg text-white">{s.name}</span>
              </div>
              <span
                className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                style={s.enabled ? { background: "#10B98122", color: "#10B981" } : { background: "#DC262622", color: "#DC2626" }}
                data-testid={`site-badge-${s.id}`}
              >
                {s.enabled ? "HABILITADO" : "NO HABILITADO"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-white/50 text-xs mt-1"><MapPin size={12} /> {s.zone}</div>
            <p className="text-white/60 text-sm mt-1">{s.description}</p>
          </div>
        ))}
      </div>
    </Modal>
  );
}
