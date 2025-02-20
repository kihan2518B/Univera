//post route for student
import { NextResponse } from "next/server"
import { createUser } from "@/utils/clerk"
import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

export async function POST(req: Request) {
  try {
    const {
      name,
      email,
      password,
      prn,
      rollNo,
      year,
      semester,
      departmentId,
      courseId,
      universityId
    } = await req.json()

    const clerkU = await currentUser()
    const role = clerkU?.publicMetadata.role

    //check user authorization
    if (role !== "authority" && role !== "super_user") {
      return NextResponse.json(
        { message: "You are not allowed to create a student" },
        {
          status: 401
        }
      )
    }

    if (
      !name ||
      !email ||
      !password ||
      !departmentId ||
      !courseId ||
      !semester ||
      !universityId ||
      !year ||
      !rollNo ||
      !prn
    ) {
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
    //creating a clerk student
    const user = await createUser({
      name: name,
      email: email,
      password: password,
      role: "student",
      roleIds: [7],
      universityId,
      courseId,
      phone: "",
      departmentId: Number(departmentId)
    })
    if (!user) {
      throw new Error("Error while creating faculty")
    }

    //create a student data
    const student = await prisma.student.create({
      data: {
        id: user.clerkId,
        prn: prn,
        rollNo: Number(rollNo),
        clerkId: user.clerkId,
        semester: Number(semester),
        year: Number(year),
        universityId: Number(universityId),
        departmentId: Number(departmentId),
        courseId: Number(courseId)
      }
    })
    if (!student) {
      return NextResponse.json(
        { message: "Error creating student" },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { message: "student created successfully", user: user, student },
      { status: 201 }
    )
  } catch (error) {
    console.log("Error creating User @api/list/teacher/create: ", error)
    return NextResponse.json(
      { message: "Error creating User" },
      { status: 500 }
    )
  }
}
