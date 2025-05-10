import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(req: Request, context: any) {
  try {
    const { quizId } = await context.params
    const Quiz = await prisma.quiz.findUnique({
      where: { id: Number(quizId) },
      include: { questions: true }
    })
    return NextResponse.json({ message: "Found Quiz", Quiz }, { status: 200 })
  } catch (error) {
    console.log(
      "Error while getting quiz @/api/classes/my-class/[classId]/quizes/[quizId]",
      error
    )
    return NextResponse.json(
      { message: "Error while getting quiz" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request, context: any) {
  const user = await currentUser()

  if (!user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { quizId } = await context.params
    const { searchParams } = new URL(req.url)
    const UpdateStatus = await searchParams.get("UpdateStatus")
    const UpdateVisibility = await searchParams.get("UpdateVisibility")

    const { newStatus, newVisibility } = await req.json()
    if (UpdateStatus) {
      console.log("newStatus: ", newStatus)
      const Quiz = await prisma.quiz.update({
        where: { id: Number(quizId) },
        data: { status: newStatus }
      })
      return NextResponse.json(
        { message: "Updated Status", Quiz },
        { status: 200 }
      )
    } else if (UpdateVisibility) {
      const Quiz = await prisma.quiz.update({
        where: { id: Number(quizId) },
        data: { visibility: newVisibility }
      })
      return NextResponse.json(
        { message: "Updated Visibility", Quiz },
        { status: 200 }
      )
    }
  } catch (error) {
    console.log(
      "Error while updating quiz @/api/classes/my-class/[classId]/quizes/[quizId]",
      error
    )
    return NextResponse.json(
      { message: "Error while updating quiz" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request, context: any) {
  const user = await currentUser()

  if (!user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const { quizId } = await context.params
    // Delete quiz and related questions in a transaction
    const Quiz = await prisma.$transaction(async (tx) => {
      // First delete all related questions
      await tx.question.deleteMany({
        where: { quizId: Number(quizId) }
      })

      // Then delete the quiz
      return tx.quiz.delete({
        where: { id: Number(quizId) }
      })
    })
    return NextResponse.json({ message: "Quiz Deleted", Quiz }, { status: 200 })
  } catch (error) {
    console.log(
      "Error while deleting quiz @/api/classes/my-class/[classId]/quizes/[quizId]",
      error
    )
    return NextResponse.json(
      { message: "Error while Deleting quiz" },
      { status: 500 }
    )
  }
}
