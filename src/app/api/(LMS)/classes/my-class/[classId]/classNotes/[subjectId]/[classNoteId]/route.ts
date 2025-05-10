import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, context: any) {
  try {
    const user = await currentUser()

    if (!user) {
      return NextResponse.json({ message: "Not Authorized" }, { status: 401 })
    }
    const { classId, subjectId, classNoteId } = await context.params

    if (!classId || !subjectId) {
      return NextResponse.json(
        { message: "Unable to find subjectId or classId" },
        {
          status: 501
        }
      )
    }
    const body = await req.json()
    const updatedclassNote = prisma.classNote.update({
      where: { id: Number(classNoteId) },
      data: body
    })
    return NextResponse.json(
      {
        message: "ClassNote updated Successfully",
        classNote: updatedclassNote
      },
      { status: 200 }
    )
  } catch (error) {
    console.log(
      "Error while Updating classNote @/api/classes/my-class/[classId]/classNotes/[subjectId]/[classNoteId]: ",
      error
    )
    return NextResponse.json(
      { message: "Error while Updating classNote" },
      { status: 501 }
    )
  }
}

export async function DELETE(req: Request, context: any) {
  try {
    const user = await currentUser()

    if (!user) {
      return NextResponse.json({ message: "Not Authorized" }, { status: 401 })
    }

    const { classNoteId } = await context.params

    await prisma.classNote.delete({
      where: { id: Number(classNoteId) }
    })
    return NextResponse.json(
      { message: "Delete successfull" },
      {
        status: 200
      }
    )
  } catch (error) {
    console.log(
      "Error while Deleting classNote @/api/classes/my-class/[classId]/classNotes/[subjectId]/[classNoteId]: ",
      error
    )
    return NextResponse.json(
      { message: "Error while Deleting classNote" },
      { status: 501 }
    )
  }
}

export async function POST(req: Request, context: any) {
  try {
    const user = await currentUser()

    if (!user) {
      return NextResponse.json({ message: "Not Authorized" }, { status: 401 })
    }
    const { classId, subjectId, classNoteId } = await context.params

    if (!classId || !subjectId) {
      return NextResponse.json(
        { message: "Unable to find subjectId or classId" },
        {
          status: 501
        }
      )
    }
    const { searchParams } = new URL(req.url)
    const AddLession = searchParams.get("AddLession")
    if (AddLession) {
      const { lessionTitle } = await req.json()
      console.log("lessionTitle: ", lessionTitle, classNoteId)
      const newLession = await prisma.lession.create({
        data: {
          title: lessionTitle,
          classNoteId: Number(classNoteId)
        }
      })

      return NextResponse.json(
        { message: "Lession Created", lession: newLession },
        {
          status: 201
        }
      )
    } else {
      return NextResponse.json(
        { message: "Opps you forgot searchParams" },
        {
          status: 403
        }
      )
    }
  } catch (error) {
    console.log(
      "Error while creating Lessions @/api/classes/my-class/[classId]/classNotes/[subjectId]/[classNoteId]: ",
      error
    )
    return NextResponse.json(
      { message: "Error while creating Lessions" },
      { status: 501 }
    )
  }
}
