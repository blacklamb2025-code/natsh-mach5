import React, { useEffect, useState } from "react";
import { Bookmark, Trash2, Plus, Car, Bike } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { api } from "@/lib/api";
import { Modal } from "@/components/modals/Modal";

export function Garaje({ onClose }) {
  const { favs, garage, addVehicle, removeVehicle, push } = useApp();
  const [favBiz, setFavBiz] = useState([]);
  const [form, setForm] = useState({ type: "auto", name: "" });

  useEffect(() => {
    if (favs.length === 0) { setFavBiz([]); return; }
    Promise.all(favs.map((id) => api.getBusiness(id).catch(() => null))).then((r) => setFavBiz(r.filter(Boolean)));
  }, [favs]);

  const add = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    addVehicle({ type: form.type, name: form.name.trim() });
    setForm({ type: "auto", name: "" });
  };

  return (
    <Modal title="Mi garaje" onClose={onClose} size="lg" testid="garaje-modal">
      <h4 className="font-cond font-800 uppercase text-lg text-[#FFD60A] mb-2">Mis vehiculos</h4>
      <form onSubmit={add} className="flex gap-2 mb-3">
        <select
          data-testid="garage-vehicle-type" value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="bg-[#0B0C10] border border-[#1F2330] rounded-lg px-2 py-2 text-sm text-white"
        >
          <option value="auto">Auto</option>
          <option value="moto">Moto</option>
        </select>
        <input
          data-testid="garage-vehicle-name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Ej: Fiat 128 / Honda Twister"
          className="flex-1 bg-[#0B0C10] border border-[#1F2330] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFD60A]/60"
        />
        <button data-testid="garage-add" className="bg-[#FFD60A] text-[#0B0C10] font-bold rounded-lg px-3"><Plus size={18} /></button>
      </form>
      <div className="space-y-2 mb-6">
        {garage.length === 0 && <p className="text-white/40 text-sm">Todavia no cargaste vehiculos.</p>}
        {garage.map((v) => (
          <div key={v.id} className="flex items-center justify-between rounded-lg bg-[#0B0C10] border border-[#1F2330] px-3 py-2" data-testid={`garage-item-${v.id}`}>
            <div className="flex items-center gap-2 text-white text-sm">
              {v.type === "moto" ? <Bike size={16} className="text-[#FFD60A]" /> : <Car size={16} className="text-[#FFD60A]" />}
              {v.name}
            </div>
            <button data-testid={`garage-remove-${v.id}`} onClick={() => removeVehicle(v.id)} className="text-white/40 hover:text-[#FF2A3B]"><Trash2 size={15} /></button>
          </div>
        ))}
      </div>

      <h4 className="font-cond font-800 uppercase text-lg text-[#FFD60A] mb-2 flex items-center gap-1.5"><Bookmark size={16} /> Favoritos</h4>
      <div className="space-y-2">
        {favBiz.length === 0 && <p className="text-white/40 text-sm">No guardaste talleres todavia.</p>}
        {favBiz.map((b) => (
          <button
            key={b.id}
            data-testid={`fav-item-${b.id}`}
            onClick={() => { onClose(); push({ screen: "detail", id: b.id }); }}
            className="w-full text-left flex items-center justify-between rounded-lg bg-[#0B0C10] border border-[#1F2330] px-3 py-2 hover:border-[#FFD60A]/40"
          >
            <span className="text-white text-sm">{b.name}</span>
            <span className="text-white/40 text-xs">{b.zone}</span>
          </button>
        ))}
      </div>
    </Modal>
  );
}
