import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(req: Request, context: any) {
  try {
    const user = await currentUser()

    if (!user) {
      return NextResponse.json({ message: "Not Authorized" }, { status: 401 })
    }
    const { classId, subjectId, classNoteId, lessionId } = await context.params
    if (!classId || !subjectId || !classNoteId || !lessionId) {
      return NextResponse.json(
        {
          message:
            "Unable to find subjectId or classId or classNoteId or lessionId"
        },
        {
          status: 501
        }
      )
    }
    const body = await req.json()
    const newChapter = await prisma.chapter.create({
      data: {
        classNoteId: Number(classNoteId),
        lessionId: Number(lessionId),
        title: body.title
      }
    })
    return NextResponse.json(
      { message: "New Chapter Created", chapter: newChapter },
      { status: 201 }
    )
  } catch (error) {
    console.log(
      "Error while creating chapter @/api/classes/my-class/[classId]/classNotes/[subjectId]/[classNoteId]/[lessionId]/chapter: ",
      error
    )
    return NextResponse.json(
      { message: "Error while creating chapter" },
      { status: 501 }
    )
  }
}

export async function GET(req: Request, context: any) {
  try {
    const user = await currentUser()

    if (!user) {
      return NextResponse.json({ message: "Not Authorized" }, { status: 401 })
    }
    const { classId, subjectId, classNoteId, lessionId } = await context.params
    if (!classId || !subjectId || !classNoteId || !lessionId) {
      return NextResponse.json(
        {
          message:
            "Unable to find subjectId or classId or classNoteId or lessionId"
        },
        {
          status: 501
        }
      )
    }
    const chapters = await prisma.chapter.findMany({
      where: { lessionId: Number(lessionId) },
      orderBy: {
        createdAt: "asc"
      }
    })
    const lession = await prisma.lession.findUnique({
      where: { id: Number(lessionId) },
      include: {
        classNote: true
      }
    })
    return NextResponse.json(
      {
        message: "Found Chapters",
        chapters,
        lession,
        classNote: lession?.classNote
      },
      { status: 200 }
    )
  } catch (error) {
    console.log(
      "Error while getting chapter @/api/classes/my-class/[classId]/classNotes/[subjectId]/[classNoteId]/[lessionId]/chapter: ",
      error
    )
    return NextResponse.json(
      { message: "Error while getting chapter" },
      { status: 501 }
    )
  }
}
