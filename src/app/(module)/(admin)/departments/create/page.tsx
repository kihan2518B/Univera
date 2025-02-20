"use client"
import { UserContext } from "@/context/user"
import React, { useContext } from "react"
import CreateDepartment from "../../_components/CreateDepartment"

export default function Page() {
  const { user } = useContext(UserContext)
  return (
    <div className=" h-full w-full">
      <CreateDepartment universityId={Number(user?.universityId)} />
    </div>
  )
}
