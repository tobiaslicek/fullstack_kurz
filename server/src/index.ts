import express from "express";
import cors from "cors";
import {events} from "./data.js";
import type {PollingEvent} from "./types.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 4000;

app.get("/api/events", (_req, res) => {
    res.json({items: events});
});

app.get("/api/events/:id", (req, res) => {
    const id = Number(req.params.id);
    const found = events.find(e => e.id === id);
    if (!found) return res.status(404).json({error: "Event not found"});
    res.json(found);
});

app.post("/api/events", (req, res) => {
    const {name, location, title, dates} = req.body ?? {};

    if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({error: "title is required string"});
    }
    if (dates && (!Array.isArray(dates) || dates.length < 1 || dates.length > 10 || !dates.every((n: any) => Number.isFinite(n)))) {
        return res.status(400).json({error: "dates must be array of timestamps (1..10)"});
    }

    const nextId = events.length ? Math.max(...events.map(e => e.id)) + 1 : 1;
    const newEvent: PollingEvent = {
        id: nextId,
        location: typeof location === "string" && location.trim() ? location : undefined,
        title: title.trim(),
        dates: Array.isArray(dates)
            ? dates.map((ts: number) => ({timestamp: ts, records: []}))
            : []
    };

    void name;

    events.push(newEvent);
    return res.status(201).json(newEvent);
});

app.listen(PORT, () => {
    console.log(`API ready on http://localhost:${PORT}`);
});