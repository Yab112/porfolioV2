import { buildGeoJsonLd } from "@/lib/geo-structured-data";

export function GeoJsonLd() {
  const json = buildGeoJsonLd();
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
