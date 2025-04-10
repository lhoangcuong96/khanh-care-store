"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Giả lập dữ liệu biểu đồ công nợ theo thời gian
const getCustomerDebtData = (customerId: string) => {
  const data = {
    "nguyen-van-hung": [
      { month: "T1", debt: 0 },
      { month: "T2", debt: 0 },
      { month: "T3", debt: 2200000 },
      { month: "T4", debt: 3900000 },
      { month: "T5", debt: 1700000 },
      { month: "T6", debt: 1700000 },
    ],
    "tran-thi-lan": [
      { month: "T1", debt: 0 },
      { month: "T2", debt: 0 },
      { month: "T3", debt: 2500000 },
      { month: "T4", debt: 2500000 },
      { month: "T5", debt: 2500000 },
      { month: "T6", debt: 2500000 },
    ],
    "pham-van-duc": [
      { month: "T1", debt: 0 },
      { month: "T2", debt: 0 },
      { month: "T3", debt: 3800000 },
      { month: "T4", debt: 2800000 },
      { month: "T5", debt: 2800000 },
      { month: "T6", debt: 2800000 },
    ],
  };

  return data[customerId as keyof typeof data] || [];
};

export function CustomerDebtChart({ customerId }: { customerId: string }) {
  const data = getCustomerDebtData(customerId);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis
          dataKey="month"
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
        <Tooltip
          formatter={(value: number) => [
            `${value.toLocaleString()} ₫`,
            "Công nợ",
          ]}
          labelFormatter={(label) => `Tháng ${label}`}
        />
        <Line
          type="monotone"
          dataKey="debt"
          stroke="#8884d8"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
