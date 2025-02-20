import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const user = await currentUser()
    const courseId = searchParams.get("courseId")

    if (!user) {
      return NextResponse.json({ message: "Not Authorized" }, { status: 401 })
    }
    if (!courseId) {
      throw new Error("CourseId not found")
    }
    // Have to return faculties my subjects as well as class subjects
    const faculties = await prisma.faculty.findUnique({
      where: { id: user?.id },
      include: {
        subject: true
      }
    })

    const course = await prisma.course.findUnique({
      where: { id: Number(courseId) },
      include: {
        subjects: true
      }
    })
    console.log("course: ", course)
    return NextResponse.json(
      {
        message: "Success",
        mySubjects: faculties?.subject,
        courseSubjects: course?.subjects
      },
      { status: 200 }
    )
  } catch (error) {
    console.log(
      "Error while fetching subjects @api/classes/my-class/[classId]/assignments",
      error
    )
    return NextResponse.json(
      { message: "Error while fetching subjects" },
      { status: 500 }
    )
  }
}
