import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(req: Request) {
  try {
    // Parse the request body
    const { timeTableData, slotsData } = await req.json()

    // Validate timetable data
    if (
      !timeTableData ||
      !timeTableData.courseId ||
      !timeTableData.classId ||
      !timeTableData.departmentId
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid timetable data. Provide courseId, classId, and departmentId."
        },
        { status: 400 }
      )
    }

    // Validate slots data
    if (!Array.isArray(slotsData) || slotsData.length === 0) {
      return NextResponse.json(
        { error: "Invalid slots data. Provide an array of slot objects." },
        { status: 400 }
      )
    }

    const validSlotsData = slotsData.filter((slot) => {
      const { day, fromTime, toTime, title } = slot
      return day && fromTime && toTime && title
    })

    if (validSlotsData.length === 0) {
      return NextResponse.json(
        { error: "No valid slot data to process." },
        { status: 400 }
      )
    }

    // Use Prisma transaction for atomicity
    const [createdTimeTable, createdSlots] = await prisma.$transaction(
      async (tx) => {
        // Create the TimeTable record
        const createdTimeTable = await tx.timeTable.create({
          data: {
            courseId: timeTableData.courseId,
            classId: timeTableData.classId,
            departmentId: timeTableData.departmentId
          }
        })

        // Prepare Slot records with optional `facultyId` and `lecturerId`
        const newSlots = validSlotsData.map((slot) => ({
          day: slot.day,
          fromTime: slot.fromTime,
          toTime: slot.toTime,
          title: slot.title,
          timeTableId: createdTimeTable.id,
          courseId: createdTimeTable.courseId,
          classId: createdTimeTable.classId,
          departmentId: createdTimeTable.departmentId,
          subjectId: slot.subjectId || null,
          facultyId: slot.facultyId || null, // Set optional fields to null if not provided
          lecturerId: slot.lecturerId || null
        }))

        // Bulk create Slot records
        const createdSlots = await tx.slot.createMany({
          data: newSlots,
          skipDuplicates: true // Avoid duplicate entries
        })

        return [createdTimeTable, createdSlots]
      }
    )

    return NextResponse.json(
      {
        message: "TimeTable and Slots created successfully",
        timeTable: createdTimeTable,
        slots: createdSlots
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Error creating TimeTable and Slots:", error.message)
    return NextResponse.json(
      {
        error: "Failed to create TimeTable and Slots",
        details: error.message
      },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const route = url.searchParams.get("route")

  // Check the route and handle accordingly
  if (route === "facultyDetails") {
    const classId = url.searchParams.get("classId")

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
  } else if (route === "timeTableSlots") {
    const classId = url.searchParams.get("classId")

    if (!classId) {
      return NextResponse.json(
        { message: "Class Id is required" },
        { status: 400 }
      )
    }

    try {
      const slots = await prisma.slot.findMany({
        where: {
          classId: Number(classId)
        }
      })

      return NextResponse.json(slots, { status: 200 })
    } catch (error) {
      console.log(
        "Error fetching subject details @api/subjects/forum/tags:",
        error
      )
      return NextResponse.json(
        { error: "Internal server error @api/subjects/forum/tags" },
        { status: 500 }
      )
    }
  } else {
    return NextResponse.json({ error: "Route not found" }, { status: 404 })
  }
}
