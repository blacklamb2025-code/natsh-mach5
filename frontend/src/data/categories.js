// Categories for AUTOMOTOS L.P.
// Order reflects backlog block 2:
//  - gnc moved before importadores
//  - papeles_vtv + asesoria_legal moved after personalizacion
//  - seguridad_airbag is "both"
export const CATEGORIES = [
  { slug: "mecanica", label: "Mecanica", vehicles: "both", color: "#FFD60A" },
  { slug: "chapa_pintura", label: "Chapa y Pintura", vehicles: "both", color: "#F97316" },
  { slug: "neumaticos", label: "Neumaticos", vehicles: "both", color: "#38BDF8" },
  { slug: "electrica", label: "Electrica", vehicles: "both", color: "#FACC15" },
  { slug: "optica", label: "Optica y Luces", vehicles: "auto", color: "#A78BFA" },
  { slug: "soldadura", label: "Soldadura", vehicles: "both", color: "#FB7185" },
  { slug: "grua", label: "Grua y Auxilio", vehicles: "both", color: "#FF2A3B" },
  { slug: "lavadero", label: "Lavadero", vehicles: "both", color: "#34D399" },
  { slug: "personalizacion", label: "Personalizacion", vehicles: "both", color: "#22D3EE" },
  { slug: "gnc", label: "GNC", vehicles: "auto", color: "#10B981" },
  { slug: "importadores", label: "Importadores", vehicles: "both", color: "#818CF8" },
  { slug: "papeles_vtv", label: "Papeles y VTV", vehicles: "both", color: "#94A3B8" },
  { slug: "asesoria_legal", label: "Asesoria Legal", vehicles: "both", color: "#CBD5E1" },
  { slug: "cascos", label: "Cascos e Indumentaria", vehicles: "moto", color: "#FFD60A" },
  { slug: "seguridad_airbag", label: "Seguridad y Airbag", vehicles: "both", color: "#EF4444" },
];

export function getCategoriesForVehicle(vehicle) {
  return CATEGORIES.filter((c) => c.vehicles === "both" || c.vehicles === vehicle);
}

export function getCategory(slug) {
  return CATEGORIES.find((c) => c.slug === slug);
}
