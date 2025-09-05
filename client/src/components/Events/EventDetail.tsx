import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { PollingEvent } from "../../types";
import Event from "../Event/Event";
import { useCurrentWeather } from "../../hooks/useCurrentWeather";

const errMsg = (e: unknown) => (e instanceof Error ? e.message : String(e));

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState<PollingEvent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        if (!id) {
          setError("Událost nenalezena");
          setEvent(null);
          return;
        }

        const res = await fetch(`/api/events/${id}`);
        if (res.status === 404) {
          setError("Událost nenalezena");
          setEvent(null);
          return;
        }
        if (!res.ok) {
          setError(`HTTP ${res.status}`);
          return;
        }

        const data = (await res.json()) as PollingEvent;
        if (!cancelled) {
          setEvent(data);
        }
      } catch (e: unknown) {
        if (!cancelled) {
          setError(errMsg(e));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <p>Načítám detail…</p>;
  }
  if (error) {
    return <p role="alert">{error}</p>;
  }
  if (!event) {
    return <p role="alert">Událost nenalezena.</p>;
  }

  const weather = useCurrentWeather(event.location);

  return (
    <div style={{ marginTop: "1rem" }}>
      <h2>{event.title}</h2>
      <Event
        id={String(event.id)}
        title={event.title}
        location={event.location}
        dates={event.dates}
      />

      <h3>Aktuální počasí</h3>
      {!event.location && <p>Pro tuto událost není uvedena lokalita.</p>}
      {event.location && (
        <>
          {weather.loading && <p>Načítám počasí…</p>}
          {weather.error && <p role="alert">Chyba počasí: {weather.error}</p>}
          {weather.data && (
            <ul aria-label="Počasí">
              <li>Teplota: {weather.data.temperature} °C</li>
              <li>Srážky: {weather.data.precipitation} mm</li>
              <li>Vítr: {weather.data.windSpeed} m/s</li>
              <li>Kód počasí: {weather.data.weatherCode}</li>
            </ul>
          )}
        </>
      )}
    </div>
  );
}
