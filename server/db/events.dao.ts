import { db } from './sqlite';

export type NewEvent = {
    title: string;
    location?: string;
    note?: string;
    dates: number[];
};

export type EventRow = {
    id: number;
    title: string;
    location: string | null;
    note: string | null;
    created_at: number;
};

export type EventDateRow = {
    id: number;
    event_id: number;
    starts_at_ms: number;
};

export type EventWithDates = EventRow & {
    dates: { id: number; starts_at_ms: number }[];
};

export type RsvpView = {
    id: number;
    name: string;
    email: string | null;
    status: 'yes' | 'no' | 'maybe';
    comment: string | null;
    created_at: number;
    date_id: number;
    starts_at_ms: number;
};

export function listEvents(): (EventRow & { dates: number[] })[] {
    const rows = db.prepare('SELECT * FROM events ORDER BY id DESC').all() as EventRow[];
    const getDates = db.prepare('SELECT starts_at_ms FROM event_dates WHERE event_id=? ORDER BY starts_at_ms ASC');
    return rows.map((e) => ({
        ...e,
        dates: (getDates.all(e.id) as { starts_at_ms: number }[]).map((d) => d.starts_at_ms),
    }));
}

export function getEventById(id: number): EventWithDates | undefined {
    const ev = db.prepare('SELECT * FROM events WHERE id=?').get(id) as EventRow | undefined;
    if (!ev) return undefined;
    const dates = db
        .prepare('SELECT id, starts_at_ms FROM event_dates WHERE event_id=? ORDER BY starts_at_ms ASC')
        .all(id) as { id: number; starts_at_ms: number }[];
    return { ...ev, dates };
}

export function createEvent(input: NewEvent): EventWithDates {
    const res = db
        .prepare('INSERT INTO events (title, location, note) VALUES (@title, @location, @note)')
        .run({ title: input.title, location: input.location ?? null, note: input.note ?? null });
    const eventId = Number(res.lastInsertRowid);
    if (input.dates.length) {
        const insertDate = db.prepare('INSERT INTO event_dates (event_id, starts_at_ms) VALUES (?, ?)');
        const tx = db.transaction((dates: number[]) => {
            for (const ts of dates) insertDate.run(eventId, Number(ts));
        });
        tx(input.dates);
    }
    return getEventById(eventId)!;
}

export function listRsvpsByEvent(eventId: number): RsvpView[] {
    const stmt = db.prepare(
        `SELECT r.id, r.name, r.email, r.status, r.comment, r.created_at, r.date_id, d.starts_at_ms
     FROM rsvps r
     JOIN event_dates d ON d.id = r.date_id
     WHERE r.event_id = ?
     ORDER BY r.created_at DESC`
    );
    return stmt.all(eventId) as RsvpView[];
}

export function addRsvp(params: {
    eventId: number;
    dateId: number;
    name: string;
    email?: string;
    status: 'yes' | 'no' | 'maybe';
    comment?: string;
}): RsvpView[] {
    db.prepare(
        'INSERT INTO rsvps (event_id, date_id, name, email, status, comment) VALUES (@eventId, @dateId, @name, @email, @status, @comment)'
    ).run({
        eventId: params.eventId,
        dateId: params.dateId,
        name: params.name,
        email: params.email ?? null,
        status: params.status,
        comment: params.comment ?? null,
    });
    return listRsvpsByEvent(params.eventId);
}