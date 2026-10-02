import React, { useEffect, useState } from "react";
import { Navigation2, MapPin } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { api } from "@/lib/api";
import { Modal } from "@/components/modals/Modal";

const TYPE = {
  corte: { label: "CORTE", color: "#DC2626" },
  desvio: { label: "DESVIO", color: "#F97316" },
  obra: { label: "OBRA", color: "#FFD60A" },
};

// Backlog block 5: Desvios list modal (D button)
export function DesviosModal({ onClose }) {
  const { openModal } = useApp();
  const [items, setItems] = useState([]);
  useEffect(() => { api.getDesvios().then(setItems).catch(() => {}); }, []);

  return (
    <Modal title="Desvios activos" onClose={onClose} size="lg" testid="desvios-modal">
      <p className="text-white/50 text-sm mb-4">Cortes, desvios y obras en la ciudad. Info comunitaria y orientativa.</p>
      <div className="space-y-2">
        {items.length === 0 && <p className="text-white/40 text-sm">No hay desvios cargados.</p>}
        {items.map((d) => {
          const t = TYPE[d.type] || TYPE.desvio;
          return (
            <div key={d.id} className="rounded-xl bg-[#0B0C10] border border-[#1F2330] p-4" data-testid={`desvio-${d.id}`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Navigation2 size={16} style={{ color: t.color }} />
                  <span className="font-cond font-800 text-lg text-white">{d.street}</span>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full" style={{ background: `${t.color}22`, color: t.color }}>{t.label}</span>
              </div>
              <p className="text-white/60 text-sm mt-1">{d.description}</p>
              {d.lat != null && d.lng != null && (
                <button
                  data-testid={`desvio-map-${d.id}`}
                  onClick={() => { onClose(); openModal("map", { focus: [d.lat, d.lng], initial: "desvios" }); }}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#F97316] hover:brightness-110"
                >
                  <MapPin size={13} /> Ver en mapa
                </button>
              )}
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
