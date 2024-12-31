const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export async function searchLocation(query: string) {
  const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    query
  )}.json?access_token=${MAPBOX_TOKEN}&types=place,address&limit=1`;

  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error('Failed to search location');
  }

  const data = await response.json();
  return data.features.map((feature: any) => ({
    id: feature.id,
    text: feature.text,
    place_name: feature.place_name,
    center: feature.center,
  }));
}