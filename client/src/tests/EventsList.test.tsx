import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import EventsList from "../components/Events/EventsList";
import { mockFetch, ok, restoreFetch } from "./mockFetch";

describe("EventsList", () => {
  beforeEach(() => {
    mockFetch((url) => {
      if (url.endsWith("/api/events")) {
        return ok({
          items: [
            { id: 1, title: "Super akce", location: "Praha", dates: [] },
            { id: 2, title: "Super akce 2", location: "Brno", dates: [] },
          ],
        });
      }
      return ok({});
    });
  });
  afterEach(() => restoreFetch());

  it("zobrazí list událostí a link na detail", async () => {
    render(<EventsList />);

    const list = await screen.findByRole("list", { name: /Seznam událostí/i });
    expect(list).toBeInTheDocument();

    expect(screen.getByRole("link", { name: /detail/i })).toHaveAttribute(
      "href",
      "/events/1"
    );
  });
});
