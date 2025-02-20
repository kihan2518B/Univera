import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id") // Get the `id` from URL parameters
  const date = searchParams.get("date")
  const canUsePage = searchParams.get("canUsePage")

  if (!canUsePage === false) {
    return NextResponse.json(
      { message: "You are not allowed to create or modify attendance" },
      { status: 401 }
    )
  }

  try {
    const attendanceArray = await req.json()

    if (!Array.isArray(attendanceArray) || attendanceArray.length === 0) {
      return NextResponse.json(
        { error: "Invalid attendance data. Array required." },
        { status: 400 }
      )
    }

    // Validate data structure and remove invalid records
    const validAttendance = attendanceArray.filter((attendance) => {
      const {
        studentId,
        rollNo,
        classId,
        semester,
        status,
        date,
        slotId,
        facultyId,
        subjectId,
        courseId,
        departmentId,
        universityId
      } = attendance

      return (
        studentId &&
        rollNo &&
        classId &&
        semester &&
        status &&
        date &&
        slotId &&
        facultyId &&
        subjectId &&
        courseId &&
        departmentId &&
        universityId
      )
    })

    if (validAttendance.length === 0) {
      return NextResponse.json(
        { error: "No valid attendance data to process." },
        { status: 400 }
      )
    }

    console.log("id, date", id, date)

    // If `id` and `date` are provided, delete records for the specific date and class
    if (id && date) {
      const inputDate = new Date(date)
      const currentDate = new Date()
      const timeDifference = currentDate.getTime() - inputDate.getTime()
      const hoursDifference = timeDifference / (1000 * 60 * 60)

      // Check if the date falls within the last 24 hours
      if (hoursDifference >= 0 && hoursDifference <= 24) {
        // Update existing records
        const updatedRecords = await Promise.all(
          validAttendance.map(async (attendanceData) => {
            const existingRecord = await prisma.attendance.findFirst({
              where: {
                studentId: attendanceData.studentId,
                classId: Number(id),
                date: String(date)
              }
            })

            if (existingRecord) {
              // Update the existing record
              return prisma.attendance.update({
                where: { id: existingRecord.id },
                data: {
                  status: attendanceData.status,
                  updatedAt: new Date()
                }
              })
            }
          })
        )

        return NextResponse.json(updatedRecords, { status: 200 })
      } else {
        return NextResponse.json(
          { error: "Cannot update records outside the 24-hour window." },
          { status: 400 }
        )
      }
    } else {
      // Bulk create new attendance records
      const newRecords = validAttendance.map((attendanceData) => ({
        ...attendanceData
      }))

      const result = await prisma.attendance.createMany({
        data: newRecords,
        skipDuplicates: true // Prevent duplicate entries
      })

      return NextResponse.json(result, { status: 201 })
    }
  } catch (error: any) {
    console.log("Error while updating attendance:", error.message)
    return NextResponse.json(
      {
        error: "Failed to update or create attendance",
        details: error.message
      },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const classId = searchParams.get("classId") // Get the `id` from URL parameters
  const date = searchParams.get("date")

  if (!date || !classId) {
    return NextResponse.json(
      { error: "Date and classId parameter is required" },
      { status: 400 }
    )
  }

  try {
    const attendance = await prisma.attendance.findMany({
      where: {
        classId: Number(classId),
        date
      },
      include: {
        student: {
          include: {
            user: true
          }
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
