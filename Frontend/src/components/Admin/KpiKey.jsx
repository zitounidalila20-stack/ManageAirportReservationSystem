import TotalFlightsKpis from "./KPIs/TotalFlightsKps";
import TotalReservations from "./KPIs/TotalReservations";
import AvailableSeats from "./KPIs/AvailableSeats";
import TotalRevenue from "./KPIs/Revenue";

export default function KPIkeys() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
      <TotalFlightsKpis />
      <TotalReservations />
      <AvailableSeats />
      <TotalRevenue />
    </div>
  );
}