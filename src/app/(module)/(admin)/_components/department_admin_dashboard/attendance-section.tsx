"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"
import { useDepartmentAttendance } from "../../department_admin/_hooks/useDepartment"

export function DepartmentAttendanceSection({ deptId }: { deptId: string }) {
  const { data, isLoading } = useDepartmentAttendance(deptId)

  if (isLoading) return <p>Loading...</p>

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="mb-4 font-semibold">Attendance Trend (6 Months)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data.trend}>
            <XAxis dataKey="month" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="attendance"
              stroke="#4f46e5"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
