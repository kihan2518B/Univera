"use client"

import React, { useContext } from "react"
import { DepartmentAttendanceSection } from "../_components/department_admin_dashboard/attendance-section"
import { UserContext } from "@/context/user"
import {
  useDepartmentAnnouncements,
  useDepartmentOverview
} from "./_hooks/useDepartment"
import AnnouncementsList from "../_components/AnnouncementsList"
import { SkeletonAnnouncement } from "@/components/(commnon)/Skeleton"
import { Loader2, Users, BookOpen, GraduationCap, UserCog } from "lucide-react"

export default function DepartmentDashboard() {
  const { user } = useContext(UserContext)
  const deptId = user?.departmentId

  const { data: announcements, isLoading: isAnnouncementsLoading } =
    useDepartmentAnnouncements(String(deptId))

  const { data: DepartmentOverview, isLoading: isDepartmentOverviewLoading } =
    useDepartmentOverview(String(deptId))

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
        Department Dashboard –{" "}
        <span className="text-Dark">{user?.Department?.name}</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side (Overview + Attendance) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Department Overview */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              Department Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {isDepartmentOverviewLoading ? (
                <div className="col-span-full flex items-center justify-center p-10 bg-lamaPurple/10 rounded-xl shadow-inner">
                  <Loader2 className="animate-spin text-lamaPurple" size={40} />
                </div>
              ) : (
                <>
                  <DashboardCard
                    title="Students"
                    value={DepartmentOverview.totalStudents}
                    icon={<Users className="w-6 h-6" />}
                    color="bg-ColorTwo"
                    textColor="text-lamaSkyLight"
                  />
                  <DashboardCard
                    title="Faculties"
                    value={DepartmentOverview.totalTeachers}
                    icon={<UserCog className="w-6 h-6" />}
                    color="bg-lamaSky"
                    textColor="text-Dark"
                  />
                  <DashboardCard
                    title="Classes"
                    value={DepartmentOverview.totalClasses}
                    icon={<BookOpen className="w-6 h-6" />}
                    color="bg-lamaYellow"
                    textColor="text-Dark"
                  />
                  <DashboardCard
                    title="Courses"
                    value={DepartmentOverview.totalCourses}
                    icon={<GraduationCap className="w-6 h-6" />}
                    color="bg-ColorOne"
                    textColor="text-lamaSkyLight"
                  />
                </>
              )}
            </div>
          </section>

          {/* Attendance Insights */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              Attendance Insights
            </h2>
            <DepartmentAttendanceSection deptId={String(deptId)} />
          </section>
        </div>

        {/* Right side (Announcements) */}
        <aside className="lg:col-span-1 lg:sticky lg:top-24 space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            Announcements
          </h2>
          {isAnnouncementsLoading ? (
            <div className="grid gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonAnnouncement key={i} />
              ))}
            </div>
          ) : (
            <AnnouncementsList announcements={announcements} />
          )}
        </aside>
      </div>
    </div>
  )
}

interface DashboardCardProps {
  title: string
  value: number | undefined
  icon?: React.ReactNode
  color: string
  textColor?: string
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  color,
  textColor = "text-Dark"
}) => {
  return (
    <div
      className={`${color} rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 
      transform transition-all hover:scale-105 hover:shadow-xl flex flex-col gap-3`}
    >
      <div className={`flex items-center gap-3 ${textColor}`}>
        {icon && <div className="p-2 bg-white/20 rounded-lg">{icon}</div>}
        <div className="text-sm font-medium">{title}</div>
      </div>
      <div className={`text-3xl md:text-4xl font-extrabold ${textColor}`}>
        {value?.toLocaleString() ?? 0}
      </div>
    </div>
  )
}
