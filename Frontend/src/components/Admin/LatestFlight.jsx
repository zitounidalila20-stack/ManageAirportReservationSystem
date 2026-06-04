import { useEffect, useState } from "react";
import axios from "axios";
import DynamicTable from "../generalcompenents/DynamicTable";

export default function LatestFlight() {

  const columns = [
    {id: 1, name: "Flight Number",key: "flight_number"},
    {id: 2, name: "Airline", key: "airline",},
    {id: 3, name: "Origin", key: "origin",},
    {id: 4, name: "Destination", key: "destination",},
    {id: 5, name: "Status", key: "status",

      render: (value) => {

        const styles = {
          Scheduled: "bg-blue-100 text-blue-700",
          Departed: "bg-purple-100 text-purple-700",
          IN_AIR: "bg-orange-100 text-orange-700",
          Landed: "bg-green-100 text-green-700",
          Delayed: "bg-red-100 text-red-700",
        };

        return (
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[value] || "bg-gray-100 text-gray-700"}`}>{value}</span>
        );
      },
    },
  ];

  const [data, setData] = useState([]);

  const fetchLatest = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/latestFlights"
      );

      setData(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLatest();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Latest Flights</h2>
      <DynamicTable columns={columns} data={data}/>
    </div>
  );
}