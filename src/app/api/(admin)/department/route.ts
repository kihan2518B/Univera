import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const universityId = searchParams.get("universityId") as string

    const departments = await prisma.department.findMany({
      where: {
        universityId: Number(universityId)
      }
    })
    if (0 == departments.length) {
      return NextResponse.json(
        { message: "No department found" },
        {
          status: 404
        }
      )
    }
    return NextResponse.json(
      { message: "Departments found", departments },
      {
        status: 200
      }
    )
  } catch (error) {
    console.log(`Error while getting departments @api/department ${error}`)
    return NextResponse.json(
      { message: "Error while getting departments" },
      {
        status: 500
      }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    const role = user?.publicMetadata.role

    const { universityId, name, code } = await req.json()

    if (role !== "university_admin" && role !== "super_user") {
      return NextResponse.json(
        { message: "You are not allowed to create a department" },
        {
          status: 401
        }
      )
    }

    if (!universityId || !name || !code) {
      return NextResponse.json(
        { message: "Please fill all the fields" },
        {
          status: 400
        }
      )
    }

    const newDepartment = await prisma.department.create({
      data: {
        name,
        code,
        universityId: Number(universityId)
      }
    })
    if (!newDepartment) {
      throw new Error("Error while creating Department")
    }
    return NextResponse.json(
      { message: "Department created", Department: newDepartment },
      {
        status: 201
      }
    )
  } catch (error) {
    console.log(`Error while creating Department @api/department ${error}`)
    return NextResponse.json(
      { message: "Error while creating Department" },
      {
        status: 500
      }
    )
  }
}
