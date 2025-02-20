"use client"
import React, { useContext, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { UserContext } from "@/context/user"
import DepartmentContainer from "../_components/DepartmentContainer"

export default function Page() {
  const { user } = useContext(UserContext)

  const [departments, setDepartments] = useState([])

  useEffect(() => {
    const fetcDepartments = async () => {
      const response = await fetch(
        `/api/department?universityId=${user?.universityId}`
      )
      if (!response.ok) {
        toast.error(`Failed to fetch: ${response.statusText}`)
      }
      const data = await response.json()
      console.log("data: ", data)
      if (data.departments.length == 0) {
        toast.error(`No departments found`)
      }
      setDepartments(data.departments)
    }
    if (user) {
      fetcDepartments()
    }
  }, [user])
  return (
    <div>
      <DepartmentContainer departments={departments} />
    </div>
  )
}
