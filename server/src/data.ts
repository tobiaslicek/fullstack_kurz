// server/src/data.ts
export type Answer = "yes" | "no" | "if-needed";
export type UserRecord = { name: string; answer: Answer };
export type DateRecord = { timestamp: number; records: UserRecord[] };
export type PollingEvent = { id: number; location?: string; title: string; dates: DateRecord[] };

export const events: PollingEvent[] = [
    {
        id: 1,
        location: "Praha",
        title: "Super akce",
        dates: [
            {
                timestamp: 1726514405258,
                records: [
                    { name: "Honza", answer: "yes" },
                    { name: "Jana", answer: "no" },
                ],
            },
            {
                timestamp: 1726600861177,
                records: [{ name: "Jana", answer: "no" }],
            },
        ],
    },
    {
        id: 2,
        location: "Brno",
        title: "Super akce 2",
        dates: [
            {
                timestamp: 1726514405258,
                records: [
                    { name: "Honza", answer: "no" },
                    { name: "Jana", answer: "no" },
                    { name: "Petr", answer: "no" },
                ],
            },
            {
                timestamp: 1726600861177,
                records: [{ name: "Jana", answer: "no" }],
            },
        ],
    },
];