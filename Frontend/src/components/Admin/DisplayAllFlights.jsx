import axios from "axios";
import { useEffect, useState } from "react";
import Table from "../generalcompenents/table";

export default function ViewAllFlight() {
  const [flightsData, setFlightsData] = useState([]);

  const columnsNames = [
    { id: 1, name: "Flight Number" },
    { id: 2, name: "Airline" },
    { id: 3, name: "Origin" },
    { id: 4, name: "Destination" },
    { id: 5, name: "Status" },
    { id: 6, name: "Departure Date" },
    { id: 7, name: "Departure Time" },
    { id: 8, name: "Actions", key: "actions" }

  ];

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/flightsData"
        );

        setFlightsData(response.data.flights);

      } catch (err) {
        console.log(err);
      }
    };

    fetchFlights();
  }, []);

  return (
    <div>
      <h1>Flights</h1>

      <Table
        columns={columnsNames}
        data={flightsData}  
      />
    </div>
  );
}