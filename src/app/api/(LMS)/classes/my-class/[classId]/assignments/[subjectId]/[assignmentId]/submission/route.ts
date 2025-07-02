import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, context: any) {
  const { searchParams } = new URL(req.url)
  const { params } = await context
  const assignmentId = params.assignmentId
  const submissionData = await req.json()
  const { studentId, attachments } = submissionData
  if (
    !studentId ||
    !attachments ||
    !assignmentId ||
    !Array.isArray(attachments)
  ) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    )
  }

  const submissionId = searchParams.get("submissionId")
  if (submissionId) {
    try {
      const submission = await prisma.assignmentSubmission.findUnique({
        where: { id: Number(submissionId) }
      })
      if (!submission) {
        return NextResponse.json(
          { message: "Submission not found" },
          { status: 404 }
        )
      }

      const updatedSubmission = await prisma.assignmentSubmission.update({
        where: { id: Number(submissionId) },
        data: {
          studentId,
          attachments,
          assignmentId: Number(assignmentId)
        }
      })

      return NextResponse.json(
        { message: "Submission updated successfully", updatedSubmission },
        { status: 200 }
      )
    } catch (error) {
      return NextResponse.json(
        { message: "Error updating submission", error },
        { status: 500 }
      )
    }
  }

  try {
    const newSubmission = await prisma.assignmentSubmission.create({
      data: {
        studentId,
        attachments,
        assignmentId: Number(assignmentId),
        status: "SUBMITTED"
      }
    })

    return NextResponse.json(
      { message: "Submission created successfully", newSubmission },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating submission", error },
      { status: 500 }
    )
  }
}

export async function GET(req: Request, context: any) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")
  const { assignmentId } = await context.params

  if (!assignmentId || !userId) {
    return NextResponse.json(
      { message: "Assignment ID is required" },
      { status: 400 }
    )
  }

  try {
    const submissions = await prisma.assignmentSubmission.findFirst({
      where: {
        assignmentId: Number(assignmentId),
        studentId: userId
      }
    })

    return NextResponse.json(
      { message: "Submissions fetched successfully", submissions },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching submissions", error },
      { status: 500 }
    )
  }
}
