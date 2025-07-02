import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function DELETE(req: Request, context: any) {
  try {
    const user = await currentUser()
    const { assignmentId } = await context.params
    if (
      user?.publicMetadata.role !== "faculty" &&
      user?.publicMetadata.role !== "authority"
    ) {
      return NextResponse.json(
        { message: "You don't have access to delete this assignment" },
        { status: 401 }
      )
    }

    await prisma.assignment.delete({
      where: { id: Number(assignmentId) }
    })

    return NextResponse.json(
      { message: "Assignment Deleted" },
      {
        status: 200
      }
    )
  } catch (error) {
    console.log(
      "Error while deleting assignment @api/(LMS)/classes/my-class/[classId]/assignments/[subjectId]/[assignmentId]",
      error
    )
    return NextResponse.json(
      { message: "Error while deleting assignment" },
      {
        status: 500
      }
    )
  }
}

export async function GET(req: Request, context: any) {
  try {
    const user = await currentUser()
    const { assignmentId } = await context.params
    if (
      user?.publicMetadata.role !== "faculty" &&
      user?.publicMetadata.role !== "authority"
    ) {
      return NextResponse.json(
        { message: "You don't have access to view this assignment" },
        { status: 401 }
      )
    }

    const assignment = await prisma.assignment.findUnique({
      where: { id: Number(assignmentId) },
      include: {
        submissions: {
          include: {
            student: {
              include: { user: true }
            }
          }
        }
      }
    })

    return NextResponse.json(
      { message: "Found assignment", assignment },
      { status: 200 }
    )
  } catch (error) {
    console.log(
      "Error while getting assignment @api/(LMS)/classes/my-class/[classId]/assignments/[subjectId]/[assignmentId]",
      error
    )
    return NextResponse.json(
      { message: "Error while getting assignment" },
      {
        status: 500
      }
    )
  }
}
type body = {
  id: number
  startDate: string
  deadline: string
  tag: string
  assignmentType: string
  status: "PENDING" | "SUBMITTED" | "APPROVED" | "REJECTED" | "LATE"
}

export async function PATCH(req: Request) {
  try {
    const user = await currentUser()

    const data: body = await req.json()
    const { searchParams } = new URL(req.url)
    const updateAssignmentSubmission = searchParams.get(
      "updateAssignmentSubmission"
    )
    const SubmissionId = searchParams.get("SubmissionId")
    if (
      user?.publicMetadata.role !== "faculty" &&
      user?.publicMetadata.role !== "authority"
    ) {
      return NextResponse.json(
        { message: "You are not allowed to create an assignment" },
        { status: 401 }
      )
    }

    if (updateAssignmentSubmission) {
      const { status } = data
      if (!status) {
        return NextResponse.json(
          { message: "Status is required to update assignment submission" },
          { status: 400 }
        )
      }
      if (!SubmissionId) {
        return NextResponse.json(
          {
            message: "SubmissionId is required to update assignment submission"
          },
          { status: 400 }
        )
      }
      const updatedAssignmentSubmission =
        await prisma.assignmentSubmission.update({
          where: { id: Number(SubmissionId) },
          data: {
            status: status
          }
        })
      return NextResponse.json(
        {
          message: "Assignment submission updated successfully",
          AssignmentSubmission: updatedAssignmentSubmission
        },
        { status: 200 }
      )
    }
    console.log("data: ", data)
    const assignment = await prisma.assignment.update({
      where: { id: Number(data.id) },
      data: {
        startDate: data.startDate,
        deadline: data.deadline,
        tag: [data.tag],
        assignmentType: data.assignmentType
      }
    })

    if (!assignment) {
      throw new Error("Error while updating assignment")
    }
    return NextResponse.json(
      { message: "Assignment updating succesfully", assignment },
      {
        status: 200
      }
    )
  } catch (error) {
    console.log(
      "Error while update assignment @/api/classes/my-class/[classId]/assignments/[subjectId]/[assignmentId]",
      error
    )
    return NextResponse.json(
      { message: "Error while creating Assignment" },
      { status: 500 }
    )
  }
}
