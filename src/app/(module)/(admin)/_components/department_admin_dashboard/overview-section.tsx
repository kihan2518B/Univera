"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useDepartmentOverview } from "../../department_admin/_hooks/useDepartment"

export function DepartmentOverviewSection({ deptId }: { deptId: string }) {
  const { data, isLoading } = useDepartmentOverview(deptId)

  if (isLoading) return <p>Loading...</p>

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-4 text-center">
          <h3 className="font-medium">Students</h3>
          <p className="text-2xl font-bold">{data.totalStudents}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <h3 className="font-medium">Teachers</h3>
          <p className="text-2xl font-bold">{data.totalTeachers}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <h3 className="font-medium">Classes</h3>
          <p className="text-2xl font-bold">{data.totalClasses}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <h3 className="font-medium">Courses</h3>
          <p className="text-2xl font-bold">{data.totalCourses}</p>
        </CardContent>
      </Card>
    </div>
  )
}
