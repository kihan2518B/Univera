import prisma from "@/lib/prisma"
import { clerkClient } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { adminName, adminEmail, departmentId, adminPhone, password } =
    await req.json()

  try {
    const clerkclient = await clerkClient()
    const clerkUser = await clerkclient.users.createUser({
      emailAddress: adminEmail,
      firstName: adminName,
      password,
      publicMetadata: {
        role: "department_admin"
      }
    })

    const admin = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        id: clerkUser.id,
        name: adminName,
        email: adminEmail,
        phone: adminPhone,
        roles: {
          connect: [{ id: 3 }]
        }
      }
    })

    if (!clerkUser || !admin) {
      throw new Error("Error while creating admin")
    }

    await prisma.department.update({
      where: {
        id: Number(departmentId)
      },
      data: {
        adminId: admin.id
      }
    })
    return NextResponse.json(
      { message: "Admin assigned to department" },
      {
        status: 200
      }
    )
  } catch (error) {
    console.log(
      `Error while assigning admin to department @api/department/assignAdmin ${error}`
    )
    return NextResponse.json(
      { message: "Error while assigning admin to department" },
      {
        status: 500
      }
    )
  }
}
