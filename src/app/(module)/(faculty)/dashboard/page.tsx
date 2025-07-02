"use client"
import React, { useContext } from "react"
import { UserContext } from "@/context/user"
import { DashboardSkeleton } from "@/components/(commnon)/Skeleton"
import Dashboard from "./_components/Dashboard"

const App = () => {
  const { user } = useContext(UserContext)
  const userRoles = user?.roles?.map((role: any) => role.id) || []
  const isStudent = userRoles.includes(7)

  if (!user) return <DashboardSkeleton />

  return <Dashboard user={user} isStudent={isStudent} />
}

export default App
