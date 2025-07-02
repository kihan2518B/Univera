import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { name, code, semister, courseId, departmentId, universityId } =
      await req.json()
    const clerkU = await currentUser()
    const role = clerkU?.publicMetadata.role

    console.log("Creating class with data:", {
      name,
      code,
      semister,
      courseId,
      departmentId,
      universityId
    })

    //check user authorization
    if (role !== "authority" && role !== "super_user") {
      return NextResponse.json(
        { message: "You are not allowed to create a Class" },
        {
          status: 401
        }
      )
    }

    if (
      !name ||
      !code ||
      !semister ||
      !courseId ||
      !departmentId ||
      !universityId
    ) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      )
    }
    const existingClass = await prisma.class.findFirst({
      where: {
        name: name,
        code: code,
        semister: semister,
        courseId: Number(courseId),
        departmentId: Number(departmentId),
        universityId: Number(universityId)
      }
    })
    if (existingClass) {
      return NextResponse.json(
        { message: "Class already exists" },
        { status: 400 }
      )
    }
    const newClass = await prisma.class.create({
      data: {
        name,
        code,
        semister: Number(semister),
        course: {
          connect: { id: Number(courseId) }
        },
        department: {
          connect: { id: Number(departmentId) }
        },
        university: {
          connect: { id: Number(universityId) }
        }
      }
    })
    // Fetch subjects matching the courseId and semister
    const subjects = await prisma.subject.findMany({
      where: {
        courseId: Number(courseId),
        semester: Number(semister)
      }
    })

    // Connect each subject to the newly created class
    for (const subject of subjects) {
      await prisma.subject.update({
        where: { id: subject.id },
        data: {
          classes: {
            connect: { id: newClass.id } // Connect the subject to the class
          }
        }
      })
    }

    if (!newClass) {
      throw new Error("Error while creating class")
    }

    return NextResponse.json(
      { message: "Class created", Class: newClass },
      { status: 201 }
    )
  } catch (error) {
    console.log("Error while creating class @api/(LMS)classes/create", error)
    return NextResponse.json(
      { message: "Error while creating class" },
      { status: 500 }
    )
  }
}
