import { useEffect, useState } from "react";

type Weather = {
  temperature?: number;
  precipitation?: number;
  windSpeed?: number;
  weatherCode?: number;
};

type WeatherState = {
  loading: boolean;
  error: string | null;
  data: Weather | null;
};

export function useCurrentWeather(location?: string) {
  const [state, setState] = useState<WeatherState>({
    loading: !!location,
    error: null,
    data: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!location) {
        setState({ loading: false, error: null, data: null });
        return;
      }

      setState({ loading: true, error: null, data: null });
      try {
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            location
          )}&count=1&language=cs`
        );
        if (!geoRes.ok) throw new Error("Geocoding failed");
        const geo = await geoRes.json();
        const place = geo?.results?.[0];
        if (!place) throw new Error("Lokalita nenalezena");

        const wxRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,precipitation,weather_code,wind_speed_10m`
        );
        if (!wxRes.ok) throw new Error("Počasí nedostupné");
        const wx = await wxRes.json();
        const cur = wx?.current;
        if (!cur) throw new Error("Chybí aktuální data");

        const data: Weather = {
          temperature: cur.temperature_2m,
          precipitation: cur.precipitation,
          windSpeed: cur.wind_speed_10m,
          weatherCode: cur.weather_code,
        };
        if (!cancelled) setState({ loading: false, error: null, data });
      } catch (e: any) {
        if (!cancelled)
          setState({ loading: false, error: e?.message ?? "Chyba", data: null });
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [location]);

  return state;
}
