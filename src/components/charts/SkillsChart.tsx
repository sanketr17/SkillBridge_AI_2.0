import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface SkillsChartProps {
  data: { name: string; count: number }[];
  height?: number;
}

export const SkillsChart: React.FC<SkillsChartProps> = ({ data, height = 300 }) => {
  const chartData = data && data.length > 0 ? data : [
    { name: "Beginner", count: 2 },
    { name: "Intermediate", count: 4 },
    { name: "Advanced", count: 3 },
    { name: "Expert", count: 1 }
  ];

  const COLORS = ["#f59e0b", "#7c3aed", "#4f46e5", "#06b6d4"];

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#64748b" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false}
            dy={10}
          />
          <YAxis 
            stroke="#64748b" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false}
            dx={-10}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "#f8fafc",
              fontSize: "12px"
            }}
            cursor={{ fill: "#334155", opacity: 0.2 }}
            formatter={(value: any) => [`${value} Skills`, "Quantity"]}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SkillsChart;
