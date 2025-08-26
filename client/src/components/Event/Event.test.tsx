import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Event from "./Event";

describe("Event component", () => {
  it("zobrazí název a místo", () => {
    render(
      <Event
        id="1"
        title="Svatba"
        location="Hrad"
        dates={[
          {
            timestamp: new Date("2025-09-01").getTime(),
            records: [],
          },
        ]}
      />
    );
    expect(screen.getByText("Svatba")).toBeInTheDocument();
    expect(screen.getByText(/Místo:/)).toBeInTheDocument();
    expect(screen.getByText("Hrad")).toBeInTheDocument();
  });

  it("zobrazí hlášku při prázdném seznamu datumů", () => {
    render(<Event id="2" title="Prázdná událost" dates={[]} />);
    expect(screen.getByText("Žádná data k zobrazení.")).toBeInTheDocument();
  });

  it("zobrazí tabulku s účastníky", () => {
    render(
      <Event
        id="3"
        title="Meeting"
        dates={[
          {
            timestamp: new Date("2025-09-01").getTime(),
            records: [
              { name: "Tobiáš", answer: "yes" },
              { name: "Kuba", answer: "no" },
            ],
          },
          {
            timestamp: new Date("2025-09-02").getTime(),
            records: [{ name: "Tobiáš", answer: "if-needed" }],
          },
        ]}
      />
    );

    // Účastníci
    expect(screen.getByText("Tobiáš")).toBeInTheDocument();
    expect(screen.getByText("Kuba")).toBeInTheDocument();

    // Odpovědi
    expect(screen.getByText("✅")).toBeInTheDocument();
    expect(screen.getByText("❌")).toBeInTheDocument();
    expect(screen.getByText("➖")).toBeInTheDocument();
  });
});
