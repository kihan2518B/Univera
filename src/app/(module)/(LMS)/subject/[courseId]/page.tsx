"use client"

import Link from "next/link"
import { useState, useEffect, useContext } from "react"
import { useParams } from "next/navigation"
import { Subject } from "@prisma/client"
import axios from "axios"
import Right from "@/components/Icons/Right"
import Left from "@/components/Icons/Left"
import { UserContext } from "@/context/user"
import { useQuery } from "@tanstack/react-query"
import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
import { RotateCcw } from "lucide-react"
import { CoursesSkeleton } from "@/components/(commnon)/Skeleton"

async function fetchSubjects(courseId: string) {
  const response = await axios.get(`/api/subjects?courseId=${courseId}`)
  return response.data.subjects
}

export default function SubjectsPage() {
  const { courseId } = useParams()
  const { user } = useContext(UserContext)
  const [roles, setRoles] = useState<number[]>([])

  useEffect(() => {
    setRoles(user?.roles.map((role: any) => role.id) ?? [])
  }, [user?.roles])

  const {
    data: subjects,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["subjects", courseId],
    queryFn: () => fetchSubjects(courseId as string),
    enabled: !!courseId
  })

  if (isLoading) {
    return <CoursesSkeleton />
  }

  if (error) {
    return (
      <div className="text-red-500">
        <p>Failed to load courses. Please try again later.</p>
        <p className="text-sm text-gray-500">
          {(error as Error)?.message || "An unexpected error occurred."}
        </p>
        <ButtonV1 icon={RotateCcw} label="Retry" onClick={() => refetch()} />
      </div>
    )
  }

  return (
    <section className="mt-8 max-w-5xl mx-auto px-4">
      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <Link
          className="flex items-center justify-center gap-2 border-2 border-black text-black font-semibold rounded-lg px-6 py-2 transition-transform transform hover:scale-105 hover:bg-gray-100"
          href={"/subject"}
        >
          <Left /> Back
        </Link>
        {roles && roles.includes(3) && (
          <Link
            className="flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg px-6 py-2 transition-transform transform hover:scale-105 hover:bg-blue-100"
            href={`/subject/${courseId}/new`}
          >
            Create New Subject <Right />
          </Link>
        )}
      </div>

      {/* Subject Cards */}
      <div className="flex flex-col items-center text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-700 uppercase">Subjects</h1>
        <p className="text-gray-500 mt-2 ">
          Select a subject below to edit its details.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {subjects?.length > 0 ? (
          subjects.map((subject: Subject) => (
            <Link
              key={subject.id}
              href={`/subject/${courseId}/edit/${subject.id}`}
              className="group  bg-gradient-to-tr from-gray-100 to-gray-200 hover:from-Secondary hover:to-Secondary/50 rounded-lg shadow-md p-6 transition-transform transform hover:scale-105"
            >
              <div className="relative">
                {/* Optional Placeholder for Image */}
                {/* <div className="h-36 w-full bg-gray-200 rounded-md mb-4 flex items-center justify-center text-gray-500">
                  Subject Image Placeholder
                </div> */}
              </div>
              <div className="text-left">
                <h2 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 mb-2">
                  {subject.name}
                </h2>
                <p className="text-sm text-gray-600">
                  <strong>Code:</strong> {subject.code}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Credits:</strong> {subject.credits}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Semester:</strong> {subject.semester}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No subjects found.</p>
          </div>
        )}
      </div>
    </section>
  )
}
