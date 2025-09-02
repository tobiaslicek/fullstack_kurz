import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { PollingEvent } from "../../types";

const errMsg = (e: unknown) => (e instanceof Error ? e.message : String(e));

export default function EventsList() {
  const [items, setItems] = useState<PollingEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/events");
        if (!res.ok) {
          setError(`HTTP ${res.status}`);
          return;
        }
        const json = (await res.json()) as { items: PollingEvent[] };
        if (!cancelled) {
          setItems(json.items ?? []);
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
  }, []);

  if (loading) {
    return <p>Načítám…</p>;
  }
  if (error) {
    return <p role="alert">Chyba: {error}</p>;
  }
  if (items.length === 0) {
    return <p>Žádné události.</p>;
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>Události</h1>
      <ul aria-label="Seznam událostí">
        {items.map((evt) => (
          <li key={evt.id}>
            <strong>{evt.title}</strong>{" "}
            <Link to={`/events/${evt.id}`}>detail</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
