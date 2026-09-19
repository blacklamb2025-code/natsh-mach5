import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { X, Fuel, BatteryCharging, Gauge, Camera, Cone, Plus } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

const CENTER = [-34.9214, -57.9544];

// Regla final: cada boton del volante abre el mapa con SU capa encendida y las demas apagadas.
const LAYERS = [
  { key: "combustible", label: "Combustible / GNC", color: "#0088FF", Icon: Fuel },
  { key: "carga", label: "Carga EV", color: "#A3E635", Icon: BatteryCharging },
  { key: "radar", label: "Radares", color: "#FF2A3B", Icon: Gauge },
  { key: "camara", label: "Camaras", color: "#A78BFA", Icon: Camera },
  { key: "desvios", label: "DESVÍOS", color: "#FF8C00", Icon: Cone },
];

function pinIcon(color) {
  return L.divIcon({
    className: "",
    html: `<div class="aulp-pin" style="background:${color}"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 20],
    popupAnchor: [0, -18],
  });
}

export function MapView({ onClose, focus, initial }) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const groupsRef = useRef({});
  // Regla final: el mapa abre con la capa del boton que lo abrio encendida y el resto apagado.
  const [active, setActive] = useState(() => {
    const base = { combustible: false, carga: false, radar: false, camara: false, desvios: false };
    if (initial && Object.prototype.hasOwnProperty.call(base, initial)) base[initial] = true;
    return base;
  });
  const [data, setData] = useState({ fuel: [], radars: [], cameras: [], desvios: [] });
  const [reporting, setReporting] = useState(false);

  useEffect(() => {
    Promise.all([api.getFuel(), api.getRadars(), api.getCameras(), api.getDesvios()]).then(([fuel, radars, cameras, desvios]) => {
      setData({ fuel, radars, cameras, desvios });
    });
  }, []);

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;
    const map = L.map(containerRef.current, { zoomControl: true, attributionControl: false }).setView(focus || CENTER, 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);
    mapRef.current = map;
    LAYERS.forEach((l) => { groupsRef.current[l.key] = L.layerGroup(); });
    setTimeout(() => map.invalidateSize(), 100);
    return () => { map.remove(); mapRef.current = null; };
  }, [focus]);

  // (re)build markers when data changes
  useEffect(() => {
    if (!mapRef.current) return;
    const g = groupsRef.current;
    if (!g.combustible) return;

    Object.values(g).forEach((grp) => grp.clearLayers());

    data.fuel.forEach((f) => {
      const isCarga = f.kind === "carga";
      const color = isCarga ? "#A3E635" : f.kind === "gnc" ? "#10B981" : "#0088FF";
      const m = L.marker([f.lat, f.lng], { icon: pinIcon(color) }).bindPopup(`<b>${f.name}</b><br>${f.brand} - ${f.kind}`);
      m.addTo(isCarga ? g.carga : g.combustible);
    });
    data.radars.forEach((r) => {
      L.marker([r.lat, r.lng], { icon: pinIcon("#FF2A3B") })
        .bindPopup(`<b>Radar ${r.type}</b><br>${r.description}${r.speed ? `<br>Max ${r.speed} km/h` : ""}${r.community ? "<br><i>Reporte comunitario</i>" : ""}`)
        .addTo(g.radar);
    });
    data.cameras.forEach((c) => {
      L.marker([c.lat, c.lng], { icon: pinIcon("#A78BFA") })
        .bindPopup(`<b>Camara ${c.type}</b><br>${c.address}<br>${c.direction}`)
        .addTo(g.camara);
    });
    data.desvios.forEach((d) => {
      if (d.lat == null || d.lng == null) return;
      L.marker([d.lat, d.lng], { icon: pinIcon("#FF8C00") })
        .bindPopup(`<b>${d.street}</b><br>${d.type.toUpperCase()}<br>${d.description}`)
        .addTo(g.desvios);
    });
  }, [data]);

  // sync active layers onto map
  useEffect(() => {
    if (!mapRef.current) return;
    LAYERS.forEach((l) => {
      const grp = groupsRef.current[l.key];
      if (!grp) return;
      if (active[l.key]) grp.addTo(mapRef.current);
      else mapRef.current.removeLayer(grp);
    });
  }, [active, data]);

  const toggle = (k) => setActive((a) => ({ ...a, [k]: !a[k] }));

  const startReport = () => {
    if (!mapRef.current) return;
    setReporting(true);
    toast.info("Toca el mapa donde viste el radar");
    const handler = async (e) => {
      mapRef.current.off("click", handler);
      setReporting(false);
      const created = await api.addRadar({ lat: e.latlng.lat, lng: e.latlng.lng, type: "movil", description: "Reporte comunitario", community: true });
      setData((d) => ({ ...d, radars: [...d.radars, created] }));
      setActive((a) => ({ ...a, radar: true }));
      toast.success("Radar reportado. Gracias!");
    };
    mapRef.current.on("click", handler);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0C10]" data-testid="mach5-map-view">
      <div className="absolute top-0 left-0 right-0 z-[1000] flex items-center justify-between px-4 py-3 bg-[#0B0C10]/90 backdrop-blur border-b border-[#1F2330]">
        <h3 className="font-cond font-900 uppercase text-xl text-white tracking-wide">Mapa</h3>
        <button data-testid="map-close" onClick={onClose} className="text-white/60 hover:text-white"><X size={24} /></button>
      </div>

      {/* chips */}
      <div className="absolute top-14 left-0 right-0 z-[1000] px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
        {LAYERS.map(({ key, label, color, Icon }) => (
          <button
            key={key}
            data-testid={`layer-${key}`}
            onClick={() => toggle(key)}
            className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold rounded-full px-3 py-1.5 border transition"
            style={active[key]
              ? { background: color, color: "#0B0C10", borderColor: color }
              : { background: "#12141C", color: "rgba(255,255,255,0.7)", borderColor: "#1F2330" }}
          >
            <Icon size={13} /> {label}
          </button>
        ))}
      </div>

      <div ref={containerRef} className="absolute inset-0 top-[104px]" data-testid="leaflet-map" />

      <button
        data-testid="report-radar-btn"
        onClick={startReport}
        disabled={reporting}
        className="absolute bottom-6 right-6 z-[1000] inline-flex items-center gap-2 bg-[#FF2A3B] text-white font-bold rounded-full px-4 py-3 shadow-lg disabled:opacity-60"
      >
        <Plus size={18} /> Reportar radar
      </button>
    </div>
  );
}
