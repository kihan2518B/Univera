// app/api/dashboard/attendance/monthly/route.ts
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

function isPresentValue(v: any) {
  if (v === true) return true
  if (v === 1) return true
  if (typeof v === "string") {
    const s = v.trim().toLowerCase()
    return ["p", "present", "p.", "1", "yes", "y", "true", "att"].includes(s)
  }
  return false
}

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
    const monthsParam = url.searchParams.get("months")
    const months = monthsParam ? Math.max(1, Number(monthsParam)) : 6

    const end = new Date()
    const start = new Date()
    start.setMonth(start.getMonth() - months + 1)
    start.setDate(1)
    start.setHours(0, 0, 0, 0)

    const where: any = {
      createdAt: { gte: start, lte: end }
    }
    if (uniId) where.universityId = Number(uniId)

    const records = await prisma.attendanceRecord.findMany({
      where,
      select: { createdAt: true, attendance: true }
    })

    // bucket by YYYY-MM
    const buckets = new Map<string, number[]>()
    for (const r of records) {
      const monthKey = r.createdAt.toISOString().slice(0, 7) // 'YYYY-MM'
      const att = r.attendance as Record<string, any>
      if (!att || typeof att !== "object") continue
      const keys = Object.keys(att)
      if (keys.length === 0) continue
      let present = 0
      for (const k of keys) {
        if (isPresentValue(att[k])) present++
      }
      const percent = (present / keys.length) * 100
      if (!buckets.has(monthKey)) buckets.set(monthKey, [percent])
      else buckets.get(monthKey)!.push(percent)
    }

    // create months list from start to end consistently
    const monthsList: string[] = []
    const tmp = new Date(start)
    for (let i = 0; i < months; i++) {
      const key = tmp.toISOString().slice(0, 7)
      monthsList.push(key)
      tmp.setMonth(tmp.getMonth() + 1)
    }

    const result = monthsList.map((m) => {
      const arr = buckets.get(m) ?? []
      const avg =
        arr.length === 0 ? 0 : arr.reduce((s, n) => s + n, 0) / arr.length
      return { month: m, avgAttendance: Number(avg.toFixed(2)) }
    })

    return NextResponse.json({ trend: result })
  } catch (err) {
    console.error("GET /api/dashboard/attendance/monthly error", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
