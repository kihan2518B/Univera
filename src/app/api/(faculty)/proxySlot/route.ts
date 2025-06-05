import prisma from "@/lib/prisma"
import { handleProxyEmail } from "@/utils/emailHandler"
import { NextResponse } from "next/server"

const getFacultyById = async (id: string) => {
  return await prisma.user.findUnique({ where: { id } })
}

const getSlotById = async (slotId: string) => {
  return await prisma.slot.findUnique({
    where: { id: Number(slotId) },
    include: {
      faculty: {
        include: {
          user: true
        }
      },
      class: true
    }
  })
}

const getProxySlotById = async (id: string) => {
  return await prisma.proxySlot.findUnique({ where: { id: Number(id) } })
}

export async function PATCH(req: Request) {
  const url = new URL(req.url)
  const route = url.searchParams.get("route")
  const { slotId, lecturerId, reason, date, editingProxyId, proxyId, status } =
    await req.json()

  if (route === "statusUpdate") {
    if (!proxyId || !status) {
      return NextResponse.json(
        { error: "Proxy ID and status are required" },
        { status: 400 }
      )
    }

    try {
      // Send email notification for status change
      const proxySlot = await getProxySlotById(String(proxyId))
      const slot = await getSlotById(String(proxySlot?.slotId))
      const fromFaculty = await getFacultyById(String(slot?.facultyId))
      const toLecturer = await getFacultyById(String(proxySlot?.lecturerId))

      const updated = await prisma.proxySlot.update({
        where: { id: Number(proxyId) },
        data: { status }
      })

      await handleProxyEmail({
        type: "STATUS_CHANGE", // or other type
        fromFaculty: fromFaculty
          ? { name: fromFaculty.name, email: fromFaculty.email }
          : undefined,
        toLecturer: toLecturer
          ? { name: toLecturer.name, email: toLecturer.email }
          : undefined,
        slot: {
          startTime: slot?.startTime,
          endTime: slot?.endTime,
          title: slot?.title,
          location: slot?.location,
          className: slot?.class?.name
        },
        date,
        status
      })

      return NextResponse.json(
        { message: `Proxy slot ${status.toLowerCase()} successfully`, updated },
        { status: 200 }
      )
    } catch (error) {
      console.error("Error updating proxy slot status:", error)
      return NextResponse.json(
        { error: "Failed to update status" },
        { status: 500 }
      )
    }
  } else if (route === "editProxy") {
    if (!editingProxyId || !slotId || !lecturerId || !date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    try {
      // Send email notification
      const oldProxy = await getProxySlotById(String(editingProxyId))
      const slot = await getSlotById(String(slotId))
      const fromFaculty = await getFacultyById(String(slot?.facultyId))
      const oldLecturer = await getFacultyById(String(oldProxy?.lecturerId))
      const toLecturer = await getFacultyById(String(lecturerId))

      // Update existing proxy slot
      const updatedProxySlot = await prisma.proxySlot.update({
        where: { id: Number(editingProxyId) },
        data: {
          slotId: Number(slotId),
          lecturerId: String(lecturerId),
          reason: reason || "No reason provided",
          date: String(date)
        }
      })

      await handleProxyEmail({
        type: "UPDATE_LECTURER",
        fromFaculty: fromFaculty
          ? { name: fromFaculty.name, email: fromFaculty.email }
          : undefined,
        toLecturer: toLecturer
          ? { name: toLecturer.name, email: toLecturer.email }
          : undefined,
        oldLecturer: oldLecturer
          ? { name: oldLecturer.name, email: oldLecturer.email }
          : undefined,
        slot: {
          startTime: slot?.startTime,
          endTime: slot?.endTime,
          title: slot?.title,
          location: slot?.location,
          className: slot?.class?.name
        },
        reason,
        date
      })

      return NextResponse.json(
        { message: "Proxy slot updated successfully", updatedProxySlot },
        { status: 200 }
      )
    } catch (error) {
      console.error("Error updating proxy slot:", error)
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      )
    }
  } else if (route === "createProxy") {
    if (!slotId || !lecturerId || !date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    try {
      const proxySlot = await prisma.proxySlot.create({
        data: {
          slotId: Number(slotId),
          lecturerId: String(lecturerId),
          reason: reason || "No reason provided",
          status: "PENDING",
          date: String(date)
        }
      })

      // Send email notification
      const slot = await getSlotById(String(slotId))
      const fromFaculty = await getFacultyById(String(slot?.facultyId)) // example field
      const toLecturer = await getFacultyById(String(lecturerId))

      await handleProxyEmail({
        type: "NEW_REQUEST",
        fromFaculty: fromFaculty
          ? { name: fromFaculty.name, email: fromFaculty.email }
          : undefined,
        toLecturer: toLecturer
          ? { name: toLecturer.name, email: toLecturer.email }
          : undefined,
        slot: {
          startTime: slot?.startTime,
          endTime: slot?.endTime,
          title: slot?.title,
          location: slot?.location,
          className: slot?.class?.name
        },
        reason,
        date
      })

      return NextResponse.json(
        { message: "Proxy slot created successfully", proxySlot },
        { status: 201 }
      )
    } catch (error) {
      console.error("Error creating proxy slot:", error)
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      )
    }
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const userId = url.searchParams.get("userId")
  try {
    if (!userId) {
      return NextResponse.json(
        { message: "Class Id is required" },
        { status: 400 }
      )
    }

    const proxySlots = await prisma.proxySlot.findMany({
      where: {
        OR: [{ slot: { facultyId: userId } }, { lecturerId: userId }]
      },
      include: {
        slot: {
          include: {
            class: true
          }
        }
      },
      orderBy: {
        date: "desc"
      }
    })

    return NextResponse.json(proxySlots, { status: 200 })
  } catch (error) {
    console.error("Error fetching proxy slots:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  const { id } = await req.json()

  if (!id) {
    return NextResponse.json(
      { error: "Proxy slot ID is required" },
      { status: 400 }
    )
  }

  try {
    const oldProxy = await getProxySlotById(String(id))
    const slot = await getSlotById(String(oldProxy?.slotId))
    const fromFaculty = await getFacultyById(String(slot?.facultyId))
    const toLecturer = await getFacultyById(String(oldProxy?.lecturerId))

    const deletedProxySlot = await prisma.proxySlot.delete({
      where: { id: Number(id) }
    })

    // Send email notification for deletion
    await handleProxyEmail({
      type: "DELETE_APPROVED",
      fromFaculty: fromFaculty
        ? { name: fromFaculty.name, email: fromFaculty.email }
        : undefined,
      toLecturer: toLecturer
        ? { name: toLecturer.name, email: toLecturer.email }
        : undefined,
      slot: {
        startTime: slot?.startTime,
        endTime: slot?.endTime,
        title: slot?.title,
        location: slot?.location,
        className: slot?.class?.name
      },
      date: deletedProxySlot.date
    })

    return NextResponse.json(
      { message: "Proxy slot deleted successfully", deletedProxySlot },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error deleting proxy slot:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
