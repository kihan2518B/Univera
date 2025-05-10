"use client"

import { useContext } from "react"
import { UserContext } from "@/context/user"
import Student from "../_components/Quiz_Student"
import Faculty from "../_components/Quiz_Faculty"

export default function Page() {
  const { user } = useContext(UserContext)
  const roles = user?.roles.map((r) => r.id)
  if (roles?.includes(7)) {
    return <Student />
  } else if (roles?.includes(4)) {
    return <Faculty />
  }
}
