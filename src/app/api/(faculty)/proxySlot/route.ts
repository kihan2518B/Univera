import prisma from "@/lib/prisma"
import { handleProxyEmail } from "@/utils/emailHandler"
import { NextResponse } from "next/server"

const getFacultyById = async (id: string) => {
  return await prisma.user.findUnique({ where: { id } })
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
      const updated = await prisma.proxySlot.update({
        where: { id: Number(proxyId) },
        data: { status },
        include: {
          slot: {
            include: {
              faculty: {
                include: {
                  user: true
                }
              },
              class: true
            }
          },
          lecturer: {
            include: {
              user: true
            }
          }
        }
      })

      try {
        // // Send email notification for status change
        await handleProxyEmail({
          type: "STATUS_CHANGE", // or other type
          fromFaculty: updated?.slot?.faculty?.user
            ? {
                name: updated?.slot?.faculty?.user?.name,
                email: updated?.slot?.faculty?.user?.email
              }
            : undefined,
          toLecturer: updated?.lecturer?.user
            ? {
                name: updated?.lecturer?.user?.name,
                email: updated?.lecturer?.user?.email
              }
            : undefined,
          slot: {
            startTime: updated?.slot?.startTime,
            endTime: updated?.slot?.endTime,
            title: updated?.slot?.title,
            location: updated?.slot?.location,
            className: updated?.slot?.class?.name
          },
          date,
          status
        })
      } catch (error) {
        console.error("Error while sending email for proxy slot status:", error)
        return NextResponse.json(
          { message: "Failed to send email" },
          { status: 500 }
        )
      }

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
      const oldLecturer = await getFacultyById(String(oldProxy?.lecturerId))

      // Update existing proxy slot
      const updatedProxySlot = await prisma.proxySlot.update({
        where: { id: Number(editingProxyId) },
        data: {
          slotId: Number(slotId),
          lecturerId: String(lecturerId),
          reason: reason || "No reason provided",
          date: String(date)
        },
        include: {
          slot: {
            include: {
              faculty: {
                include: {
                  user: true
                }
              },
              class: true
            }
          },
          lecturer: {
            include: {
              user: true
            }
          }
        }
      })

      try {
        await handleProxyEmail({
          type: "UPDATE_LECTURER",
          fromFaculty: updatedProxySlot?.slot?.faculty?.user
            ? {
                name: updatedProxySlot?.slot?.faculty?.user?.name,
                email: updatedProxySlot?.slot?.faculty?.user?.email
              }
            : undefined,
          toLecturer: updatedProxySlot?.lecturer?.user
            ? {
                name: updatedProxySlot?.lecturer?.user?.name,
                email: updatedProxySlot?.lecturer?.user?.email
              }
            : undefined,
          oldLecturer: oldLecturer
            ? { name: oldLecturer.name, email: oldLecturer.email }
            : undefined,
          slot: {
            startTime: updatedProxySlot?.slot?.startTime,
            endTime: updatedProxySlot?.slot?.endTime,
            title: updatedProxySlot?.slot?.title,
            location: updatedProxySlot?.slot?.location,
            className: updatedProxySlot?.slot?.class?.name
          },
          reason,
          date
        })
      } catch (error) {
        console.error("Error while sending email for proxy slot update:", error)
        return NextResponse.json(
          { message: "Failed to send email" },
          { status: 500 }
        )
      }

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
        },
        include: {
          slot: {
            include: {
              faculty: {
                include: {
                  user: true
                }
              },
              class: true
            }
          },
          lecturer: {
            include: {
              user: true
            }
          }
        }
      })

      try {
        // Send email notification
        await handleProxyEmail({
          type: "NEW_REQUEST",
          fromFaculty: proxySlot?.slot?.faculty?.user
            ? {
                name: proxySlot?.slot?.faculty?.user?.name,
                email: proxySlot?.slot?.faculty?.user?.email
              }
            : undefined,
          toLecturer: proxySlot?.lecturer?.user
            ? {
                name: proxySlot?.lecturer?.user?.name,
                email: proxySlot?.lecturer?.user?.email
              }
            : undefined,
          slot: {
            startTime: proxySlot?.slot?.startTime,
            endTime: proxySlot?.slot?.endTime,
            title: proxySlot?.slot?.title,
            location: proxySlot?.slot?.location,
            className: proxySlot?.slot?.class?.name
          },
          reason,
          date
        })
      } catch (error) {
        console.error(
          "Error while sending email for proxy slot creation:",
          error
        )
        return NextResponse.json(
          { message: "Failed to send email" },
          { status: 500 }
        )
      }

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
    const deletedProxySlot = await prisma.proxySlot.delete({
      where: { id: Number(id) },
      include: {
        slot: {
          include: {
            faculty: {
              include: {
                user: true
              }
            },
            class: true
          }
        },
        lecturer: {
          include: {
            user: true
          }
        }
      }
    })

    try {
      // Send email notification for deletion
      await handleProxyEmail({
        type: "DELETE_APPROVED",
        fromFaculty: deletedProxySlot?.slot?.faculty?.user
          ? {
              name: deletedProxySlot?.slot?.faculty?.user?.name,
              email: deletedProxySlot?.slot?.faculty?.user?.email
            }
          : undefined,
        toLecturer: deletedProxySlot?.lecturer?.user
          ? {
              name: deletedProxySlot?.lecturer?.user?.name,
              email: deletedProxySlot?.lecturer?.user?.email
            }
          : undefined,
        slot: {
          startTime: deletedProxySlot?.slot?.startTime,
          endTime: deletedProxySlot?.slot?.endTime,
          title: deletedProxySlot?.slot?.title,
          location: deletedProxySlot?.slot?.location,
          className: deletedProxySlot?.slot?.class?.name
        },
        date: deletedProxySlot.date
      })
    } catch (error) {
      console.error("Error while sending email for proxy slot deletion:", error)
      return NextResponse.json(
        { message: "Failed to send email" },
        { status: 500 }
      )
    }

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
