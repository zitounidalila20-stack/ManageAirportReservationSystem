import { useEffect, useState } from "react";
import axios from "axios";
import DynamicTable from "../generalcompenents/DynamicTable";

export default function AssignGateAndRunway() {
  const [flights, setFlights] = useState([]);
  const [gates, setGates] = useState([]);
  const [runways, setRunways] = useState([]);

  const [selectedFlight, setSelectedFlight] = useState(null);
  const [gateId, setGateId] = useState("");
  const [runwayId, setRunwayId] = useState("");

  const [loading, setLoading] = useState(false);

  // ================= FETCH DATA =================
  useEffect(() => {
    fetchFlights();
    fetchGates();
    fetchRunways();
  }, []);

  const fetchFlights = async () => {
    const res = await axios.get("http://localhost:5000/flights");
    setFlights(res.data);
  };

  const fetchGates = async () => {
    const res = await axios.get("http://localhost:5000/gates");
    setGates(res.data);
  };

  const fetchRunways = async () => {
    const res = await axios.get("http://localhost:5000/runways");
    setRunways(res.data);
  };

  // ================= ASSIGN FUNCTION =================
  const assignLogistics = async () => {
    if (!selectedFlight || !gateId || !runwayId) {
      alert("Please select flight, gate and runway");
      return;
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:5000/assign-logistics", {
        flightId: selectedFlight,
        gateId,
        runwayId,
      });

      alert("Logistics assigned successfully");

      // refresh data
      fetchFlights();
      setSelectedFlight(null);
      setGateId("");
      setRunwayId("");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  // ================= TABLE CONFIG =================
  const columns = [
    { id: 1, name: "Flight ID", key: "flightID" },
    { id: 2, name: "Airline", key: "airline" },
    { id: 3, name: "Origin", key: "origin" },
    { id: 4, name: "Destination", key: "destination" },
    { id: 5, name: "Gate", key: "gateID" },
    { id: 6, name: "Runway", key: "runwayID" },
    {
      id: 7,
      name: "Action",
      key: "action",
      render: (_, row) => (
        <button
          onClick={() => setSelectedFlight(row.flightID)}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Assign
        </button>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">

      {/* ================= TABLE ================= */}
      <DynamicTable columns={columns} data={flights} />

      {/* ================= MODAL / FORM ================= */}
      {selectedFlight && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          
          <div className="bg-white p-6 rounded-xl w-[400px] space-y-4">

            <h2 className="text-xl font-bold">
              Assign Logistics (Flight {selectedFlight})
            </h2>

            {/* GATE */}
            <select
              value={gateId}
              onChange={(e) => setGateId(e.target.value)}
              className="w-full border p-2"
            >
              <option value="">Select Gate</option>
              {gates.map((g) => (
                <option key={g.gateID} value={g.gateID}>
                  Gate {g.gateID}
                </option>
              ))}
            </select>

            {/* RUNWAY */}
            <select
              value={runwayId}
              onChange={(e) => setRunwayId(e.target.value)}
              className="w-full border p-2"
            >
              <option value="">Select Runway</option>
              {runways.map((r) => (
                <option key={r.runwayID} value={r.runwayID}>
                  Runway {r.runwayID}
                </option>
              ))}
            </select>

            {/* BUTTONS */}
            <div className="flex justify-between">
              <button
                onClick={() => setSelectedFlight(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={assignLogistics}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                {loading ? "Assigning..." : "Confirm"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}