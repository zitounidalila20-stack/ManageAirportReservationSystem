import { QRCodeCanvas } from "qrcode.react";
import {
  Plane,
  Calendar,
  Clock,
  User,
  CreditCard,
  MapPin
} from "lucide-react";

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ETicket() {

  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchTicket = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/ticket/${ticketId}`
        );
        setTicket(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();

  }, [ticketId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading ticket...
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Ticket not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 flex items-center justify-center p-6 mt-20">

      <div className="w-full max-w-5xl bg-white/70 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-[35px] overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-700 to-cyan-500 text-white p-8 relative">

          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

          <h1 className="text-4xl font-bold tracking-wide">NodeAir</h1>
          <p className="opacity-90 mt-1">Electronic Boarding Pass</p>

          <div className="absolute top-8 right-8 bg-green-400 text-black px-4 py-1 rounded-full text-sm font-bold">
            CONFIRMED
          </div>
        </div>

        <div className="p-8 space-y-8">

          {/* TOP SECTION */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* PASSENGER CARD */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

              <h2 className="text-gray-500 text-sm mb-4">Passenger</h2>

              <div className="flex items-center gap-3 text-lg font-semibold">
                <User />
                {ticket.first_name} {ticket.last_name}
              </div>

              <div className="flex items-center gap-3 mt-3 text-gray-600">
                <CreditCard size={18} />
                {ticket.ticket_number}
              </div>
            </div>

            {/* FLIGHT CARD */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

              <h2 className="text-gray-500 text-sm mb-4">Flight Details</h2>

              <div className="flex items-center gap-3 font-semibold">
                <Plane />
                {ticket.flight_number}
              </div>

              <div className="flex items-center gap-3 mt-3 text-gray-600">
                <Calendar size={18} />
                {ticket.departure_time}
              </div>

            </div>

          </div>

          {/* ROUTE VISUAL */}
          <div className="bg-white rounded-2xl p-6 border shadow-sm">

            <div className="flex justify-between items-center">

              <div className="text-center">
                <h2 className="text-3xl font-bold">{ticket.origin}</h2>
                <p className="text-gray-500 text-sm">Departure</p>
              </div>

              <div className="flex-1 mx-6 relative">

                <div className="border-t-2 border-dashed border-blue-400"></div>

                <Plane
                  className="absolute left-1/2 -translate-x-1/2 -top-3 text-blue-600"
                  size={22}
                />
              </div>

              <div className="text-center">
                <h2 className="text-3xl font-bold">{ticket.destination}</h2>
                <p className="text-gray-500 text-sm">Arrival</p>
              </div>

            </div>

          </div>

          {/* BOTTOM BOARDING PASS */}
          <div className="bg-slate-900 text-white rounded-3xl overflow-hidden shadow-lg">

            <div className="grid md:grid-cols-4 gap-6 p-8 text-center">

              <div>
                <p className="text-gray-400 text-sm">Gate</p>
                <h3 className="text-xl font-bold">A12</h3>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Boarding</p>
                <h3 className="text-xl font-bold">10:30</h3>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Class</p>
                <h3 className="text-xl font-bold">Economy</h3>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Seat</p>
                <h3 className="text-xl font-bold">12A</h3>
              </div>

            </div>

            {/* QR + PNR */}
            <div className="bg-white text-black p-6 flex justify-between items-center">

              <QRCodeCanvas
                value={JSON.stringify({
                  ticket: ticket.ticket_number,
                  passenger: `${ticket.first_name} ${ticket.last_name}`,
                  flight: ticket.flight_number
                })}
                size={110}
              />

              <div className="text-right">
                <p className="text-gray-500 text-sm">PNR</p>
                <h2 className="text-2xl font-bold tracking-wider">
                  {ticket.ticket_number}
                </h2>
              </div>

            </div>

          </div>

          {/* ACTIONS */}
          <div className="flex gap-4">

            <button
              onClick={() => window.print()}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
            >
              Print Ticket
            </button>

            <button className="flex-1 bg-slate-900 text-white py-3 rounded-xl">
              Download PDF
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}