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
import {
  RotateCcw,
  BookOpen,
  Award,
  Calendar,
  Hash,
  ChevronRight
} from "lucide-react"
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <RotateCcw className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600 mb-4">
            Failed to load subjects. Please try again later.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            {(error as Error)?.message || "An unexpected error occurred."}
          </p>
          <ButtonV1 icon={RotateCcw} label="Retry" onClick={() => refetch()} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <section className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-12">
          <Link
            className="group flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl px-6 py-3 transition-all duration-300 hover:border-gray-300 hover:shadow-lg hover:shadow-gray-200/50 hover:-translate-y-0.5"
            href={"/subject"}
          >
            <Left />
            Back
          </Link>
          {roles && roles.includes(3) && (
            <Link
              className="group flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl px-6 py-3 transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-200/50 hover:-translate-y-0.5"
              href={`/subject/${courseId}/new`}
            >
              <span>Create New Subject</span>
              <Right />
            </Link>
          )}
        </div>

        {/* Subject Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {subjects?.length > 0 ? (
            subjects.map((subject: Subject) => (
              <Link
                key={subject.id}
                href={`/subject/${courseId}/edit/${subject.id}`}
                className="group relative bg-white rounded-2xl border border-gray-200 p-6 transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/50 hover:-translate-y-1 cursor-pointer overflow-hidden"
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-indigo-50/0 group-hover:from-blue-50/80 group-hover:to-indigo-50/40 transition-all duration-300 rounded-2xl"></div>

                {/* Card content */}
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white group-hover:from-blue-600 group-hover:to-indigo-700 transition-all duration-300">
                        <BookOpen size={20} />
                      </div>
                    </div>
                    <ChevronRight
                      size={18}
                      className="text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200"
                    />
                  </div>

                  {/* Subject name */}
                  <h3 className="font-bold text-xl text-gray-900 mb-4 group-hover:text-blue-900 transition-colors duration-200 line-clamp-2">
                    {subject.name}
                  </h3>

                  {/* Subject details */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Hash size={16} className="text-gray-500" />
                      <span className="font-medium text-gray-700">Code:</span>
                      <span className="px-2 py-1 bg-gray-100 rounded-md text-gray-800 font-mono text-xs">
                        {subject.code}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Award size={16} className="text-gray-500" />
                      <span className="font-medium text-gray-700">
                        Credits:
                      </span>
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-semibold border ${
                          subject.credits >= 4
                            ? "bg-blue-100 text-blue-800 border-blue-200"
                            : "bg-green-100 text-green-800 border-green-200"
                        }`}
                      >
                        {subject.credits}{" "}
                        {subject.credits === 1 ? "Credit" : "Credits"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={16} className="text-gray-500" />
                      <span className="font-medium text-gray-700">
                        Semester:
                      </span>
                      <span className="px-2 py-1 bg-amber-50 text-amber-800 rounded-md text-xs font-medium border border-amber-200">
                        {subject.semester}
                      </span>
                    </div>
                  </div>

                  {/* Hover indicator */}
                  <div className="mt-4 pt-4 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                      <span>Click to edit</span>
                      <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full">
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No subjects found
                </h3>
                <p className="text-gray-500 mb-6">
                  There are no subjects available for this course yet.
                </p>
                {roles && roles.includes(3) && (
                  <Link
                    className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold rounded-xl px-6 py-3 transition-all duration-300 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200/50"
                    href={`/subject/${courseId}/new`}
                  >
                    Create First Subject
                    <Right className="transition-transform group-hover:translate-x-1" />
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
