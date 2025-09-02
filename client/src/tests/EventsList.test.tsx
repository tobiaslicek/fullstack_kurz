import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import EventsList from "../components/Events/EventsList";

const data = [
  { title: "Tým building", id: "1", location: "Praha", dates: [] },
];

describe("EventsList", () => {
  it("zobrazí list událostí a link na detail", () => {
    render(
      <MemoryRouter initialEntries={["/events"]}>
        <Routes>
          <Route path="/events" element={<EventsList data={data as any} />} />
        </Routes>
      </MemoryRouter>
    );

    const list = screen.getByRole("list", { name: /Seznam událostí/i });
    expect(list).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /detail/i })).toHaveAttribute(
      "href",
      "/events/1"
    );
  });
});
