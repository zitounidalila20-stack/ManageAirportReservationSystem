export default function FlightSearchCard({ flight, onSelect }) {
  if (!flight) return null;

  return (
    <div className="p-5 font-sans">
      
      <div
        onClick={() => onSelect(flight)}
        className="max-w-3xl w-full mx-auto transition-all duration-300 hover:scale-[1.01] cursor-pointer"
      >
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          <div className="p-6 md:p-7">

            {/* HEADER */}
            <div className="flex justify-between border-b border-white/20 pb-4 mb-5">
              <span className="text-white text-2xl font-bold">
                {flight.airline || "Unknown Airline"}
              </span>

              <span className="text-emerald-200 text-xs">
                {flight.cabinClass || "Economy"}
              </span>
            </div>

            {/* FLIGHT INFO */}
            <div className="flex justify-between">
              <div>
                <p className="text-white/50 text-xs">Departure</p>
                <h1 className="text-white text-3xl font-bold">
                  {flight.departure_time || "--:--"}
                </h1>
                <p className="text-white/60">{flight.origin || "-"}</p>
              </div>

              <div className="text-white/40">✈️</div>

              <div className="text-right">
                <p className="text-white/50 text-xs">Arrival</p>
                <h1 className="text-white text-3xl font-bold">
                  {flight.arrival_time || "--:--"}
                </h1>
                <p className="text-white/60">{flight.destination || "-"}</p>
              </div>
            </div>

            {/* PRICE */}
            <div className="mt-6 text-center">
              <p className="text-white/50 text-xs">Price</p>
              <h2 className="text-white text-4xl font-bold">
                {flight.price ?? 0} DZ
              </h2>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}