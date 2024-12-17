import { NextResponse } from "next/server"
import prisma from "@/lib/prisma" // Adjust the path to your Prisma client setup
import { currentUser } from "@clerk/nextjs/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = await new URL(req.url)
    const courseId = await searchParams.get("courseId")
    // console.log("courseId: ",courseId)
    // Validate courseId
    if (!courseId) {
      return NextResponse.json(
        { message: "Course ID is required" },
        { status: 400 }
      )
    }

    // Fetch course from the database
    const course = await prisma.course.findUnique({
      where: {
        id: Number(courseId) // Ensure the ID is a number if your database expects it
      },
      include: {
        subjects: true
      }
    })
    if (!course) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 })
    }

    // Return course data
    return NextResponse.json(
      { message: "Course fetched successfully", course },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error fetching course:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  try {
    const { updatedcourse, userId, department } = await req.json() // Ensure valid payload
    const { searchParams } = await new URL(req.url)
    const courseId = await searchParams.get("courseId")

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
    if (!department || !userId || !updatedcourse) {
      return new NextResponse("Missing fields", { status: 400 })
    }

    const course = await prisma.course.update({
      where: {
        id: Number(courseId)
      },
      data: updatedcourse
    })
    return NextResponse.json(
      { message: "course updated", course },
      {
        status: 200
      }
    )
  } catch (error) {
    console.log("Error while updating course @/course", error)
    return NextResponse.json(
      { message: "Error while updating" },
      {
        status: 500
      }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = await new URL(req.url)
    const courseId = await searchParams.get("courseId")
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

    const DeletedCourse = await prisma.course.delete({
      where: { id: Number(courseId) }
    })
    if (!DeletedCourse) {
      throw new Error("Error while deleting course")
    }
    return NextResponse.json(
      { message: "Course Deleted", course: DeletedCourse },
      {
        status: 200
      }
    )
  } catch (error) {
    console.log(`Error while deleting course @api/course/[courseId] ${error}`)
    return NextResponse.json(
      { message: "Error while deleting course" },
      {
        status: 500
      }
    )
  }
}