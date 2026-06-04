import { useEffect, useState } from "react";
import axios from "axios";
import { CreditCard } from "lucide-react";
import KpiCard from "./KpiCard";

export default function TotalRevenue() {
  const [value, setValue] = useState(0);
  const fetchRevenue = async () => {
    try {
      const res = await axios.get("http://localhost:5000/TotalRevenue");
      setValue(res.data.data[0].total_collected);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {fetchRevenue();}, []);

  return (
    <KpiCard title="Total Revenue" value={value} icon={CreditCard} color="green"/>
  );
}