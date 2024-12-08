import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  { params }: { params: { departmentId: number } }
) {
  try {
    const { departmentId } = params
    if (!departmentId) {
      throw new Error("departmentId not found")
    }
    const Department = await prisma.department.findUnique({
      where: {
        id: Number(departmentId)
      },
      include: {
        students: true,
        faculties: true,
        courses: true,
        subjects: true,
        forums: true,
        nonTeachingStaff: true,
        attendance: true,
        announcement: true,
        assignment: true,
        exam: true,
        event: true,
        admin: true,
        principal: true
      }
    })
    if (!Department) {
      throw new Error("Department not found")
    }
    return NextResponse.json(
      { message: "Department found", Department },
      { status: 200 }
    )
  } catch (error) {
    console.log(
      `Error while getting department @api/department/[departmentId] ${error}`
    )
    return NextResponse.json(
      { message: "Error while getting department" },
      { status: 500 }
    )
  }
}