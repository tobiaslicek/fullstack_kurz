import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <nav style={{ padding: "1rem", borderBottom: "1px solid #eee", marginBottom: "1rem" }}>
      <Link to="/events" style={{ marginRight: "1rem" }}>Události</Link>
      <Link to="/events/new">Nová událost</Link>
    </nav>
  );
}
