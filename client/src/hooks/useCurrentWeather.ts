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

const errMsg = (e: unknown) => (e instanceof Error ? e.message : String(e));

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
        const geoUrl
            = `https://geocoding-api.open-meteo.com/v1/search?`
              + `name=${encodeURIComponent(location)}&count=1&language=cs`;

        const geoRes = await fetch(geoUrl);
        if (!geoRes.ok) throw new Error("Geocoding failed");

        const geo = (await geoRes.json()) as {
          results?: { latitude: number; longitude: number }[];
        };
        const place = geo?.results?.[0];
        if (!place) throw new Error("Lokalita nenalezena");

        const wxUrl
            = `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}`
              + `&longitude=${place.longitude}`
              + `&current=temperature_2m,precipitation,weather_code,wind_speed_10m`;

        const wxRes = await fetch(wxUrl);
        if (!wxRes.ok) throw new Error("Počasí nedostupné");

        const wx = (await wxRes.json()) as {
          current_weather?: {
            temperature: number;
            windspeed: number;
            weathercode: number;
          };
        };

        const cur = wx.current_weather;
        if (!cur) throw new Error("Chybí aktuální data");

        const data: Weather = {
          temperature: cur.temperature,
          windSpeed: cur.windspeed,
          weatherCode: cur.weathercode,
        };

        if (!cancelled) setState({ loading: false, error: null, data });
      } catch (e: unknown) {
        if (!cancelled) {
          setState({ loading: false, error: errMsg(e), data: null });
        }
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [location]);

  return state;
}
