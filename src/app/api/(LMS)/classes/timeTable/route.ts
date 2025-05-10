import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(req: Request) {
  try {
    // Parse the request body
    const { timeTableData, slotsData, timeTableId, timeTableSlots } =
      await req.json()

    // Validate timetable data
    if (
      !timeTableData ||
      !timeTableData.courseId ||
      !timeTableData.classId ||
      !timeTableData.departmentId
    ) {
      // console.log("first")
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
      // console.log("second")
      return NextResponse.json(
        { error: "Invalid slots data. Provide an array of slot objects." },
        { status: 400 }
      )
    }

    const validSlotsData = slotsData.filter((slot) => {
      const { day, startTime, endTime, subject } = slot
      return day && startTime && endTime && subject
    })

    // console.log("validSlotsData", validSlotsData)

    if (validSlotsData.length === 0) {
      // console.log("third")
      return NextResponse.json(
        { error: "No valid slot data to process." },
        { status: 400 }
      )
    }

    console.log("Incoming timeTableData:", timeTableData)

    // Case 1: Fresh Timetable Creation (No `timeTableId` in request)
    if (!timeTableId) {
      const { courseId, classId, departmentId } = timeTableData
      // Use Prisma transaction for atomicity
      const [createdTimeTable, createdSlots] = await prisma.$transaction(
        async (tx) => {
          // Create the TimeTable record
          const createdTimeTable = await tx.timeTable.create({
            data: {
              courseId,
              classId,
              departmentId
            }
          })

          console.log("Created TimeTable:", createdTimeTable)

          // Prepare Slot records with optional `facultyId` and `lecturerId`
          const newSlots = validSlotsData.map((slot) => ({
            day: slot.day,
            startTime: slot.startTime,
            endTime: slot.endTime,
            title: slot.subject,
            tag: slot.tag,
            location: slot.location,
            remarks: slot.remarks,
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
    } else {
      // Case 2: Update Existing Timetable (timeTableId is provided)
      // Prepare categorized data
      const existingSlotsMap = new Map<string, any>(
        timeTableSlots.map((slot: any) => [
          `${slot.day}-${slot.startTime}-${slot.endTime}`,
          slot
        ])
      )

      const newSlotsMap = new Map<string, any>(
        slotsData.map((slot) => [
          `${slot.day}-${slot.startTime}-${slot.endTime}`,
          slot
        ])
      )

      // Find slots to update (exists in both but with changes)
      const slotsToUpdate = Array.from(newSlotsMap.keys())
        .filter((key) => existingSlotsMap.has(key))
        .map((key) => {
          const existing = existingSlotsMap.get(key)
          const incoming = newSlotsMap.get(key)
          if (
            existing.title !== incoming.subject ||
            existing.subjectId !== incoming.subjectId ||
            existing.facultyId !== incoming.facultyId ||
            existing.tag !== incoming.tag ||
            existing.location !== incoming.location ||
            existing.remarks !== incoming.remarks
          ) {
            return { ...incoming, id: existing.id }
          }
          return null
        })
        .filter(Boolean)

      // Find slots to create (exists in slotsData but not in DB)
      const slotsToCreate = Array.from(newSlotsMap.keys())
        .filter((key) => !existingSlotsMap.has(key))
        .map((key) => newSlotsMap.get(key))

      // Perform database operations using transaction
      await prisma.$transaction(async (tx) => {
        // Update existing slots
        for (const slot of slotsToUpdate) {
          await tx.slot.update({
            where: { id: slot.id },
            data: {
              title: slot.subject,
              subjectId: slot.subjectId || null,
              facultyId: slot.facultyId || null,
              lecturerId: slot.lecturerId || null,
              tag: slot.tag || null,
              location: slot.location || null,
              remarks: slot.remarks || null
            }
          })
        }

        // Create new slots
        if (slotsToCreate.length > 0) {
          await tx.slot.createMany({
            data: slotsToCreate.map((slot) => ({
              day: slot.day,
              startTime: slot.startTime,
              endTime: slot.endTime,
              title: slot.subject,
              tag: slot.tag,
              location: slot.location,
              remarks: slot.remarks,
              timeTableId,
              courseId: timeTableData.courseId,
              classId: timeTableData.classId,
              departmentId: timeTableData.departmentId,
              subjectId: slot.subjectId || null,
              facultyId: slot.facultyId || null,
              lecturerId: slot.lecturerId || null
            })),
            skipDuplicates: true
          })
        }
      })

      return NextResponse.json(
        { message: "TimeTable updated successfully" },
        { status: 200 }
      )
    }
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
      return NextResponse.json(
        { message: "Error fetching faculties", error: error },
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
      return NextResponse.json(
        {
          error: "Internal server error @api/subjects/forum/tags",
          details: error
        },
        { status: 500 }
      )
    }
  } else if (route === "allTimeTableSlots") {
    try {
      const slots = await prisma.slot.findMany({})

      return NextResponse.json(slots, { status: 200 })
    } catch (error) {
      return NextResponse.json(
        {
          error: "Internal server error @api/subjects/forum/tags",
          details: error
        },
        { status: 500 }
      )
    }
  } else {
    return NextResponse.json({ error: "Route not found" }, { status: 404 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { day, startTime, classId, timeTableId } = await req.json()

    if (!day || !startTime || !classId || !timeTableId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const deleted = await prisma.slot.deleteMany({
      where: {
        day,
        startTime,
        classId: Number(classId),
        timeTableId
      }
    })

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: "No matching slot found" },
        { status: 404 }
      )
    }

    // Check if any other slots remain for this timetable
    const remainingSlots = await prisma.slot.count({
      where: {
        timeTableId
      }
    })

    // If no slots remain, delete the timetable
    if (remainingSlots === 0) {
      await prisma.timeTable.delete({
        where: {
          id: timeTableId
        }
      })
    }

    return NextResponse.json(
      { message: "Slot deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("DELETE slot error:", error)
    return NextResponse.json(
      { error: "Failed to delete slot" },
      { status: 500 }
    )
  }
}
