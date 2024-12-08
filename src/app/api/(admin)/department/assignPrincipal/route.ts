import prisma from "@/lib/prisma"
import { clerkClient } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const {
    principalName,
    principalEmail,
    departmentId,
    principalPhone,
    password
  } = await req.json()

  try {
    const clerkclient = await clerkClient()
    const clerkUser = await clerkclient.users.createUser({
      emailAddress: principalEmail,
      firstName: principalName,
      password,
      publicMetadata: {
        role: "principal"
      }
    })

    const principal = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        id: clerkUser.id,
        name: principalName,
        email: principalEmail,
        phone: principalPhone,
        roles: {
          connect: [{ id: 9 }, { id: 4 }]
        }
      }
    })

    if (!clerkUser || !principal) {
      throw new Error("Error while creating principal")
    }

    await prisma.department.update({
      where: {
        id: Number(departmentId)
      },
      data: {
        principalId: principal.id
      }
    })
    return NextResponse.json(
      { message: "Principal assigned to department" },
      {
        status: 200
      }
    )
  } catch (error) {
    console.log(
      `Error while assigning principal to department @api/department/assignPrincipal ${error}`
    )
    return NextResponse.json(
      { message: "Error while assigning principal to department" },
      {
        status: 500
      }
    )
  }
}
