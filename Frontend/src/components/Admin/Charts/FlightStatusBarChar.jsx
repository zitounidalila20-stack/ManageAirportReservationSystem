import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from "recharts";

export default function FlightStatusBarChart() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    axios.get("http://localhost:5000/flightStatusDistribution")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "canceled": return "#f43f5e"; 
      case "delayed": return "#f59e0b";  
      case "scheduled": return "#3b82f6"; 
      case "departed": return "#8b5cf6";  
      case "landed": return "#10b981";    
      case "in_air": return "#06b6d4";    
      default: return "#4b5563";
    }
  };

  return (
    <div className="w-full h-[340px] flex flex-col justify-between font-sans select-none">
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-emerald-500 uppercase">Live Operations</span>
          <h3 className="text-lg font-medium text-neutral-200 tracking-tight mt-0.5">Flight Status Distribution</h3>
        </div>
      </div>

      <div className="flex-1 w-full h-full min-h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
            <CartesianGrid strokeDasharray="0" stroke="#1f1f1f" vertical={false} />
            <XAxis 
              dataKey="status" 
              stroke="#525252" 
              fontSize={10} 
              fontWeight={500}
              tickLine={false} 
              axisLine={false} 
              dy={10}
            />
            <YAxis 
              stroke="#525252" 
              fontSize={10} 
              fontWeight={500}
              tickLine={false} 
              axisLine={false} 
            />
            <Tooltip
              cursor={{ fill: "rgba(255, 255, 255, 0.02)", radius: 8 }}
              contentStyle={{
                backgroundColor: "rgba(5, 5, 5, 0.9)",
                backdropFilter: "blur(20px)",
                border: "1px solid #262626",
                borderRadius: "12px",
                padding: "8px 12px"
              }}
              itemStyle={{ fontSize: "12px", fontWeight: "600" }}
              labelStyle={{ color: "#666", fontSize: "10px", textTransform: "uppercase" }}
            />
            <Bar dataKey="count" barSize={24} radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getStatusColor(entry.status)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}