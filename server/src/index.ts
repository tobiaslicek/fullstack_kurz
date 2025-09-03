import express, { type Request, type Response } from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 4000;

type Answer = "yes" | "no" | "if-needed";
type UserRecord = { name: string; answer: Answer };
type DateRecord = { timestamp: number; records: UserRecord[] };
type PollingEvent = { id: number; location?: string; title: string; dates: DateRecord[] };

type NewEventBody = {
    title: string;
    location?: string;
    dates: number[];
};

const events: PollingEvent[] = [
];

app.get("/api/events", (_req: Request, res: Response<{ items: PollingEvent[] }>) => {
    res.json({ items: events });
});

app.get(
    "/api/events/:id",
    (req: Request<{ id: string }>, res: Response<PollingEvent | { error: string }>) => {
        const id = Number(req.params.id);
        const event = events.find((e) => e.id === id);
        if (!event) return res.status(404).json({ error: "Not found" });
        res.json(event);
    }
);

app.post(
    "/api/events",
    (
        req: Request<Record<string, never>, PollingEvent | { error: string }, NewEventBody>,
        res: Response
    ) => {
        const { title, location, dates } = req.body;

        if (title.trim() === "") {
            return res.status(400).json({ error: "Invalid title" });
        }
        if (
            !Array.isArray(dates) ||
            dates.length < 1 ||
            dates.length > 10 ||
            !dates.every((d) => Number.isFinite(d))
        ) {
            return res.status(400).json({ error: "Invalid dates" });
        }

        const lastId = events.length ? events[events.length - 1].id : 0;
        const id = lastId + 1;

        const newEvent: PollingEvent = {
            id,
            title: title.trim(),
            location: typeof location === "string" && location.trim() ? location.trim() : undefined,
            dates: dates.map((ts) => ({ timestamp: Number(ts), records: [] })),
        };

        events.push(newEvent);
        return res.status(201).json(newEvent);
    }
);

app.listen(PORT, () => {
    console.log(`API ready on http://localhost:${PORT}`);
});