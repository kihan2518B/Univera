import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, context: any) {
  try {
    const { classId } = await context.params
    const { roleNumbers, studentId } = await req.json()
    const { searchParams } = new URL(req.url)
    const removeStudent = await searchParams.get("removeStudent")

    if (!classId) {
      throw new Error("Cannot find classId")
    }

    if (removeStudent) {
      if (!studentId) {
        throw new Error("Cannot find StudentId")
      }
      const assignedStudents = await prisma.class.update({
        where: { id: Number(classId) },
        data: {
          students: {
            disconnect: { id: studentId }
          }
        }
      })
      return NextResponse.json(
        { message: "Student removed from class", assignedStudents },
        { status: 200 }
      )
    }

    if (!roleNumbers || !Array.isArray(roleNumbers)) {
      throw new Error("Invalid or missing role numbers")
    }

    // Update class to connect students using their IDs
    const assignedStudents = await prisma.class.update({
      where: { id: Number(classId) },
      data: {
        students: {
          connect: roleNumbers.map((id: string) => ({ id }))
        }
      }
    })

    return NextResponse.json(
      { message: "Students added to class", assignedStudents },
      { status: 200 }
    )
  } catch (error) {
    console.error(
      "Error while adding students to class @/api/classes/my-class/[classId]/students",
      error
    )
    return NextResponse.json(
      { message: "Error while adding students to class" },
      { status: 500 }
    )
  }
}
