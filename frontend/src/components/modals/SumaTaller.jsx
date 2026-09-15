import React, { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { CATEGORIES } from "@/data/categories";
import { Modal } from "@/components/modals/Modal";

const ZONES = ["Casco Urbano", "Los Hornos", "Tolosa", "City Bell", "Gonnet", "Villa Elisa", "Berisso", "Ensenada", "Meridiano V"];

export function SumaTaller({ onClose }) {
  const [f, setF] = useState({
    name: "", category: "mecanica", auto: true, moto: false,
    zone: "Casco Urbano", whatsapp: "", description: "", services: "",
  });
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!f.name.trim() || !f.whatsapp.trim()) return toast.error("Completá nombre y WhatsApp");
    const vehicles = [f.auto && "auto", f.moto && "moto"].filter(Boolean);
    if (vehicles.length === 0) return toast.error("Elegí auto y/o moto");
    setSending(true);
    try {
      await api.submit({
        name: f.name, category: f.category, vehicles, zone: f.zone,
        whatsapp: f.whatsapp.replace(/\D/g, ""), description: f.description,
        services: f.services.split(",").map((s) => s.trim()).filter(Boolean),
      });
      toast.success("Enviado! Tu taller queda en revisión.");
      onClose();
    } catch { toast.error("No se pudo enviar"); }
    setSending(false);
  };

  const inp = "w-full bg-[#0B0C10] border border-[#1F2330] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFD60A]/60";

  return (
    <Modal title="Suma tu taller" onClose={onClose} size="md" testid="suma-taller-modal">
      <form onSubmit={submit} className="space-y-3">
        <input data-testid="suma-name" className={inp} placeholder="Nombre del taller" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
        <select data-testid="suma-category" className={inp} value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}>
          {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
        </select>
        <div className="flex gap-4 text-sm text-white/80">
          <label className="flex items-center gap-2"><input type="checkbox" data-testid="suma-auto" checked={f.auto} onChange={(e) => setF({ ...f, auto: e.target.checked })} /> Auto</label>
          <label className="flex items-center gap-2"><input type="checkbox" data-testid="suma-moto" checked={f.moto} onChange={(e) => setF({ ...f, moto: e.target.checked })} /> Moto</label>
        </div>
        <select data-testid="suma-zone" className={inp} value={f.zone} onChange={(e) => setF({ ...f, zone: e.target.value })}>
          {ZONES.map((z) => <option key={z} value={z}>{z}</option>)}
        </select>
        <input data-testid="suma-whatsapp" className={inp} placeholder="WhatsApp (ej: 5492211234567)" value={f.whatsapp} onChange={(e) => setF({ ...f, whatsapp: e.target.value })} />
        <input data-testid="suma-services" className={inp} placeholder="Servicios separados por coma" value={f.services} onChange={(e) => setF({ ...f, services: e.target.value })} />
        <textarea data-testid="suma-description" className={inp} rows={2} placeholder="Descripción" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
        <button data-testid="suma-submit" disabled={sending} className="w-full bg-[#FFD60A] text-[#0B0C10] font-bold rounded-lg py-2.5 disabled:opacity-60">
          {sending ? "Enviando..." : "Enviar a revisión"}
        </button>
      </form>
    </Modal>
  );
}
