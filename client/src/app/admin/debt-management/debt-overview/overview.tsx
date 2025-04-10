"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
  {
    name: "T1",
    total: 40000000,
  },
  {
    name: "T2",
    total: 35000000,
  },
  {
    name: "T3",
    total: 42000000,
  },
  {
    name: "T4",
    total: 38000000,
  },
  {
    name: "T5",
    total: 45000000,
  },
  {
    name: "T6",
    total: 52000000,
  },
];

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value / 1000000}M`}
        />
        <Bar
          dataKey="total"
          fill="#16a34a"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
