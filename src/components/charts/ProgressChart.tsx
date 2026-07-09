import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ProgressChartProps {
  data: { date: string; value: number }[];
  height?: number;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ data, height = 300 }) => {
  const chartData = data && data.length > 0 ? data : [
    { date: "June 1", value: 40 },
    { date: "June 10", value: 48 },
    { date: "June 20", value: 52 },
    { date: "July 1", value: 68 }
  ];

  return (
    <div className="w-full relative group" style={{ height }}>
      {/* Absolute glow halo behind the chart container */}
      <div className="absolute inset-x-8 bottom-4 top-12 bg-indigo-500/5 rounded-full filter blur-3xl pointer-events-none group-hover:bg-indigo-500/8 transition-colors duration-500" />
      
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 20, right: 15, left: -25, bottom: 5 }}>
          <defs>
            <linearGradient id="cyberGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.5} />
              <stop offset="50%" stopColor="#a855f7" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.0} />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="4 6" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="rgba(255, 255, 255, 0.3)" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            dy={12}
            fontFamily="JetBrains Mono"
          />
          <YAxis 
            stroke="rgba(255, 255, 255, 0.3)" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            domain={[0, 100]}
            dx={-12}
            fontFamily="JetBrains Mono"
          />
          <Tooltip
            contentStyle={{
              background: "rgba(3, 7, 18, 0.85)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(99, 102, 241, 0.35)",
              borderRadius: "14px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.7)",
              color: "#f8fafc",
              fontSize: "12px",
              fontFamily: "JetBrains Mono"
            }}
            labelStyle={{ fontWeight: "700", color: "#a855f7", marginBottom: "4px" }}
            itemStyle={{ color: "#06b6d4", padding: "2px 0" }}
            formatter={(value: any) => [`${value}% Core Readiness`, "SYNAPSE TELEMETRY"]}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#6366f1"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#cyberGradient)"
            filter="url(#glow)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
