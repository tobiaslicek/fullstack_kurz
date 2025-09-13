import express, { type Request, type Response } from 'express';
import cors from 'cors';
import {
    createEvent,
    getEventById,
    listEvents,
    listRsvpsByEvent,
    addRsvp,
} from '../db/events.dao';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 4000;

type NewEventBody = {
    title: string;
    location?: string;
    dates: number[];
};

app.get('/api/events', (_req: Request, res: Response<{ items: any[] }>) => {
    res.json({ items: listEvents() });
});

app.get('/api/events/:id', (req: Request<{ id: string }>, res: Response) => {
    const id = Number(req.params.id);
    const ev = getEventById(id);
    if (!ev) return res.status(404).json({ error: 'Not found' });
    res.json(ev);
});

app.post(
    '/api/events',
    (req: Request<Record<string, never>, any, NewEventBody>, res: Response) => {
        const { title, location, dates } = req.body;
        if (!title || title.trim() === '') return res.status(400).json({ error: 'Invalid title' });
        if (
            !Array.isArray(dates) ||
            dates.length < 1 ||
            dates.length > 10 ||
            !dates.every((d) => Number.isFinite(d))
        ) {
            return res.status(400).json({ error: 'Invalid dates' });
        }
        const created = createEvent({
            title: title.trim(),
            location: typeof location === 'string' && location.trim() ? location.trim() : undefined,
            note: undefined,
            dates: dates.map(Number),
        });
        res.status(201).json(created);
    }
);

app.get('/api/events/:id/rsvps', (req: Request<{ id: string }>, res: Response) => {
    const eventId = Number(req.params.id);
    const ev = getEventById(eventId);
    if (!ev) return res.status(404).json({ error: 'Event not found' });
    res.json(listRsvpsByEvent(eventId));
});

app.post('/api/events/:id/rsvps', (req: Request<{ id: string }>, res: Response) => {
    const eventId = Number(req.params.id);
    const { dateId, name, email, status, comment } = req.body ?? {};
    if (!dateId || !name || !['yes', 'no', 'maybe'].includes(status)) {
        return res.status(400).json({ error: 'dateId, name and valid status are required' });
    }
    const ev = getEventById(eventId);
    if (!ev) return res.status(404).json({ error: 'Event not found' });
    const belongs = (ev.dates as any[]).some((d) => d.id === Number(dateId));
    if (!belongs) return res.status(400).json({ error: 'dateId does not belong to this event' });
    const rsvps = addRsvp({
        eventId,
        dateId: Number(dateId),
        name: String(name),
        email: typeof email === 'string' ? email : undefined,
        status,
        comment: typeof comment === 'string' ? comment : undefined,
    });
    res.status(201).json(rsvps);
});

app.listen(PORT, () => {
    console.log(`API ready on http://localhost:${PORT}`);
});