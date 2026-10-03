import React, { useEffect, useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import { api } from "@/lib/api";
import { getCategory } from "@/data/categories";
import { BackButton } from "@/components/bits";
import { BusinessCard, NearMeToggle } from "@/components/BusinessCard";
import { coordsForBusiness, haversineKm } from "@/lib/geo";

export function BusinessList({ vehicle, category }) {
  const { nearMe, userCoords } = useApp();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const cat = getCategory(category);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api.getBusinesses({ vehicle, category }).then((d) => { if (alive) { setItems(d); setLoading(false); } }).catch(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [vehicle, category]);

  const ordered = useMemo(() => {
    if (!nearMe) return items.map((b) => ({ b }));
    const origin = userCoords || [-34.9214, -57.9544];
    return items
      .map((b) => ({ b, d: haversineKm(origin, coordsForBusiness(b)) }))
      .sort((a, z) => a.d - z.d)
      .map((x) => ({ b: x.b, d: x.d }));
  }, [items, nearMe, userCoords]);

  return (
    <section className="max-w-6xl mx-auto px-4 py-8" data-testid="business-list">
      <div className="mb-4 flex items-center justify-between">
        <BackButton />
        <NearMeToggle />
      </div>
      <h2 className="font-cond font-900 uppercase text-4xl text-white tracking-wide" style={{ color: cat?.color }}>
        {cat?.label}
      </h2>
      <p className="text-white/50 mt-1 text-base">{items.length} resultados en La Plata y alrededores.</p>

      {loading ? (
        <p className="text-white/40 mt-8">Cargando...</p>
      ) : items.length === 0 ? (
        <p className="text-white/40 mt-8" data-testid="empty-list">Todavia no hay talleres en esta categoria.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {ordered.map(({ b, d }) => <BusinessCard key={b.id} business={b} distanceKm={d} />)}
        </div>
      )}
    </section>
  );
}
