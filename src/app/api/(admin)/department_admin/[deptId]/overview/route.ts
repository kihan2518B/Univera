import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: Request, context: any) {
  try {
    const { deptId } = await context.params

    const [totalStudents, totalTeachers, totalClasses, totalCourses] =
      await Promise.all([
        prisma.student.count({ where: { departmentId: Number(deptId) } }),
        prisma.faculty.count({ where: { departmentId: Number(deptId) } }),
        prisma.class.count({ where: { departmentId: Number(deptId) } }),
        prisma.course.count({ where: { departmentId: Number(deptId) } })
      ])

    return NextResponse.json({
      totalStudents,
      totalTeachers,
      totalClasses,
      totalCourses
    })
  } catch (error) {
    console.error(
      "Error while fetching department overview @/api/(admin)/department_admin/[deptId]/overview",
      error
    )
    return NextResponse.json(
      { error: "Failed to fetch department overview" },
      { status: 500 }
    )
  }
}
