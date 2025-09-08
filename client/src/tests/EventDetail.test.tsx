import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import EventDetail from "../components/Events/EventDetail";
import { mockFetch, ok, fail, restoreFetch } from "./mockFetch";

function renderWithRoute(id = "1") {
  return render(
    <MemoryRouter initialEntries={[`/events/${id}`]}>
      <Routes>
        <Route path="/events/:id" element={<EventDetail />} />
      </Routes>
    </MemoryRouter>
  );
}

const event1 = {
  id: 1,
  title: "Super akce",
  location: "Praha",
  dates: [],
};

describe("EventDetail", () => {
  afterEach(() => restoreFetch());

  it("zobrazí detail a počasí", async () => {
    mockFetch((url) => {
      if (url.endsWith("/api/events/1")) return ok(event1);

      if (url.startsWith("https://geocoding-api.open-meteo.com")) {
        return ok({ results: [{ latitude: 50.08, longitude: 14.43 }] });
      }
      if (url.startsWith("https://api.open-meteo.com")) {
        return ok({
          current: {
            temperature_2m: 18.2,
            precipitation: 0,
            wind_speed_10m: 2.5,
            weather_code: 1,
          },
        });
      }
      return fail(404);
    });

    renderWithRoute("1");

    await waitFor(() =>
      expect(screen.getByRole("list", { name: /Počasí/i })).toBeInTheDocument()
    );

    expect(screen.getByText(/Super akce/)).toBeInTheDocument();
    expect(screen.getByText(/Teplota:/)).toBeInTheDocument();
  });

  it("zobrazí chybu, když API počasí spadne", async () => {
    mockFetch((url) => {
      if (url.endsWith("/api/events/1")) return ok(event1);
      if (url.startsWith("https://geocoding-api.open-meteo.com")) {
        return ok({ results: [{ latitude: 50.08, longitude: 14.43 }] });
      }
      if (url.startsWith("https://api.open-meteo.com")) {
        return fail(500, { error: "wx down" });
      }
      return fail(404);
    });

    renderWithRoute("1");

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(/Chyba počasí/i)
    );
  });

  it("událost nenalezena", async () => {
    mockFetch((url) => {
      if (url.endsWith("/api/events/999")) return fail(404, { error: "Not found" });
      return fail(404);
    });

    renderWithRoute("999");

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(/Událost nenalezena/i)
    );
  });
});
