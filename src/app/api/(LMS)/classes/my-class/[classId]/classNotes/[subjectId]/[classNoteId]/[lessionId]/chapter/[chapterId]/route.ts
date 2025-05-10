import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function DELETE(req: Request, context: any) {
  try {
    const user = await currentUser()

    if (!user) {
      return NextResponse.json({ message: "Not Authorized" }, { status: 401 })
    }
    const { classId, subjectId, classNoteId, lessionId, chapterId } =
      await context.params
    if (!classId || !subjectId || !classNoteId || !lessionId || !chapterId) {
      return NextResponse.json(
        {
          message:
            "Unable to find subjectId or classId or classNoteId or lessionId or chapterId"
        },
        {
          status: 501
        }
      )
    }

    await prisma.chapter.delete({ where: { id: Number(chapterId) } })
    return NextResponse.json(
      { message: "Chapter deleted succesfully" },
      { status: 200 }
    )
  } catch (error) {
    console.log(
      "Error while Deleting chapter @/api/classes/my-class/[classId]/classNotes/[subjectId]/[classNoteId]/[lessionId]/chapter/[chapterId]: ",
      error
    )
    return NextResponse.json(
      { message: "Error while Deleting chapter" },
      { status: 501 }
    )
  }
}

export async function PATCH(req: Request, context: any) {
  try {
    const user = await currentUser()

    if (!user) {
      return NextResponse.json({ message: "Not Authorized" }, { status: 401 })
    }
    const { classId, subjectId, classNoteId, lessionId, chapterId } =
      await context.params
    if (!classId || !subjectId || !classNoteId || !lessionId || !chapterId) {
      return NextResponse.json(
        {
          message:
            "Unable to find subjectId or classId or classNoteId or lessionId or chapterId"
        },
        {
          status: 501
        }
      )
    }
    const body = await req.json()
    const { searchParams } = new URL(req.url)
    const updateTitle = searchParams.get("updateTitle")
    const updateData = searchParams.get("updateData")

    if (updateTitle) {
      const chapter = await prisma.chapter.update({
        where: { id: Number(chapterId) },
        data: {
          title: body.title
        }
      })
      return NextResponse.json(
        { message: "Title updated", chapter },
        { status: 200 }
      )
    } else if (updateData) {
      const chapter = await prisma.chapter.findUnique({
        where: { id: Number(chapterId) }
      })
      if (!chapter || !Array.isArray(chapter.data)) {
        return NextResponse.json(
          { message: "Invalid chapter or data" },
          { status: 400 }
        )
      }
      //first getting old data then replacing it by adding the new One
      const updatedChapter = await prisma.chapter.update({
        where: { id: Number(chapterId) },
        data: {
          data: [...chapter.data, body.data]
        }
      })
      return NextResponse.json(
        { message: "Chapter updated", chapter: updatedChapter },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { message: "No update option provided" },
      { status: 400 }
    )
  } catch (error) {
    console.log(
      "Error while Updating chapter @/api/classes/my-class/[classId]/classNotes/[subjectId]/[classNoteId]/[lessionId]/chapter/[chapterId]: ",
      error
    )
    return NextResponse.json(
      { message: "Error while Updating chapter" },
      { status: 501 }
    )
  }
}
