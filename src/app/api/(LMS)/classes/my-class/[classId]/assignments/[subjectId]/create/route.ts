import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

type body = {
  title: string
  startDate: string
  deadline: string
  attachmentUrl: string
  tag: string
  assignmentType: string
  subjectId: string
  AuthorName: string
  facultyId: string
  courseId: string
  classId: string
  departmentId: string
  universityId: string
}
export async function POST(req: Request, context: any) {
  try {
    const { classId, subjectId } = await context.params
    const user = await currentUser()

    const data: body = await req.json()
    if (
      user?.publicMetadata.role !== "faculty" &&
      user?.publicMetadata.role !== "authority"
    ) {
      return NextResponse.json(
        { message: "You are not allowed to create an assignment" },
        { status: 401 }
      )
    }
    console.log("data: ", data)
    const assignment = await prisma.assignment.create({
      data: {
        title: data.title,
        startDate: data.startDate,
        deadline: data.deadline,
        attachmentUrl: data.attachmentUrl,
        tag: [data.tag],
        assignmentType: data.assignmentType,
        subjectId: Number(subjectId),
        AuthorName: data.AuthorName,
        facultyId: data.facultyId,
        courseId: Number(data.courseId),
        classId: Number(classId),
        departmentId: Number(data.departmentId),
        universityId: Number(data.universityId)
      }
    })
    if (!assignment) {
      throw new Error("Error while creating assignment")
    }
    return NextResponse.json(
      { message: "Assignment created succesfully", assignment },
      {
        status: 200
      }
    )
  } catch (error) {
    console.log(
      "Error while creating assignment @/api/classes/my-class/[classId]/assignments/[subjectId]/create",
      error
    )
    return NextResponse.json(
      { message: "Error while creating Assignment" },
      { status: 500 }
    )
  }
}
