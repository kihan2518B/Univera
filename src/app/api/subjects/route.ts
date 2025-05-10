import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"

export async function POST(req: Request) {
  try {
    const { name, code, credits, semester, department, courseId } =
      await req.json() // Ensure valid payload
    const user = await currentUser()
    const role = user?.publicMetadata.role
    //check user authorization
    if (role !== "department_admin" && role !== "super_user") {
      return NextResponse.json(
        { message: "You are not allowed to create a Subject" },
        {
          status: 401
        }
      )
    }

    // Validate input
    if (!department || !courseId || !name || !code || !credits || !semester) {
      return new NextResponse("Missing fields", { status: 400 })
    }
    // Create a new course in the database
    const course = await prisma.subject.create({
      data: {
        name,
        code,
        credits: Number(credits),
        semester: Number(semester),
        course: {
          connect: { id: Number(courseId) }
        },
        department: {
          connect: { id: Number(department.id) }
        },
        university: {
          connect: { id: Number(department.universityId) }
        }
      }
    })

    if (!course) {
      throw new Error("Error while creating course")
    }
    return NextResponse.json(
      { message: "Subject created", course },
      {
        status: 201
      }
    )
  } catch (error) {
    console.error("[SUBJECT]/create", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function GET(req: Request) {
  const { searchParams } = await new URL(req.url)
  const courseId = await searchParams.get("courseId")
  const userId = await searchParams.get("userId")

  if (userId) {
    const user = await prisma.faculty.findUnique({
      where: { id: userId },
      include: { subject: true }
    })
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        {
          status: 404
        }
      )
    }
    return NextResponse.json(
      { message: "Subjects found", subjects: user.subject },
      { status: 200 }
    )
  } else {
    if (!courseId) {
      return NextResponse.json(
        { message: "Course ID is required" },
        {
          status: 400
        }
      )
    }

    try {
      const subjects = await prisma.subject.findMany({
        where: {
          courseId: Number(courseId) // Ensure correct type handling for `courseId`
        },
        include: {
          faculties: true
        }
      })
      if (!subjects) {
        throw new Error("Error while getting subjects")
      }
      return NextResponse.json(
        { message: "Subjects found", subjects },
        {
          status: 200
        }
      )
    } catch (error) {
      console.log(`Error while fetching subjects @api/subjects ${error}`)
      return NextResponse.json(
        { message: "Error fetching subjects" },
        {
          status: 500
        }
      )
    }
  }
}
