"use client"

import { useParams } from "next/navigation"
import ClassTimeTable from "../_components/ClassTimeTable"

export default function ClassTimeTablePage() {
  const { classId } = useParams()
  const classIdStr = Array.isArray(classId) ? classId[0] : (classId ?? "")
  return (
    <ClassTimeTable
      classId={classIdStr}
      backButtonUrl={`/classes/my-class/${classIdStr}`}
    />
  )
}
