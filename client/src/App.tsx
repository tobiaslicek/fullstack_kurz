import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Nav from "./components/Nav";
import EventsList from "./components/Events/EventsList";
import EventDetail from "./components/Events/EventDetail";
import NewEventForm from "./components/Events/NewEventForm";
import { eventsData } from "./data/events";

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Navigate to="/events" replace />} />
        <Route path="/events" element={<EventsList data={eventsData} />}>
          <Route path=":id" element={<EventDetail />} />
        </Route>
        <Route path="/events/new" element={<NewEventForm />} />
        <Route path="*" element={<div>404 – nic tu není</div>} />
      </Routes>
    </BrowserRouter>
  );
}
