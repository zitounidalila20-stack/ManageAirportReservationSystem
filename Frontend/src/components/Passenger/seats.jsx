import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import SuccessHeadUp from "../generalcompenents/HeadsUp/successHeadsup";
import AlertHeadUp from "../generalcompenents/HeadsUp/alertHeadup";

export default function SelectSeat({ cabinClass, flightId, onSeatSelect }) {
  const location = useLocation();
  const navigate = useNavigate();

  const flight = location.state?.flight;
  const bookingID = location.state?.bookingID;
  const passengers = location.state?.passengers;

  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReserving, setIsReserving] = useState(false);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  // ================= FETCH SEATS =================
  useEffect(() => {
    const fetchSeats = async () => {
      let finalFlightId = flightId;

      if (!finalFlightId && flight?.id) {
        finalFlightId = flight.id;
      }

      if (!finalFlightId && flight?.flightID) {
        finalFlightId = flight.flightID;
      }

      if (!finalFlightId) {
        console.error("No flightId found");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/seats", {
          params: { flightId: finalFlightId }
        });

        if (res.data.success) {
          setSeats(res.data.seats);
        } else {
          setSeats([]);
        }
      } catch (err) {
        console.error("Error fetching seats:", err.message);
        setSeats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [flightId, flight]);

  // ================= HANDLE SEAT CLICK =================
  const handleSeatClick = async (seatId, status) => {
    // If called without parameters (from continue button), just return or proceed to next step
    if (!seatId) {
      if (selectedSeat && onSeatSelect) {
        onSeatSelect(selectedSeat);
      }
      return;
    }

    // Don't allow selecting booked seats
    if (status === "booked") return;
    
    // Don't allow clicking if already reserving
    if (isReserving) return;

    // Just select the seat without making API call yet
    setSelectedSeat(seatId);
    
    if (onSeatSelect) {
      onSeatSelect(seatId);
    }
  };

  // ================= RESERVE SEAT ON CONTINUE =================
  const handleContinue = async () => {
    if (!selectedSeat) {
      setError(true);
      setTimeout(() => setError(false), 3000);
      return;
    }

    setIsReserving(true);

    const info = {
      reservationID: bookingID,
      seatnumber: selectedSeat
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/reserveSeat",
        info
      );

      // Fix: Check if success is true (backend returns just { success: true })
      if (res.data.success === true) {
        setSuccess(true);
        setError(false);
        
        // Update local seat status to booked
        setSeats(prevSeats => 
          prevSeats.map(seat => 
            seat.seat_number === selectedSeat 
              ? { ...seat, status: "booked" }
              : seat
          )
        );
        
        // Call onSeatSelect if provided
        if (onSeatSelect) {
          onSeatSelect(selectedSeat);
        }
        
        // Auto-hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(true);
        setSuccess(false);
        setTimeout(() => setError(false), 3000);
      }

        setTimeout(() => setSuccess(false), 3000);
    
        setTimeout(() => {
          navigate("/makepayment", { // Make sure this matches the route path
            state: {
              flight: flight,
              bookingID: bookingID,
              passengers: passengers,
              selectedSeat: selectedSeat
            }
          });
        }, 1000);


    } catch (err) {
      console.log("ERROR", err);
      setError(true);
      setSuccess(false);
      setTimeout(() => setError(false), 3000);
    } finally {
      setIsReserving(false);
    }
  };


  // ================= LOADING =================
  if (loading) {
    return (
      <div className="w-full flex justify-center py-10">
        <div className="text-center text-lg font-semibold">
          Loading seats...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-10 flex justify-center">
      
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-4xl">

        {/* HEADUPS */}
        {success && <SuccessHeadUp />}
        {error && <AlertHeadUp />}

        {/* HEADER */}
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-2">
          Select Your Seat
        </h2>

        <p className="text-center text-gray-500 mb-6">
          {cabinClass || "Economy"} Class
        </p>

        {/* FLIGHT INFO */}
        {flight && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-center shadow-sm">
            <div className="font-semibold text-gray-700">
              {flight.origin} → {flight.destination}
            </div>
            <div className="text-sm text-gray-500">
              Flight {flight.flight_number || flight.id}
            </div>
          </div>
        )}

        {/* LEGEND */}
        <div className="flex justify-center gap-6 mb-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-400 rounded"></div>
            Available
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            Selected
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-400 rounded"></div>
            Booked
          </div>
        </div>

        {/* SEATS */}
        <div className="bg-gray-100 p-6 rounded-2xl">

          {Object.entries(
            seats.reduce((acc, seat) => {
              const row = seat.seat_number.slice(0, -1);
              const col = seat.seat_number.slice(-1);

              if (!acc[row]) acc[row] = {};
              acc[row][col] = seat;

              return acc;
            }, {})
          )
            .sort((a, b) => a[0] - b[0])
            .map(([row, cols]) => (
              <div key={row} className="flex justify-center items-center gap-4 mb-3">

                <div className="w-6 text-gray-500 font-semibold">{row}</div>

                {/* LEFT */}
                <div className="flex gap-2">
                  {["A", "B", "C"].map((c) => {
                    const seat = cols[c];
                    const id = seat?.seat_number;
                    const status = seat?.status;

                    return (
                      <button
                        key={id || c}
                        onClick={() => id && handleSeatClick(id, status)}
                        disabled={!seat || status === "booked" || isReserving}
                        className={`w-12 h-12 rounded-lg text-xs font-bold flex items-center justify-center transition-all
                        ${status === "booked"
                          ? "bg-gray-400 cursor-not-allowed"
                          : selectedSeat === id
                          ? "bg-blue-500 text-white shadow-lg"
                          : "bg-green-400 text-white hover:bg-green-500"
                        }`}
                      >
                        {id || "--"}
                      </button>
                    );
                  })}
                </div>

                <div className="w-6 text-gray-300 text-center">|</div>

                {/* RIGHT */}
                <div className="flex gap-2">
                  {["D", "E", "F"].map((c) => {
                    const seat = cols[c];
                    const id = seat?.seat_number;
                    const status = seat?.status;

                    return (
                      <button
                        key={id || c}
                        onClick={() => id && handleSeatClick(id, status)}
                        disabled={!seat || status === "booked" || isReserving}
                        className={`w-12 h-12 rounded-lg text-xs font-bold flex items-center justify-center transition-all
                        ${status === "booked"
                          ? "bg-gray-400 cursor-not-allowed"
                          : selectedSeat === id
                          ? "bg-blue-500 text-white shadow-lg"
                          : "bg-green-400 text-white hover:bg-green-500"
                        }`}
                      >
                        {id || "--"}
                      </button>
                    );
                  })}
                </div>

              </div>
            ))}
        </div>

        {/* FOOTER */}
        {selectedSeat && (
          <div className="mt-8 text-center">
            <p className="text-lg font-semibold text-blue-600 mb-4">
              Selected Seat: {selectedSeat}
            </p>

            <button
              onClick={handleContinue}
              disabled={isReserving}
              className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isReserving ? "Reserving..." : "Continue"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}