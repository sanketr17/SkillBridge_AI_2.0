import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface GrowthChartProps {
  data: { name: string; value: number }[];
  height?: number;
}

export const GrowthChart: React.FC<GrowthChartProps> = ({ data, height = 300 }) => {
  const chartData = data && data.length > 0 ? data : [
    { name: "Frontend", value: 3 },
    { name: "Backend", value: 2 },
    { name: "Database", value: 1 },
    { name: "DevOps", value: 1 }
  ];

  const COLORS = ["#4F46E5", "#7C3AED", "#06B6D4", "#10B981", "#F59E0B", "#EF4444"];

  return (
    <div className="w-full flex items-center justify-center" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "#f8fafc",
              fontSize: "12px"
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            formatter={(value: any) => <span className="text-xs text-slate-300 font-sans">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GrowthChart;
