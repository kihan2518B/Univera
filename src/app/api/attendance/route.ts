import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const {
      classId,
      slotId,
      date,
      subjectId,
      facultyId,
      courseId,
      departmentId,
      universityId,
      attendance,
      attendanceId,
      attendanceDate,
      isLock
    } = body

    if (
      !classId ||
      !slotId ||
      !date ||
      !subjectId ||
      !facultyId ||
      !courseId ||
      !departmentId ||
      !universityId ||
      typeof attendance !== "object"
    ) {
      return NextResponse.json(
        { error: "Missing or invalid fields" },
        { status: 400 }
      )
    }

    // If `existingId` is present, handle update
    try {
      if (attendanceId && attendanceDate) {
        if (attendanceDate !== date) {
          if (isLock) {
            return NextResponse.json(
              {
                error:
                  "You can only update attendance on the same day it was taken"
              },
              { status: 403 }
            )
          }
        }

        const updated = await prisma.attendanceRecord.update({
          where: { id: attendanceId },
          data: { attendance }
        })

        return NextResponse.json(updated, { status: 200 })
      }
    } catch (error) {
      return NextResponse.json(
        {
          error: "Error while updating attendance",
          details: error
        },
        { status: 500 }
      )
    }

    // Create
    const created = await prisma.attendanceRecord.create({
      data: {
        classId,
        slotId: Number(slotId),
        date,
        subjectId,
        facultyId,
        courseId,
        departmentId,
        universityId,
        attendance,
        isLock: true
      }
    })

    return NextResponse.json(created, { status: 201 })
  } catch (error: any) {
    console.error("Attendance PATCH error:", error)
    return NextResponse.json(
      { error: "Failed to process attendance", detail: error.message },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const classId = searchParams.get("classId")
  const slotId = searchParams.get("slotId") // Get the `id` from URL parameters
  const date = searchParams.get("date")

  if (!date || !classId) {
    return NextResponse.json(
      { error: "Date and classId parameter is required" },
      { status: 400 }
    )
  }

  try {
    const attendance = await prisma.attendanceRecord.findUnique({
      where: {
        classId_slotId_date: {
          classId: Number(classId),
          slotId: Number(slotId),
          date: String(date)
        }
      }
    })

    return NextResponse.json(attendance, { status: 200 })
  } catch (error: any) {
    console.log("Error while fetching attendance:", error.message)
    return NextResponse.json(
      {
        error: "Failed to fetch attendance",
        details: error.message
      },
      { status: 500 }
    )
  }
}
