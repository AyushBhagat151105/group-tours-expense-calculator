export async function fetchLocationImage(location: string): Promise<string> {
  const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(location)}&client_id=${accessKey}&orientation=landscape`
  );

  if (!response.ok) throw new Error("Failed to fetch image");

  const data = await response.json();

  if (data.results && data.results.length > 0) {
    return data.results[0].urls.small;
  }

  return "/default-trip.jpeg"; // Optional fallback image
}
