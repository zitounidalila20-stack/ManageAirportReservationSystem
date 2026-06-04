import { useEffect, useState } from "react";
import axios from "axios";
import {TicketsPlane } from "lucide-react";
import KpiCard from "./KpiCard";

export default function TotalReservations() {
  const [value, setValue] = useState(0);
  const fetchReservations = async () => {
    try {
        const res = await axios.get( "http://localhost:5000/TotleReservations");
        setValue(res.data.value);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {fetchReservations();}, []);
  return (
    <KpiCard
      title="Total Reservations"
      value={value}
      icon={TicketsPlane}
      color="purple"
    />
  );
}