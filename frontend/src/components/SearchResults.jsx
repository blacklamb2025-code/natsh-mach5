import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { BackButton } from "@/components/bits";
import { BusinessCard } from "@/components/BusinessCard";

export function SearchResults({ query }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api.search(query).then((d) => { if (alive) { setItems(d); setLoading(false); } }).catch(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [query]);

  return (
    <section className="max-w-6xl mx-auto px-4 py-8" data-testid="search-results">
      <div className="mb-4"><BackButton /></div>
      <h2 className="font-cond font-900 uppercase text-4xl text-white tracking-wide">
        Resultados <span className="text-[#FFD60A]">"{query}"</span>
      </h2>
      <p className="text-white/50 mt-1 text-base">{items.length} coincidencias.</p>

      {loading ? (
        <p className="text-white/40 mt-8">Buscando...</p>
      ) : items.length === 0 ? (
        <p className="text-white/40 mt-8" data-testid="search-empty">No encontramos nada para "{query}".</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {items.map((b) => <BusinessCard key={b.id} business={b} />)}
        </div>
      )}
    </section>
  );
}
