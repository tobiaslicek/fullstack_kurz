import { FormEvent, useState } from "react";

export default function NewEventForm() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [dates, setDates] = useState<number[]>([]);

  function addDate() {
    if (dates.length >= 10) return;
    setDates((d) => [...d, Date.now()]);
  }
  function removeDate(i: number) {
    setDates((d) => d.filter((_, idx) => idx !== i));
  }
  function replaceDate(i: number, value: string) {
    const ts = new Date(value).getTime();
    setDates((d) => d.map((v, idx) => (idx === i ? ts : v)));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      alert("Název je povinný");
      return;
    }
    if (dates.length === 0) {
      alert("Přidej alespoň jedno datum");
      return;
    }

    const payload = {
      name: "Team building", // dle zadání
      location: location || undefined,
      title,
      dates: dates.filter(Boolean),
    };

    try {
      await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      alert("Odesláno (endpoint zatím nefunkční).");
    } catch {
      alert("Chyba při odesílání.");
    }
  }

  return (
    <form onSubmit={onSubmit} aria-label="Nová událost">
      <h1>Nová událost</h1>

      <label>
        Název*{" "}
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Super akce"
        />
      </label>

      <br />

      <label>
        Místo{" "}
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Praha"
        />
      </label>

      <div style={{ marginTop: 12 }}>
        <button type="button" onClick={addDate} disabled={dates.length >= 10}>
          Přidat datum
        </button>
        {dates.length === 0 && <p>Je potřeba přidat alespoň jedno datum.</p>}
        <ul>
          {dates.map((ts, i) => (
            <li key={i}>
              <input
                type="datetime-local"
                onChange={(e) => replaceDate(i, e.target.value)}
              />
              <button type="button" onClick={() => removeDate(i)}>
                Smazat
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button type="submit" disabled={!title || dates.length === 0}>
        Odeslat
      </button>
    </form>
  );
}
