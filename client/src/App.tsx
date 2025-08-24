import "./App.css";
import Event from "./components/Event/Event";

function App() {
  return (
    <div className="App">
      <Event
        id="1"
        title="Grilování u Pavla"
        location="Pardubice"
        dates={[
          {
            timestamp: new Date("2025-09-01").getTime(),
            records: [
              { name: "Tobiáš", answer: "yes" },
              { name: "Radim", answer: "if-needed" },
            ],
          },
          {
            timestamp: new Date("2025-09-02").getTime(),
            records: [
              { name: "Tobiáš", answer: "no" },
              { name: "Radim", answer: "yes" },
              { name: "Kuba", answer: "yes" },
            ],
          },
        ]}
      />
    </div>
  );
}

export default App;
