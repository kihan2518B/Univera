import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, context: any) {
  try {
    const User = await currentUser()
    if (!User?.id)
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 })
    const { questionId } = await context.params
    const body = await req.json()
    body.marks = Number(body.marks)
    console.log("editedQuestion: ", body, questionId)
    const Question = await prisma.question.update({
      where: { id: Number(questionId) },
      data: body
    })
    return NextResponse.json(
      { message: "Updated Question", Question },
      { status: 200 }
    )
  } catch (error) {
    console.log(
      "Error while updating quiz @/api/classes/my-class/[classId]/quizes/[questionId]",
      error
    )
    return NextResponse.json(
      { message: "Error while updating question" },
      { status: 500 }
    )
  }
}
