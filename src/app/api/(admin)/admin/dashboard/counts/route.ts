// app/api/dashboard/counts/route.ts
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

export async function GET(req: Request) {
  try {
    const user = await currentUser()
    const role = user?.publicMetadata.role

    //check user authorization
    if (role !== "university_admin" && role !== "super_user") {
      return NextResponse.json(
        { message: "You are not allowed to create a Course" },
        {
          status: 401
        }
      )
    }

    // optionally allow universityId filter
    const url = new URL(req.url)
    const uniId = url.searchParams.get("universityId")
    const whereUni = uniId ? { universityId: Number(uniId) } : {}

    // Parallel counts
    const [students, faculties, departments, courses, classes, nonTeaching] =
      await Promise.all([
        prisma.student.count({ where: whereUni }),
        prisma.faculty.count({ where: whereUni }),
        prisma.department.count({ where: whereUni }),
        prisma.course.count({ where: whereUni }),
        prisma.class.count({ where: whereUni }),
        prisma.nonTeachingStaff.count({ where: whereUni })
      ])

    return NextResponse.json({
      students,
      faculties,
      departments,
      courses,
      classes,
      nonTeachingStaff: nonTeaching
    })
  } catch (err) {
    console.error("GET /api/dashboard/counts error", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
