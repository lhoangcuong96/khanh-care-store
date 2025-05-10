'use client';

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import React from "react";

interface DataPoint {
  name: string;
  total: number;
}

const data: DataPoint[] = [
  {
    name: "Tháng 1",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Tháng 2",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Tháng 3",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Tháng 4",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Tháng 5",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Tháng 6",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Tháng 7",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Tháng 8",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Tháng 9",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Tháng 10",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Tháng 11",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Tháng 12",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
];

const Overview: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
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
          tickFormatter={(value) => `${value.toLocaleString('vi-VN')}đ`}
        />
        <Tooltip 
          formatter={(value: number) => [`${value.toLocaleString('vi-VN')}đ`, 'Doanh thu']}
          labelFormatter={(label) => `Tháng ${label}`}
        />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#8884d8"
          strokeWidth={2}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Overview; 