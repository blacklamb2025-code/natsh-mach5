import React from "react";
import {
  Wrench, PaintBucket, CircleDot, Zap, Lightbulb, Flame, Truck, Droplets,
  Sparkles, Fuel, PackageSearch, FileCheck2, Scale, HardHat, ShieldCheck,
} from "lucide-react";
import { getCategory } from "@/data/categories";

const MAP = {
  mecanica: Wrench,
  chapa_pintura: PaintBucket,
  neumaticos: CircleDot,
  electrica: Zap,
  optica: Lightbulb,
  soldadura: Flame,
  grua: Truck,
  lavadero: Droplets,
  personalizacion: Sparkles,
  gnc: Fuel,
  importadores: PackageSearch,
  papeles_vtv: FileCheck2,
  asesoria_legal: Scale,
  cascos: HardHat,
  seguridad_airbag: ShieldCheck,
};

export function CategoryIcon({ slug, className = "w-6 h-6", style }) {
  const Icon = MAP[slug] || Wrench;
  const cat = getCategory(slug);
  return <Icon className={className} style={{ color: cat?.color, ...style }} />;
}
