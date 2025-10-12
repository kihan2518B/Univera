// components/charts/MonthlyAttendanceChart.tsx
"use client"
import React from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts"

type Point = { month: string; avgAttendance: number }

export default function MonthlyAttendanceChart({ data }: { data: Point[] }) {
  return (
    <div className="bg-card rounded-2xl p-4 border shadow-sm h-96">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">
          Attendance Trend (last 6 months)
        </h3>
        <div className="text-sm text-muted-foreground">Avg % per month</div>
      </div>

      <div className="h-[78%]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <Tooltip formatter={(v: any) => `${Number(v).toFixed(2)}%`} />
            <Legend />
            <Line
              type="monotone"
              dataKey="avgAttendance"
              stroke="#5B58EB"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
