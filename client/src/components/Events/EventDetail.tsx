import { useParams, useOutletContext } from "react-router-dom";
import type { PollingEvent } from "../../types";
import Event from "../Event/Event";
import { useCurrentWeather } from "../../hooks/useCurrentWeather";

type OutletCtx = { data: PollingEvent[] };

export default function EventDetail() {
  const { id } = useParams();
  const { data } = useOutletContext<OutletCtx>();
  const event = data.find((e) => e.id === id);

  if (!event) return <p role="alert">Událost nenalezena.</p>;

  const { loading, error, data: wx } = useCurrentWeather(event.location);

  return (
    <div style={{ marginTop: "1rem" }}>
      <h2>Detail události</h2>

      {/* tvoje tabulka/komponenta z minula */}
      <Event {...event} />

      <h3>Aktuální počasí</h3>
      {!event.location && <p>Pro tuto událost není uvedena lokalita.</p>}
      {event.location && (
        <>
          {loading && <p>Načítám počasí…</p>}
          {error && <p role="alert">Chyba počasí: {error}</p>}
          {wx && (
            <ul aria-label="Počasí">
              <li>Teplota: {wx.temperature} °C</li>
              <li>Srážky: {wx.precipitation} mm</li>
              <li>Vítr: {wx.windSpeed} m/s</li>
              <li>Kód počasí: {wx.weatherCode}</li>
            </ul>
          )}
        </>
      )}
    </div>
  );
}
