// Free OpenStreetMap embed: no API key or extra install needed (needs internet).
export default function MapView({ business }) {
  if (!business) {
    return <div className="map-empty">Select a place to see it on the map.</div>;
  }
  const d = 0.008;
  const bbox = `${business.lng - d},${business.lat - d},${business.lng + d},${business.lat + d}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${business.lat},${business.lng}`;
  return <iframe className="map" title={`Map of ${business.name}`} src={src} loading="lazy" />;
}
