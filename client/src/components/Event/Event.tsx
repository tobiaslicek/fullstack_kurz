import React from "react";
import EventHeader from "./EventHeader";

type UserRecord = {
  name: string;
  answer: "yes" | "no" | "if-needed";
};

type DateRecord = {
  timestamp: number;
  records: UserRecord[];
};

export type EventProps = {
  location?: string;
  id: string;
  title: string;
  dates: DateRecord[];
};

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("cs-CZ", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

const getAllUsers = (dates: DateRecord[]): string[] => {
  const userSet = new Set<string>();
  dates.forEach((date) => {
    date.records.forEach((r) => userSet.add(r.name));
  });
  return Array.from(userSet);
};

const getAnswer = (records: UserRecord[], user: string): string => {
  const record = records.find((r) => r.name === user);
  if (!record) return "-";
  switch (record.answer) {
    case "yes":
      return "✅";
    case "no":
      return "❌";
    case "if-needed":
      return "➖";
    default:
      return "-";
  }
};

const Event: React.FC<EventProps> = ({ location, title, dates }) => {
  if (dates.length === 0) {
    return <p>Žádná data k zobrazení.</p>;
  }

  const users = getAllUsers(dates);

  return (
    <div>
      <EventHeader title={title} location={location} />
      <table>
        <thead>
          <tr>
            <th>Účastník</th>
            {dates.map((date) => (
              <th key={date.timestamp}>{formatDate(date.timestamp)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user}>
              <td>{user}</td>
              {dates.map((date) => (
                <td key={date.timestamp}>{getAnswer(date.records, user)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Event;
