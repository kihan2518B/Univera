"use client"

import { UserContext } from "@/context/user"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import React, { useContext } from "react"
import axios from "axios"
import { RotateCcw } from "lucide-react"
import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
import { Subject } from "@prisma/client"
import SubjectCard from "@/app/(module)/(LMS)/_components/SubjectCard"
import Link from "next/link"
import Left from "@/components/Icons/Left"
import { CoursesSkeleton } from "@/components/(commnon)/Skeleton"

async function fetchClassById(classId: number, courseId: number) {
  const { data } = await axios.get(
    `/api/classes/my-class/${classId}/assignments`,
    {
      params: { courseId }
    }
  )
  return data
}

export default function ClassAssignmentsPage() {
  const { user } = useContext(UserContext)
  const { classId } = useParams()

  const {
    data: subjects,
    error: ClassError,
    refetch,
    isLoading
  } = useQuery({
    queryKey: ["Assignments_Subjects"],
    queryFn: () => fetchClassById(Number(classId), Number(user?.courseId)),
    enabled: !!classId && !!user?.id
  })

  if (ClassError) {
    return (
      <div className="p-4 rounded-lg bg-red-50 text-center">
        <p className="text-red-500 mb-2">
          Failed to load class. Please try again later.
        </p>
        <p className="text-sm text-gray-500 mb-4">
          {ClassError?.message || "An unexpected error occurred."}
        </p>
        <ButtonV1 icon={RotateCcw} label="Retry" onClick={() => refetch()} />
      </div>
    )
  }

  if (isLoading) {
    return <CoursesSkeleton />
  }

  // Filter subjects that are not in mySubjects
  const filteredSubjects =
    subjects?.courseSubjects.filter(
      (subject: Subject) =>
        !subjects.mySubjects.some(
          (mySubject: Subject) => mySubject.id === subject.id
        )
    ) || []
  return (
    <div className="p-6">
      {/* Back path */}
      <Link
        className="flex items-center justify-center gap-2 border-2 border-black text-black w-[10%] font-semibold rounded-lg px-6 py-2 transition-transform transform hover:scale-105 hover:bg-gray-100"
        href={`/classes/my-class/${classId}`}
      >
        <Left /> Back
      </Link>
      {/* show all subjects */}
      <h1 className="text-center font-bold text-2xl">My Subjects</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {subjects &&
          subjects.mySubjects.map((subject: Subject) => (
            <Link
              key={subject.id}
              href={`/classes/my-class/${classId}/assignments/${subject.id}`}
            >
              <SubjectCard subject={subject} />
            </Link>
          ))}
      </div>

      <h1 className="text-center font-bold text-2xl">Other Subjects</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {filteredSubjects &&
          filteredSubjects.map((subject: Subject) => (
            <Link
              key={subject.id}
              href={`/classes/my-class/${classId}/assignments/${subject.id}`}
            >
              <SubjectCard subject={subject} />
            </Link>
          ))}
      </div>
    </div>
  )
}
