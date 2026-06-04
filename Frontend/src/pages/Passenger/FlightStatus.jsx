import { useState } from "react";
import axios from "axios";
import { Plane, Search, Clock, MapPin, AlertCircle } from "lucide-react";

export default function FlightStatus() {
  const [flightNumber, setFlightNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [flight, setFlight] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!flightNumber.trim()) {
      setError("Please enter a flight number.");
      return;
    }

    setLoading(true);
    setError("");
    setFlight(null);

    try {
      const res = await axios.get(
        `http://localhost:5000/flightStatus/${flightNumber.trim()}`
      );

      setFlight(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Flight not found. Please check the number."
      );
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status = "") => {
    switch (status.toLowerCase()) {
      case "on time":
        return "text-green-600 bg-green-100 border-green-200";

      case "delayed":
        return "text-yellow-600 bg-yellow-100 border-yellow-200";

      case "cancelled":
        return "text-red-600 bg-red-100 border-red-200";

      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center p-6 text-slate-900 bg-slate-50">
      {/* 🌈 ANIMATED BACKGROUND */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-sky-200/40 to-blue-100/30 blur-[120px] pointer-events-none" />

      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-bl from-cyan-200/40 to-teal-100/20 blur-[140px] pointer-events-none" />

      <div className="absolute w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-3xl animate-pulse top-[-150px] left-[-150px]" />

      <div className="absolute w-[600px] h-[600px] bg-cyan-400/30 rounded-full blur-3xl animate-pulse bottom-[-200px] right-[-200px]" />

      <div className="absolute w-[400px] h-[400px] bg-purple-300/20 rounded-full blur-3xl animate-pulse top-[40%] left-[30%]" />

      {/* subtle grid */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]" />

      {/* HEADER */}
      <div className="relative z-10 text-center mt-20 mb-10">
        <h1 className="text-4xl font-bold">Flight Status</h1>
        <p className="text-slate-500 mt-2">
          Track your flight in real time ✈️
        </p>
      </div>

      {/* SEARCH */}
      <div className="relative z-10 w-full max-w-xl flex gap-2 bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl p-2 shadow-lg">
        <input
          type="text"
          placeholder="Enter flight number (e.g. AA123)"
          value={flightNumber}
          onChange={(e) => setFlightNumber(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1 bg-transparent outline-none px-4 text-slate-900"
        />

        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-3 rounded-xl flex items-center gap-2"
        >
          <Search size={18} />
          Search
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="relative z-10 mt-10 flex items-center gap-2 text-slate-600">
          <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          Searching flight...
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="relative z-10 mt-10 flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* RESULT CARD */}
      {flight && (
        <div className="relative z-10 mt-10 w-full max-w-2xl bg-white/70 backdrop-blur-xl border border-slate-200 rounded-3xl p-8 shadow-2xl">
          {/* TOP */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Plane />
              {flight.flight_number}
            </h2>

            <span
              className={`px-4 py-1 rounded-full text-sm font-semibold border ${statusColor(
                flight.status
              )}`}
            >
              {flight.status}
            </span>
          </div>

          {/* INFO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700">
            <div className="flex items-center gap-2">
              <MapPin size={18} />
              <div>
                <p className="text-slate-400 text-sm">From</p>
                <p className="font-medium">{flight.origin}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MapPin size={18} />
              <div>
                <p className="text-slate-400 text-sm">To</p>
                <p className="font-medium">{flight.destination}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock size={18} />
              <div>
                <p className="text-slate-400 text-sm">Departure</p>
                <p className="font-medium">{flight.departure_time}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock size={18} />
              <div>
                <p className="text-slate-400 text-sm">Arrival</p>
                <p className="font-medium">
                  {flight.arrival_time || "TBD"}
                </p>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="mt-6 text-sm text-slate-500">
            ✨ Real-time flight tracking with modern UI experience
          </div>
        </div>
      )}
    </div>
  );
}