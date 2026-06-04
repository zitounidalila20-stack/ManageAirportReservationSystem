import { useEffect, useState } from "react";
import axios from "axios";
import DynamicTable from "../generalcompenents/DynamicTable";

export default function LatestReservation() {

  const [data, setData] = useState([]);

  const columns = [
    {id: 1, name: "Reservation ID", key: "reservationID",},
    {id: 2, name: "Passenger", key: "first_name",
      render: (value, row) => (
        `${row.first_name} ${row.last_name}`
      ),
    },

    {id: 3, name: "Flight Number", key: "flight_number",
    },

    {id: 4, name: "Booking Date", key: "created_at",
      render: (value) =>
        new Date(value).toLocaleDateString(),
    },
  ];

  const fetchLatestReservations = async () => {
    try {
      const response = await axios.get("http://localhost:5000/latestReservations");
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {fetchLatestReservations();}, []);
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Latest Reservations</h2>
      <DynamicTable columns={columns} data={data}/>
    </div>
  );
}