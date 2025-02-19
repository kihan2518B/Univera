import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const classId = searchParams.get("classId")

  if (!classId) {
    return NextResponse.json(
      { message: "Class Id is required" },
      { status: 400 }
    )
  }

  try {
    const faculties = await prisma.faculty.findMany({
      where: {
        class: {
          some: {
            id: Number(classId)
          }
        }
      },
      include: {
        subject: true,
        user: true
      }
    })

    return NextResponse.json(faculties, { status: 200 })
  } catch (error) {
    console.log("Error fetching faculties:", error)
    return NextResponse.json(
      { message: "Error fetching faculties" },
      { status: 500 }
    )
  }
}
