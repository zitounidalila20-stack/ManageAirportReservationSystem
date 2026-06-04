import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function DestinationChart() {

  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/statsDestinations")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div style={{ width: "100%", height: 300 }}>
        <div>
          <h3 className="text-xl font-medium text-blue-500 tracking-tight mt-0.5" >Flights by Destination</h3>
        </div>
      <ResponsiveContainer>
        <BarChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="destination" />
          <YAxis />

          <Tooltip />

          <Bar
            dataKey="count"
            fill="#45197a"
            barSize={40}
          />

        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}