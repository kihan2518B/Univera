import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: Request, context: any) {
  try {
    const { deptId } = await context.params

    const announcements = await prisma.announcement.findMany({
      where: { departmentId: Number(deptId) },
      orderBy: { createdAt: "desc" },
      take: 10
    })

    return NextResponse.json(announcements)
  } catch (error) {
    console.error(
      "Error while fetching department overview @/api/(admin)/department_admin/[deptId]/overview",
      error
    )
    return NextResponse.json(
      { error: "Failed to fetch announcements" },
      { status: 500 }
    )
  }
}
