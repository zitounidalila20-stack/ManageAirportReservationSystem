import { useEffect, useState } from "react";
import axios from "axios";
import { Plane } from "lucide-react";
import KpiCard from "./KpiCard";

export default function TotalFlightsKpis() {
  const [value, setValue] = useState(0);
  const fetchFlights = async () => {
    try {
      const res = await axios.get("http://localhost:5000/flights");
      setValue(res.data.value);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {fetchFlights();}, []);

  return (
    <KpiCard title="Total Flights" value={value} icon={Plane} color="blue"/>
  );
}