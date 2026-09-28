import React, { useEffect, useState } from "react";
import { CalendarDays, MapPin } from "lucide-react";
import { api } from "@/lib/api";
const TAG = {
  expo: { label: "EXPO", bg: "#FFD60A", fg: "#0B0C10" },
  carrera: { label: "CARRERA", bg: "#FF2A3B", fg: "#FFFFFF" },
  encuentro: { label: "ENCUENTRO", bg: "#38BDF8", fg: "#0B0C10" },
  asesoria: { label: "ASESORÍA / GESTORÍA", bg: "#A78BFA", fg: "#0B0C10" },
};
function fmtDate(d) {
  try {
    return new Date(d + "T00:00:00").toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" });
  } catch { return d; }
}
export function AgendaFierro() {
  const [events, setEvents] = useState([]);
  useEffect(() => { api.getEvents().then(setEvents); }, []);
  return (
    <section id="agenda" className="max-w-6xl mx-auto px-4 py-12" data-testid="agenda-fierro">
      <div className="flex items-center gap-3 mb-2">
        <CalendarDays className="text-[#FFD60A]" />
        <h2 className="font-cond font-900 uppercase text-4xl sm:text-5xl text-white tracking-wide">Agenda AUTOMOTOS L.P.</h2>
      </div>
      <p className="text-white/50 text-base">Expos, carreras y encuentros en La Plata y alrededores.</p>
      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        {events.map((e) => {
          const t = TAG[e.type] || TAG.encuentro;
          return (
            <article key={e.id} className="rounded-xl bg-[#12141C] border border-[#1F2330] p-5 hover:border-[#FFD60A]/40 transition" data-testid={`event-${e.id}`}>
              <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ background: t.bg, color: t.fg }}>
                {t.label}
              </span>
              <h3 className="font-cond font-800 text-2xl text-white mt-2 leading-tight">{e.title}</h3>
              <p className="text-white/50 text-sm mt-1">{e.description}</p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-white/70">
                <span className="inline-flex items-center gap-1.5"><CalendarDays size={15} className="text-[#FFD60A]" /> {fmtDate(e.date)}</span>
                <span className="inline-flex items-center gap-1.5"><MapPin size={15} className="text-[#FFD60A]" /> {e.location}</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
