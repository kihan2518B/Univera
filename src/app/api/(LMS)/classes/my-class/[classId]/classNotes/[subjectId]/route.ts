import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(req: Request, context: any) {
  try {
    const crruser = await currentUser()

    if (!crruser) {
      return NextResponse.json({ message: "Not Authorized" }, { status: 401 })
    }
    const { classId, subjectId } = await context.params
    const body = await req.json()
    const { title } = body

    if (!classId || !subjectId) {
      return NextResponse.json(
        { message: "Unable to find subjectId or classId" },
        {
          status: 501
        }
      )
    }
    const user = await prisma.user.findUnique({ where: { id: crruser.id } })
    const newclassNote = await prisma.classNote.create({
      data: {
        title,
        creator: user?.name ?? "unknown",
        subjectId: Number(subjectId)
      },
      include: { lessions: true }
    })

    return NextResponse.json(
      { message: "classNote created successfully", classNote: newclassNote },
      { status: 201 }
    )
  } catch (error) {
    console.log(
      "Error while creating classNote @/api/classes/my-class/[classId]/classNotes/[subjectId]: ",
      error
    )
    return NextResponse.json(
      { message: "Error while creating classNote" },
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
    const { classId, subjectId } = await context.params

    if (!classId || !subjectId) {
      return NextResponse.json(
        { message: "Unable to find subjectId or classId" },
        {
          status: 501
        }
      )
    }
    const classNotes = await prisma.classNote.findMany({
      where: {
        subjectId: Number(subjectId)
      },
      include: {
        lessions: true,
        subject: true
      },
      orderBy: {
        createdAt: "asc"
      }
    })
    return NextResponse.json(
      { message: "Success", classNotes },
      { status: 200 }
    )
  } catch (error) {
    console.log(
      "Error while fetching classNote @/api/classes/my-class/[classId]/classNotes/[subjectId]: ",
      error
    )
    return NextResponse.json(
      { message: "Error while fetching classNote" },
      { status: 501 }
    )
  }
}
