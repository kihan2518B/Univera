// app/api/dashboard/announcements/route.ts
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

export async function GET(req: Request) {
  try {
    const user = await currentUser()
    const role = user?.publicMetadata.role

    //check user authorization
    if (role !== "university_admin" && role !== "super_user") {
      return NextResponse.json(
        { message: "You are not allowed to create a Course" },
        {
          status: 401
        }
      )
    }

    const url = new URL(req.url)
    const uniId = url.searchParams.get("universityId")

    const where: any = {}
    if (uniId) where.universityId = Number(uniId)

    const announcements = await prisma.announcement.findMany({
      where,
      orderBy: { date: "desc" }, // use 'date' field for announcement time
      take: 10,
      select: {
        id: true,
        title: true,
        description: true,
        date: true,
        category: true,
        announcerName: true,
        attachments: true,
        departmentId: true,
        classId: true
      }
    })

    const formatted = announcements.map((a) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      date: a.date.toISOString().split("T")[0],
      category: a.category,
      announcerName: a.announcerName,
      attachments: a.attachments,
      departmentId: a.departmentId,
      classId: a.classId
    }))

    return NextResponse.json({ announcements: formatted })
  } catch (err) {
    console.error("GET /api/dashboard/announcements error", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
