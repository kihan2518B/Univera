// components/charts/DeptAttendanceChart.tsx
"use client"
import React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList
} from "recharts"

type Item = {
  departmentId: number
  departmentName: string
  avgAttendance: number
}

export default function DeptAttendanceChart({ data }: { data: Item[] }) {
  return (
    <div className="bg-card rounded-2xl p-4 border shadow-sm h-96">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">
          Department-wise Average Attendance (last 30 days)
        </h3>
        <div className="text-sm text-muted-foreground">Average %</div>
      </div>

      <div className="h-[78%]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
            <XAxis
              dataKey="departmentName"
              interval={0}
              tick={{ fontSize: 12 }}
              angle={-30}
              textAnchor="end"
              height={70}
            />
            <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <Tooltip
              formatter={(value: any) => `${Number(value).toFixed(2)}%`}
            />
            <Bar dataKey="avgAttendance" radius={[6, 6, 0, 0]}>
              <LabelList
                dataKey="avgAttendance"
                content={({ x, y, value }: any) => {
                  return (
                    <text
                      x={x + 20}
                      y={y - 6}
                      fill="#0A2353"
                      fontSize={11}
                      fontWeight={700}
                    >
                      {Number(value).toFixed(0)}%
                    </text>
                  )
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
