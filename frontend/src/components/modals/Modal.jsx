import React from "react";
import { X } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { SumaTaller } from "@/components/modals/SumaTaller";
import { AdminPanel } from "@/components/modals/AdminPanel";
import { AuxilioSheet } from "@/components/modals/AuxilioSheet";
import { Garaje } from "@/components/modals/Garaje";
import { DesviosModal } from "@/components/modals/DesviosModal";
import { EmergenciaModal } from "@/components/modals/EmergenciaModal";
import { SitiosModal } from "@/components/modals/SitiosModal";
import { MapView } from "@/components/modals/MapView";

// Generic centered modal shell
export function Modal({ title, children, onClose, size = "md", testid }) {
  const max = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" }[size];
  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 overflow-y-auto" data-testid={testid}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${max} bg-[#12141C] border border-[#1F2330] rounded-2xl shadow-2xl my-8`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1F2330] sticky top-0 bg-[#12141C] rounded-t-2xl">
          <h3 className="font-cond font-900 uppercase text-2xl text-white tracking-wide">{title}</h3>
          <button data-testid="modal-close" onClick={onClose} className="text-white/50 hover:text-white"><X size={22} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function ModalHost() {
  const { modal, closeModal } = useApp();
  if (!modal) return null;
  const { type, props } = modal;

  switch (type) {
    case "sumaTaller": return <SumaTaller onClose={closeModal} />;
    case "admin": return <AdminPanel onClose={closeModal} />;
    case "auxilio": return <AuxilioSheet onClose={closeModal} />;
    case "garaje": return <Garaje onClose={closeModal} />;
    case "desvios": return <DesviosModal onClose={closeModal} />;
    case "emergencia": return <EmergenciaModal onClose={closeModal} />;
    case "sitios": return <SitiosModal onClose={closeModal} />;
    case "map": return <MapView onClose={closeModal} {...props} />;
    default: return null;
  }
}
