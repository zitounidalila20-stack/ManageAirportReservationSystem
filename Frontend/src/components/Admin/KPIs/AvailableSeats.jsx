import { useEffect, useState } from "react";
import axios from "axios";
import { Armchair } from "lucide-react";
import KpiCard from "./KpiCard";

export default function AvailableSeats() {
  const [value, setValue] = useState(0);
  const fetchFlights = async () => {
    try {
      const res = await axios.get("http://localhost:5000/AvailableSeats");
      setValue(res.data.value);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {fetchFlights();}, []);
  return (
    <KpiCard title="Available Seats" value={value} icon={Armchair} color="green"/>
  );
}