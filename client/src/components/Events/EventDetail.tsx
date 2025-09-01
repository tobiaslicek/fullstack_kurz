import { useParams, useOutletContext } from "react-router-dom";
import { PollingEvent } from "../../types";
import Event from "../Event/Event";

type OutletCtx = { data: PollingEvent[] };

export default function EventDetail() {
  const { id } = useParams();
  const { data } = useOutletContext<OutletCtx>();

  const event = data.find((e) => e.id === id);
  if (!event) return <p role="alert">Událost nenalezena.</p>;

  return (
    <div style={{ marginTop: "1rem" }}>
      <h2>Detail události</h2>
      {}
      <Event event={event} />
    </div>
  );
}
