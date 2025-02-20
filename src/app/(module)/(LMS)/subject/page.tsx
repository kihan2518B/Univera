"use client"

import React, { useContext, useState } from "react"
import { UserContext } from "@/context/user"
import axios from "axios"

import { CourseCard } from "../_components/CourseCard"
import { ClassesCardSkeleton } from "@/components/(commnon)/Skeleton"
import { Input } from "@/components/ui/input"

import { useQuery } from "@tanstack/react-query"
import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
import { RotateCcw } from "lucide-react"

const fetchCourses = async (departmentId: string, userId: string) => {
  const { data } = await axios.get(`/api/courses`, {
    params: { departmentId, userId }
  })
  return data?.courses || []
}

const SubjectPage = () => {
  const { user } = useContext(UserContext)
  const [filter, setFilter] = useState("")

  const {
    data: courses = [], // Default to an empty array to avoid errors
    error,
    refetch,
    isLoading
  } = useQuery({
    queryKey: ["courses", user?.Department?.id, user?.id],
    queryFn: () =>
      fetchCourses(String(user?.departmentId) || "", user?.id || ""),
    enabled: !!user?.Department?.id && !!user?.id
  })
  const filteredCourses = courses.filter((course: any) =>
    course.name.toLowerCase().includes(filter.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 ml-2">
        {[...Array(5)].map((_, i) => (
          <ClassesCardSkeleton key={i} />
        ))}
      </div>
    )
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
    <div className="p-6">
      <h1 className="text-2xl font-bold">Courses</h1>
      <h2 className="text-sm text-gray-500 font-bold mb-4">
        Add subject to your course
      </h2>
      <div className="flex items-center py-4 justify-between mb-4">
        <Input
          placeholder="Filter courses..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.map((course: any) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
      {/* Optional "Load More" section */}
      {filteredCourses.length === 0 && (
        <div className="text-center text-gray-500 mt-4">
          No courses found. Try a different filter.
        </div>
      )}
    </div>
  )
}

export default SubjectPage
