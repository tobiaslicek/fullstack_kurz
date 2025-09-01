import { Link, Outlet } from "react-router-dom";
import { PollingEvent } from "../../types";

type Props = { data: PollingEvent[] };

export default function EventsList({ data }: Props) {
  if (!data?.length) return <p>Žádné události.</p>;

  return (
    <div>
      <h1>Události</h1>
      <ul aria-label="Seznam událostí">
        {data.map((evt) => (
          <li key={evt.id}>
            <strong>{evt.title}</strong>{" "}
            <Link to={`/events/${evt.id}`}>detail</Link>
          </li>
        ))}
      </ul>

      <Outlet context={{ data }} />
    </div>
  );
}
