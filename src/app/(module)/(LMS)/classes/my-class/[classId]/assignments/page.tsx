/* eslint-disable */
"use client"

import { UserContext } from "@/context/user"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import React, { useContext } from "react"
import axios from "axios"
import {
  ArrowLeft,
  RotateCcw,
  BookOpen,
  GraduationCap,
  Users,
  Sparkles,
  ChevronRight
} from "lucide-react"
import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
import { Subject } from "@prisma/client"
import Link from "next/link"
import { Assignments_Subject_Skeleton } from "@/components/(commnon)/Skeleton"

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
  const roles = user?.roles?.map((role: any) => role.id) || []

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <RotateCcw className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Unable to Load Assignments
          </h2>
          <p className="text-red-600 mb-2">
            Failed to load class data. Please try again.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            {ClassError?.message || "An unexpected error occurred."}
          </p>
          <ButtonV1
            icon={RotateCcw}
            label="Retry"
            onClick={() => refetch()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors"
          />
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <Assignments_Subject_Skeleton />
      </div>
    )
  }

  let filteredSubjects: Subject[] = []

  // in this check the user role and if it's faculty then show only the subjects that are not in mySubjects
  if (roles && roles.includes(4)) {
    // Filter subjects that are not in mySubjects
    filteredSubjects =
      subjects?.courseSubjects.filter(
        (subject: Subject) =>
          !subjects.mySubjects.some(
            (mySubject: Subject) => mySubject.id === subject.id
          )
      ) || []
  } else if (roles && roles.includes(7)) {
    // If the user is a student, show all subjects
    filteredSubjects = subjects?.courseSubjects || []
  }

  const mySubjectsCount = subjects?.mySubjects?.length || 0
  const otherSubjectsCount = filteredSubjects?.length || 0
  const isStudent = roles.includes(7)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          {/* Breadcrumb */}
          <Link
            href={`/classes/my-class/${classId}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-6 group transition-colors duration-200"
          >
            <ArrowLeft
              size={18}
              className="mr-2 group-hover:-translate-x-1 transition-transform duration-200"
            />
            Back to Class Dashboard
          </Link>

          {/* Page Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Class Assignments
                </h1>
                <p className="text-gray-600 mt-1">
                  {isStudent
                    ? "View and submit your assignments by subject"
                    : "Manage assignments across different subjects"}
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="hidden lg:flex space-x-4">
              {!isStudent && mySubjectsCount > 0 && (
                <div className="bg-blue-50 rounded-xl p-4 text-center min-w-[100px]">
                  <div className="text-2xl font-bold text-blue-600">
                    {mySubjectsCount}
                  </div>
                  <div className="text-sm text-blue-800">My Subjects</div>
                </div>
              )}
              <div className="bg-green-50 rounded-xl p-4 text-center min-w-[100px]">
                <div className="text-2xl font-bold text-green-600">
                  {otherSubjectsCount}
                </div>
                <div className="text-sm text-green-800">
                  {isStudent ? "Total" : "Available"} Subjects
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* My Subjects Section - Only for Faculty */}
        {!roles.includes(7) && user && mySubjectsCount > 0 && (
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Section Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      My Subjects
                    </h2>
                    <p className="text-blue-100">
                      Subjects you're currently teaching
                    </p>
                  </div>
                  <div className="ml-auto">
                    <Sparkles className="w-6 h-6 text-white/60 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Subjects Grid */}
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {subjects &&
                    subjects.mySubjects.map(
                      (subject: Subject, index: number) => {
                        const gradients = [
                          "from-blue-500 to-blue-600",
                          "from-purple-500 to-purple-600",
                          "from-green-500 to-green-600",
                          "from-orange-500 to-orange-600",
                          "from-pink-500 to-pink-600",
                          "from-indigo-500 to-indigo-600",
                          "from-teal-500 to-teal-600",
                          "from-red-500 to-red-600"
                        ]
                        const gradientClass =
                          gradients[index % gradients.length]

                        return (
                          <Link
                            key={subject.id}
                            href={`/classes/my-class/${classId}/assignments/${subject.id}`}
                            className="group"
                          >
                            <div className="relative">
                              {/* Hover glow effect */}
                              <div
                                className={`absolute -inset-0.5 bg-gradient-to-r ${gradientClass} rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-500`}
                              ></div>

                              {/* Subject Card */}
                              <div className="relative bg-white rounded-2xl border border-gray-100 shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2 overflow-hidden">
                                {/* Header with gradient */}
                                <div
                                  className={`h-24 bg-gradient-to-r ${gradientClass} relative overflow-hidden`}
                                >
                                  <div className="absolute inset-0 bg-black/10"></div>
                                  <div className="absolute top-3 right-3 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                                    <ChevronRight className="w-6 h-6 text-white" />
                                  </div>
                                  {/* Decorative elements */}
                                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full"></div>
                                  <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-white/10 rounded-full"></div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                  <div className="flex items-start space-x-3">
                                    {/* Subject Icon */}
                                    <div
                                      className={`w-12 h-12 rounded-xl bg-gradient-to-r ${gradientClass} flex items-center justify-center shadow-lg flex-shrink-0`}
                                    >
                                      <BookOpen className="w-6 h-6 text-white" />
                                    </div>

                                    {/* Subject Info */}
                                    <div className="flex-1 min-w-0">
                                      <h3 className="font-bold text-lg text-gray-800 group-hover:text-gray-900 transition-colors duration-300 line-clamp-2">
                                        {subject.name}
                                      </h3>
                                      <p className="text-sm text-gray-500 mt-1">
                                        Subject Code: {subject.code || "N/A"}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Footer */}
                                  <div className="mt-6 flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                      <span className="text-xs text-gray-500">
                                        Active
                                      </span>
                                    </div>
                                    <div className="text-xs text-gray-400">
                                      View Assignments →
                                    </div>
                                  </div>
                                </div>

                                {/* Bottom accent line */}
                                <div
                                  className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradientClass} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
                                ></div>
                              </div>
                            </div>
                          </Link>
                        )
                      }
                    )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All/Other Subjects Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Section Header */}
          <div
            className={`bg-gradient-to-r ${isStudent ? "from-green-500 to-teal-600" : "from-orange-500 to-red-600"} p-6`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {roles.includes(7) ? "All Subjects" : "Other Subjects"}
                </h2>
                <p
                  className={`${isStudent ? "text-green-100" : "text-orange-100"}`}
                >
                  {isStudent
                    ? "Access assignments from all your enrolled subjects"
                    : "Browse assignments from subjects taught by other faculty"}
                </p>
              </div>
            </div>
          </div>

          {/* Subjects Grid */}
          <div className="p-6">
            {filteredSubjects && filteredSubjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredSubjects.map((subject: Subject, index: number) => {
                  const gradients = [
                    "from-emerald-500 to-teal-600",
                    "from-cyan-500 to-blue-600",
                    "from-violet-500 to-purple-600",
                    "from-rose-500 to-pink-600",
                    "from-amber-500 to-orange-600",
                    "from-lime-500 to-green-600",
                    "from-sky-500 to-indigo-600",
                    "from-fuchsia-500 to-purple-600"
                  ]
                  const gradientClass = gradients[index % gradients.length]

                  return (
                    <Link
                      key={subject.id}
                      href={`/classes/my-class/${classId}/assignments/${subject.id}`}
                      className="group"
                    >
                      <div className="relative">
                        {/* Hover glow effect */}
                        <div
                          className={`absolute -inset-0.5 bg-gradient-to-r ${gradientClass} rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-500`}
                        ></div>

                        {/* Subject Card */}
                        <div className="relative bg-white rounded-2xl border border-gray-100 shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2 overflow-hidden">
                          {/* Header with gradient */}
                          <div
                            className={`h-24 bg-gradient-to-r ${gradientClass} relative overflow-hidden`}
                          >
                            <div className="absolute inset-0 bg-black/10"></div>
                            <div className="absolute top-3 right-3 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                              <ChevronRight className="w-6 h-6 text-white" />
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full"></div>
                            <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-white/10 rounded-full"></div>
                          </div>

                          {/* Content */}
                          <div className="p-6">
                            <div className="flex items-start space-x-3">
                              {/* Subject Icon */}
                              <div
                                className={`w-12 h-12 rounded-xl bg-gradient-to-r ${gradientClass} flex items-center justify-center shadow-lg flex-shrink-0`}
                              >
                                <BookOpen className="w-6 h-6 text-white" />
                              </div>

                              {/* Subject Info */}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-lg text-gray-800 group-hover:text-gray-900 transition-colors duration-300 line-clamp-2">
                                  {subject.name}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                  Subject Code: {subject.code || "N/A"}
                                </p>
                              </div>
                            </div>

                            {/* Footer */}
                            <div className="mt-6 flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-xs text-gray-500">
                                  {isStudent ? "Available" : "Browse"}
                                </span>
                              </div>
                              <div className="text-xs text-gray-400">
                                {isStudent ? "View Assignments →" : "Explore →"}
                              </div>
                            </div>
                          </div>

                          {/* Bottom accent line */}
                          <div
                            className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradientClass} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
                          ></div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Subjects Available
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {isStudent
                    ? "There are no subjects with assignments available at the moment."
                    : "All available subjects are already assigned to you."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Stats - Only visible on small screens */}
        <div className="lg:hidden mt-6 grid grid-cols-2 gap-4">
          {!isStudent && mySubjectsCount > 0 && (
            <div className="bg-white rounded-xl p-4 text-center shadow-lg">
              <div className="text-2xl font-bold text-blue-600">
                {mySubjectsCount}
              </div>
              <div className="text-sm text-blue-800">My Subjects</div>
            </div>
          )}
          <div className="bg-white rounded-xl p-4 text-center shadow-lg">
            <div className="text-2xl font-bold text-green-600">
              {otherSubjectsCount}
            </div>
            <div className="text-sm text-green-800">
              {isStudent ? "Total" : "Available"} Subjects
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
