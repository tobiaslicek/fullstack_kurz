export type Answer = "yes" | "no" | "if-needed";
export type UserRecord = { name: string; answer: Answer };
export type DateRecord = { timestamp: number; records: UserRecord[] };
export type PollingEvent = {
    id: number;
    location?: string;
    title: string;
    dates: DateRecord[];
};