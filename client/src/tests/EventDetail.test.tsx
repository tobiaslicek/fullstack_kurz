import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import EventDetail from "../components/Events/EventDetail";
import EventsList from "../components/Events/EventsList";

const ok = (data: any) => new Response(JSON.stringify(data), { status: 200 });

const data = [
  { title: "Tým building", id: "1", location: "Praha", dates: [] },
];

describe("EventDetail", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("zobrazí detail a počasí", async () => {
    vi.spyOn(global, "fetch").mockImplementation((url: any) => {
      const u = String(url);
      if (u.includes("geocoding-api.open-meteo.com")) {
        return Promise.resolve(ok({ results: [{ latitude: 50.087, longitude: 14.421 }] }));
      }
      if (u.includes("api.open-meteo.com")) {
        return Promise.resolve(ok({
          current: { temperature_2m: 22.5, precipitation: 0, wind_speed_10m: 3.5, weather_code: 1 }
        }));
      }
      return Promise.resolve(new Response("", { status: 404 }));
    });

    render(
      <MemoryRouter initialEntries={["/events/1"]}>
        <Routes>
          <Route path="/events" element={<EventsList data={data as any} />}>
            <Route path=":id" element={<EventDetail />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // čekáme na počasí
    await waitFor(() =>
      expect(screen.getByRole("list", { name: /Počasí/i })).toBeInTheDocument()
    );
    expect(screen.getByText(/Teplota: 22\.5/)).toBeInTheDocument();
  });

  it("zobrazí chybu, když API spadne", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(new Response("", { status: 500 }));

    render(
      <MemoryRouter initialEntries={["/events/1"]}>
        <Routes>
          <Route path="/events" element={<EventsList data={data as any} />}>
            <Route path=":id" element={<EventDetail />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(/Chyba počasí/i)
    );
  });

  it("událost nenalezena", () => {
    render(
      <MemoryRouter initialEntries={["/events/999"]}>
        <Routes>
          <Route path="/events" element={<EventsList data={data as any} />}>
            <Route path=":id" element={<EventDetail />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole("alert")).toHaveTextContent(/Událost nenalezena/i);
  });
});
