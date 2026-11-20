/** Caricamento on-demand della Maps JavaScript API (solo dopo il consenso). */
let promise: Promise<typeof google.maps> | null = null;

export function loadGoogleMaps(key: string, language: string): Promise<typeof google.maps> {
  if (promise) return promise;
  promise = new Promise((resolve, reject) => {
    const cb = `__gmaps_cb_${Date.now()}`;
    (window as unknown as Record<string, () => void>)[cb] = () => resolve(google.maps);
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&v=weekly&loading=async&language=${language}&region=IT&callback=${cb}`;
    s.async = true;
    s.onerror = () => {
      promise = null;
      reject(new Error("Google Maps non caricata"));
    };
    document.head.appendChild(s);
  });
  return promise;
}
