import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { subMonths, startOfMonth, endOfMonth } from "date-fns"

export async function GET(req: Request, context: any) {
  try {
    const { deptId } = await context.params
    const departmentId = parseInt(deptId, 10)

    const trend: { month: string; attendance: number }[] = []

    // Last 6 months
    for (let i = 5; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(new Date(), i))
      const monthEnd = endOfMonth(subMonths(new Date(), i))

      // Fetch all attendance records for department & month
      const records = await prisma.attendanceRecord.findMany({
        where: {
          departmentId,
          createdAt: { gte: monthStart, lte: monthEnd }
        },
        select: { attendance: true }
      })

      let total = 0
      let present = 0

      for (const record of records) {
        const attObj = record.attendance as Record<string, string> // rollNo → status
        for (const status of Object.values(attObj)) {
          total++
          if (status.toLowerCase() === "present") {
            present++
          }
        }
      }

      const percentage = total > 0 ? Math.round((present / total) * 100) : 0

      trend.push({
        month: monthStart.toLocaleString("default", { month: "short" }),
        attendance: percentage
      })
    }

    return NextResponse.json({ trend })
  } catch (error) {
    console.error(
      "Error while fetching department overview @/api/(admin)/department_admin/[deptId]/overview",
      error
    )
    return NextResponse.json(
      { error: "Failed to fetch attendance data" },
      { status: 500 }
    )
  }
}
