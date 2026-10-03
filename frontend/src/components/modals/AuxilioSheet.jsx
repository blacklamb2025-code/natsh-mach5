import React, { useEffect, useState } from "react";
import { MessageCircle, Truck } from "lucide-react";
import { api, waLink } from "@/lib/api";
import { Modal } from "@/components/modals/Modal";

export function AuxilioSheet({ onClose }) {
  const [items, setItems] = useState([]);
  useEffect(() => { api.getBusinesses({ category: "grua" }).then(setItems).catch(() => {}); }, []);

  return (
    <Modal title="Auxilio y gruas" onClose={onClose} size="lg" testid="auxilio-sheet">
      <p className="text-white/50 text-sm mb-4">Gruas y auxilio mecanico disponibles. Contacta directo por WhatsApp.</p>
      <div className="space-y-2">
        {items.map((b) => (
          <div key={b.id} className="flex items-center justify-between rounded-xl bg-[#0B0C10] border border-[#1F2330] p-4" data-testid={`auxilio-${b.id}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FF2A3B]/15 flex items-center justify-center"><Truck size={20} className="text-[#FF2A3B]" /></div>
              <div>
                <p className="font-semibold text-white text-sm">{b.name}</p>
                <p className="text-white/50 text-xs">{b.zone}</p>
              </div>
            </div>
            <a
              data-testid={`auxilio-wa-${b.id}`}
              href={waLink(b.whatsapp, `Hola ${b.name}, necesito auxilio/grua (via AUTOMOTOS L.P.)`)}
              target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#25D366] text-[#0B0C10] font-bold text-sm rounded-lg px-3 py-2"
            >
              <MessageCircle size={15} /> WhatsApp
            </a>
          </div>
        ))}
      </div>
    </Modal>
  );
}
