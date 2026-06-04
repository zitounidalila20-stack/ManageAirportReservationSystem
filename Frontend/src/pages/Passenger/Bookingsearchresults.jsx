import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../../components/Passenger/NavigationBar";
import FlightSearchCard from "../../components/Passenger/flightsreachcard";

export default function BookingFunctionResults() {
  const location = useLocation();
  const navigate = useNavigate();

 
  const flights = location.state?.flights || [];
  const passengers = location.state?.passengers || {
    adults: 1,
    children: 0,
    infants: 0,
  };

  console.log("📦 Location state:", location.state);
  console.log("✈️ Flights:", flights);

  
  const handleSelectFlight = (flight) => {
    console.log("You clicked:", flight);

 
    navigate("/Makebooking", {
      state: {
        flight: flight,
        passengers: passengers,
      },
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />

      <div className="p-20">
        {flights.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            No flights found for your search ✈️
          </div>
        ) : (
          flights.map((flight, index) => (
            <FlightSearchCard
              key={index}
              flight={flight}
              onSelect={handleSelectFlight} 
            />
          ))
        )}
      </div>
    </div>
  );
}