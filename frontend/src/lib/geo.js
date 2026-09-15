// Aproximate coordinates for La Plata zones (for "Cerca de mi" ordering)
export const ZONE_COORDS = {
  "Casco Urbano": [-34.9214, -57.9544],
  "Los Hornos": [-34.9400, -57.9700],
  "Tolosa": [-34.9000, -57.9700],
  "City Bell": [-34.8700, -58.0450],
  "Gonnet": [-34.8800, -58.0100],
  "Villa Elisa": [-34.8600, -58.0800],
  "Berisso": [-34.8720, -57.8880],
  "Ensenada": [-34.8560, -57.9110],
  "Meridiano V": [-34.9320, -57.9450],
  "Zona Hospitalaria": [-34.9095, -57.9440],
};

const DEFAULT_COORD = [-34.9214, -57.9544];

export function coordsForBusiness(b) {
  return ZONE_COORDS[b.zone] || DEFAULT_COORD;
}

export function haversineKm(a, b) {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLng = ((b[1] - a[1]) * Math.PI) / 180;
  const lat1 = (a[0] * Math.PI) / 180;
  const lat2 = (b[0] * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}
