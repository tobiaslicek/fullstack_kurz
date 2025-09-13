import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

const DB_DIR = __dirname;
const DB_FILE = path.join(DB_DIR, 'app.db');

if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

export const db = new Database(DB_FILE);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
    CREATE TABLE IF NOT EXISTS events
    (
        id
        INTEGER
        PRIMARY
        KEY
        AUTOINCREMENT,
        title
        TEXT
        NOT
        NULL,
        location
        TEXT,
        note
        TEXT,
        created_at
        INTEGER
        NOT
        NULL
        DEFAULT (
        strftime
    (
        '%s',
        'now'
    ))
        );

    CREATE TABLE IF NOT EXISTS event_dates
    (
        id
        INTEGER
        PRIMARY
        KEY
        AUTOINCREMENT,
        event_id
        INTEGER
        NOT
        NULL,
        starts_at_ms
        INTEGER
        NOT
        NULL,
        FOREIGN
        KEY
    (
        event_id
    ) REFERENCES events
    (
        id
    ) ON DELETE CASCADE
        );
    CREATE INDEX IF NOT EXISTS idx_event_dates_event_id ON event_dates(event_id);
    CREATE INDEX IF NOT EXISTS idx_event_dates_starts_at ON event_dates(starts_at_ms);

    CREATE TABLE IF NOT EXISTS rsvps
    (
        id
        INTEGER
        PRIMARY
        KEY
        AUTOINCREMENT,
        event_id
        INTEGER
        NOT
        NULL,
        date_id
        INTEGER
        NOT
        NULL,
        name
        TEXT
        NOT
        NULL,
        email
        TEXT,
        status
        TEXT
        NOT
        NULL
        CHECK (
        status
        IN
    (
        'yes',
        'no',
        'maybe'
    )),
        comment TEXT,
        created_at INTEGER NOT NULL DEFAULT
    (
        strftime
    (
        '%s',
        'now'
    )),
        FOREIGN KEY
    (
        event_id
    ) REFERENCES events
    (
        id
    ) ON DELETE CASCADE,
        FOREIGN KEY
    (
        date_id
    ) REFERENCES event_dates
    (
        id
    )
      ON DELETE CASCADE
        );
    CREATE INDEX IF NOT EXISTS idx_rsvps_event ON rsvps(event_id);
    CREATE INDEX IF NOT EXISTS idx_rsvps_date ON rsvps(date_id);
`);