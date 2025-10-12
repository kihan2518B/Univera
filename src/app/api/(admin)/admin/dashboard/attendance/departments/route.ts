// app/api/dashboard/attendance/departments/route.ts
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

/**
 * Algorithm:
 * - Fetch departments for the university (optional universityId).
 * - For each department, fetch attendance records within the timeframe.
 * - Each attendance record has `attendance` JSON: map rollNo => status.
 * - We interpret 'present' values as: true, "present", "p", "P", "1", "yes", "Y"
 * - For each record: presentCount / totalCount => recordPercentage
 * - Department average = mean of recordPercentages
 */

function isPresentValue(v: any) {
  if (v === true) return true
  if (v === 1) return true
  if (typeof v === "string") {
    const s = v.trim().toLowerCase()
    return [
      "p",
      "present",
      "present.",
      "1",
      "yes",
      "y",
      "true",
      "att"
    ].includes(s)
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
    const daysParam = url.searchParams.get("days") // e.g., 30
    const days = daysParam ? Math.max(1, Number(daysParam)) : 30

    const since = new Date()
    since.setDate(since.getDate() - days)

    // fetch departments for uni (or all)
    const deptWhere: any = uniId ? { universityId: Number(uniId) } : {}
    const departments = await prisma.department.findMany({
      where: deptWhere,
      select: { id: true, name: true }
    })

    // For performance, fetch attendance records grouped by department in one query
    // We'll fetch attendance records for these departments for the timeframe
    const deptIds = departments.map((d) => d.id)

    const attendanceRecords = await prisma.attendanceRecord.findMany({
      where: {
        departmentId: { in: deptIds },
        createdAt: { gte: since }
      },
      select: {
        id: true,
        departmentId: true,
        attendance: true // JSON
      }
    })

    // build map: deptId -> array of percentages
    const deptMap = new Map<number, number[]>()
    for (const rec of attendanceRecords) {
      const att = rec.attendance as Record<string, any> | any
      if (!att || typeof att !== "object") continue

      const keys = Object.keys(att)
      if (keys.length === 0) continue
      let present = 0
      for (const k of keys) {
        const v = att[k]
        if (isPresentValue(v)) present++
      }
      const percent = (present / keys.length) * 100
      if (!deptMap.has(rec.departmentId))
        deptMap.set(rec.departmentId, [percent])
      else deptMap.get(rec.departmentId)!.push(percent)
    }

    // compute averages
    const result = departments.map((d) => {
      const arr = deptMap.get(d.id) ?? []
      const avg =
        arr.length === 0 ? 0 : arr.reduce((s, n) => s + n, 0) / arr.length
      return {
        departmentId: d.id,
        departmentName: d.name,
        avgAttendance: Number(avg.toFixed(2))
      }
    })

    // Sort descending by avgAttendance
    result.sort((a, b) => b.avgAttendance - a.avgAttendance)

    return NextResponse.json({ departments: result, days })
  } catch (err) {
    console.error("GET /api/dashboard/attendance/departments error", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
