"use client"
import React, { useContext } from "react"
import UserTab from "../_components/UserTabs"
import { UserContext } from "@/context/user"
import { MonthDateRangePicker } from "../_components/MonthDateRangePicker"
import StatsCards from "../_components/StatsCards"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function LeavePage() {
  const { user } = useContext(UserContext)
  const roles = user?.roles.map((role: any) => role.id) || null
  return (
    <div>
      <div className="px-2 py-1 rounded w-fit border border-Dark">
        <Link href={"/dashboard"} className="flex items-center text-TextTwo ">
          <ArrowLeft size={18} className="mr-2" />
          Back
        </Link>
      </div>
      {roles && user && <UserTab roles={roles} />}
      <div className="flex flex-col md:flex-row py-6 items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Leave Dashboard</h2>
        <div className="flex items-center space-x-2">
          <MonthDateRangePicker />
        </div>
      </div>
      <StatsCards />
      {/* Graph */}
    </div>
  )
}
