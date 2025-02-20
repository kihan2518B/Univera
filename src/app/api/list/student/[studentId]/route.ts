import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { DeleteUser } from "@/utils/clerk"

export async function GET(req: Request, context: any) {
  try {
    const { studentId } = await context.params

    const user = await prisma.student.findUnique({
      where: { clerkId: studentId },
      include: {
        user: {
          include: {
            roles: true
          }
        },
        class: {
          include: {
            subjects: true
          }
        },
        course: {
          include: {
            subjects: true
          }
        },
        department: true
      }
    })
    if (!user) {
      throw new Error("Error while getting user")
    }
    return NextResponse.json(
      { message: "Found student data", student: user },
      {
        status: 200
      }
    )
  } catch (error) {
    console.log(
      "Error while getting user @/api/list/student/[studentId]",
      error
    )
    return NextResponse.json(
      { message: "Error while getting user" },
      {
        status: 500
      }
    )
  }
}

export async function PATCH(req: Request, context: any) {
  try {
    const { studentId } = await context.params
    const clerkU = await currentUser()
    const role = clerkU?.publicMetadata.role

    //check user authorization
    if (role !== "authority" && role !== "super_user") {
      return NextResponse.json(
        { message: "You are not allowed to update student" },
        {
          status: 401
        }
      )
    }

    const { prn, semester, rollNo, courseId } = await req.json()
    if (!courseId || !semester || !rollNo || !prn) {
      throw new Error("All fields are required")
    }

    let existingStudent
    existingStudent = await prisma.student.findFirst({
      where: { prn: prn }
    })
    existingStudent = await prisma.student.findFirst({
      where: { rollNo, courseId, semester }
    })
    if (existingStudent) {
      return NextResponse.json(
        { message: "Student with this PRN or Rollnumber already exists" },
        { status: 400 }
      )
    }
    const year = Math.ceil(Number(semester) / 2)
    const updatedStudents = await prisma.student.update({
      where: { clerkId: studentId },
      data: { prn, year, semester, rollNo: Number(rollNo) }
    })

    if (!updatedStudents) {
      throw new Error("Error while updating student")
    }

    return NextResponse.json(
      { message: "student data updated", updatedStudents },
      { status: 200 }
    )
  } catch (error) {
    console.log(
      "Error while updating student @api/list/student/[studentId]: ",
      error
    )
    return NextResponse.json(
      { message: "Error while updating" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request, context: any) {
  try {
    const { studentId } = await context.params

    const clerkU = await currentUser()
    const role = clerkU?.publicMetadata.role

    //check user authorization
    if (role !== "authority" && role !== "super_user") {
      return NextResponse.json(
        { message: "You are not allowed to delete a Student" },
        {
          status: 401
        }
      )
    }
    await DeleteUser(studentId)
    await prisma.student.delete({ where: { clerkId: studentId } })
    await prisma.user.delete({ where: { id: studentId } })

    return NextResponse.json(
      { message: "student Deleted" },
      {
        status: 200
      }
    )
  } catch (error) {
    console.log(
      `Error while deleting student @api/list/student/[studentId]: ${error}`
    )
    return NextResponse.json(
      { message: "Error while Deleting student" },
      {
        status: 500
      }
    )
  }
}
