import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request, context: any) {
  try {
    const { subjectId } = await context.params

    const subjects = await prisma.subject.findUnique({
      where: { id: Number(subjectId) },
      include: {
        faculties: true,
        assignment: true
      }
    })

    return NextResponse.json(
      {
        message: "Success",
        assignments: subjects?.assignment,
        faculties: subjects?.faculties
      }, //we want all faculties of the subject
      { status: 200 }
    )
  } catch (error) {
    console.log(
      `Error while getting assignments @api/classes/my-class/[classId]/assignments/[subjectId] ${error}`
    )

    return NextResponse.json(
      { message: "Error while getting assignments" },
      { status: 500 }
    )
  }
}
