import { useEffect, useState } from "react";
import axios from "axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function RevenueChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/RevenueChart")
      .then((res) => {
        const fixedData = res.data.map(item => ({
          ...item,
          revenue: Number(item.revenue)
        }));
        setData(fixedData);
      })
      .catch((err) => console.log(err));
  }, []);

  const formatYAxis = (tickItem) => {
    return tickItem >= 1000 ? `${(tickItem / 1000).toFixed(0)}k` : tickItem;
  };

  return (
    <div className="w-full h-[320px] flex flex-col justify-between select-none">
      
      <div className="flex justify-between items-end mb-6">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-emerald-500 uppercase">Financial Metrics</span>
          <h3 className="text-xl font-medium text-blue-500 tracking-tight mt-0.5">Revenue Flow</h3>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-neutral-500 block uppercase tracking-wider">Currency</span>
          <span className="text-xs font-semibold text-neutral-300">USD ($)</span>
        </div>
      </div>

      <div className="flex-1 w-full h-full min-h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="emeraldGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.12} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="0" stroke="#1f1f1f" vertical={false} />
            
            <XAxis 
              dataKey="month" 
              stroke="#444444" 
              fontSize={10}
              fontWeight={500}
              tickLine={false}
              axisLine={false}
              dy={12}
            />
            
            <YAxis 
              stroke="#444444" 
              fontSize={10}
              fontWeight={500}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatYAxis}
            />
            
            <Tooltip
              cursor={{ stroke: "#262626", strokeWidth: 1 }}
              contentStyle={{
                backgroundColor: "rgba(0, 0, 0, 0.85)",
                backdropFilter: "blur(20px)",
                border: "1px solid #262626",
                borderRadius: "12px",
                boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.7)",
                padding: "8px 12px"
              }}
              itemStyle={{ color: "#10b981", fontSize: "12px", fontWeight: "600" }}
              labelStyle={{ color: "#666", fontSize: "10px", textTransform: "uppercase", tracking: "1px" }}
              formatter={(value) => [`$${Number(value).toLocaleString()}`, "Earnings"]}
            />

            <Area
              type="natural" 
              dataKey="revenue"
              stroke="#10b981" 
              fillOpacity={1}
              fill="url(#emeraldGlow)"
              strokeWidth={2}
              
              activeDot={{ 
                r: 5, 
                stroke: "#0a0a0a", 
                strokeWidth: 2, 
                fill: "#34d399",
                boxShadow: "0 0 10px rgba(16, 185, 129, 0.5)"
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}