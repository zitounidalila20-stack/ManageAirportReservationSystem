import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function UsersPieChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("http://localhost:5000/users-distribution");
      setData(res.data);
    };

    fetchData();
  }, []);

  const COLORS = ["#3e108d", "#7a45f6", "#bba6fb"];

  return (
  <div className="bg-white p-6 rounded-2xl shadow-md">
    <h2 className="text-lg font-bold mb-4">
      Users Distribution
    </h2>

    <div className="flex justify-center">
      <PieChart width={400} height={300}>
        <Pie
          data={data}
          dataKey="count"
          nameKey="role"
          cx="50%"
          cy="50%"
          innerRadius={80}
          outerRadius={100}
          paddingAngle={2}
          cornerRadius={8}
        >
          {data.map((_, index) => (
            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>

        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  </div>
);
}