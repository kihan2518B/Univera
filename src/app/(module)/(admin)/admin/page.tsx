"use client"
import React, { useContext } from "react"
import { Loader2 } from "lucide-react"
import {
  useCounts,
  useDepartmentAttendance,
  useMonthlyAttendance
} from "./_hooks/useAdminDashboard"
import { useAnnouncements } from "./_hooks/useAdminAnnouncements"
import DeptAttendanceChart from "../_components/charts/DeptAttendanceChart"
import MonthlyAttendanceChart from "../_components/charts/MonthlyAttendanceChart"
import AnnouncementsList from "../_components/AnnouncementsList"
import { UserContext } from "@/context/user"
import { SkeletonAnnouncement } from "@/components/(commnon)/Skeleton"

export default function AdminDashboardPage() {
  const { user } = useContext(UserContext)
  const universityId = user?.universityId as number

  const { data: counts, isLoading: loadingCounts } = useCounts(universityId)
  const { data: annResp, isLoading: loadingAnnouncements } = useAnnouncements({
    universityId
  })
  const { data: deptAttendanceResp, isLoading: loadingDeptAttendance } =
    useDepartmentAttendance(universityId, 30)
  const { data: monthlyResp, isLoading: loadingMonthly } = useMonthlyAttendance(
    universityId,
    6
  )

  const deptData = deptAttendanceResp?.departments ?? []
  const monthData = monthlyResp?.trend ?? []
  const announcements = annResp?.announcements ?? []

  return (
    <div className="p-8 space-y-10 min-h-screen text-Dark">
      <header className="flex items-center justify-between">
        <h1 className="text-4xl font-extrabold tracking-tight text-Dark">
          University Admin Dashboard
        </h1>
      </header>
      <hr className="border-t-2 border-lamaPurple" />
      {/* Top summary cards */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {loadingCounts ? (
            <div className="col-span-full flex items-center justify-center p-8 bg-lamaPurple rounded-xl shadow-lg border border-ColorTwo">
              <Loader2 className="animate-spin text-lamaSkyLight" size={48} />
            </div>
          ) : (
            <>
              <DashboardCard
                title="Students"
                value={counts?.students}
                color="bg-ColorTwo"
                textColor="text-lamaSkyLight"
              />
              <DashboardCard
                title="Faculties"
                value={counts?.faculties}
                color="bg-lamaSky"
                textColor="text-Dark"
              />
              <DashboardCard
                title="Departments"
                value={counts?.departments}
                color="bg-lamaYellow"
                textColor="text-Dark"
              />
              <DashboardCard
                title="Courses"
                value={counts?.courses}
                color="bg-ColorOne"
                textColor="text-lamaSkyLight"
              />
              <DashboardCard
                title="Classes"
                value={counts?.classes}
                color="bg-ColorThree"
                textColor="text-lamaSkyLight"
              />
              <DashboardCard
                title="Non-Teaching Staff"
                value={counts?.nonTeachingStaff}
                color="bg-ColorTwo"
                textColor="text-lamaSkyLight"
              />
            </>
          )}
        </div>
      </section>

      {/* Charts + Announcements */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Department-wise attendance bar chart */}
          <div className="bg-lamaPurpleLight rounded-xl p-6 shadow-lg border border-lamaPurple">
            <h2 className="text-2xl font-bold text-ColorTwo mb-4">
              Department-wise Attendance
            </h2>
            {loadingDeptAttendance ? (
              <div className="h-96 flex items-center justify-center">
                <Loader2 className="animate-spin text-Dark" size={48} />
              </div>
            ) : (
              <DeptAttendanceChart data={deptData} />
            )}
          </div>
          {/* Monthly trend */}
          <div className="bg-lamaPurpleLight rounded-xl p-6 shadow-lg border border-lamaPurple">
            <h2 className="text-2xl font-bold text-ColorTwo mb-4">
              Monthly Attendance Trend
            </h2>
            {loadingMonthly ? (
              <div className="h-96 flex items-center justify-center">
                <Loader2 className="animate-spin text-Dark" size={48} />
              </div>
            ) : (
              <MonthlyAttendanceChart data={monthData} />
            )}
          </div>
        </div>

        {/* Announcements */}
        <div className="space-y-6">
          <div className="bg-lamaPurpleLight rounded-xl p-6 shadow-lg border border-lamaPurple">
            <h2 className="text-2xl font-bold text-ColorTwo mb-4">
              Announcements
            </h2>
            {loadingAnnouncements ? (
              <div className="grid gap-4 grid-cols-1 overflow-visible">
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonAnnouncement key={i} />
                ))}
              </div>
            ) : (
              <AnnouncementsList announcements={announcements} />
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

interface DashboardCardProps {
  title: string
  value: number | undefined
  color: string
  textColor?: string // New prop for text color
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  color,
  textColor = "text-Dark"
}) => {
  return (
    <div
      className={`${color} rounded-xl p-6 shadow-lg border border-lamaPurple`}
    >
      <div className={`text-sm font-medium ${textColor}`}>{title}</div>
      <div className={`text-4xl font-extrabold mt-2 ${textColor}`}>
        {value?.toLocaleString() ?? 0}
      </div>
    </div>
  )
}
