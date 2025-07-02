"use client"

import React, { useContext } from "react"
import axios from "axios"
import { useParams } from "next/navigation"
import { UserContext } from "@/context/user"
import { CourseDetials } from "../../_components/courseDetails"
import { useQuery } from "@tanstack/react-query"
import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
import { RotateCcw } from "lucide-react"
import "react-loading-skeleton/dist/skeleton.css" // Import default styles
import { CourseFormSkeleton } from "@/components/(commnon)/Skeleton"

const fetchCourse = async (courseId: string | undefined) => {
  const res = await axios.get(`/api/courses/${courseId}?courseId=${courseId}`)
  if (res.status !== 200) {
    throw new Error("Error while getting course details")
  }
  return res.data.course
}

const CourseDetailsPage = () => {
  const { user } = useContext(UserContext)
  const { courseId } = useParams()
  const roles = user?.roles?.map((role: any) => role.id) || []
  const isUpdateAllowed = roles?.includes(2) || roles?.includes(3)

  const {
    data: defaults,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => fetchCourse(courseId as string),
    enabled: !!courseId
  })

  if (error) {
    return (
      <div className="text-red-500">
        <p>Failed to load courses. Please try again later.</p>
        <p className="text-sm text-gray-500">
          {error?.message || "An unexpected error occurred."}
        </p>
        <ButtonV1 icon={RotateCcw} label="Retry" onClick={() => refetch()} />
      </div>
    )
  }
  if (isLoading)
    return (
      <div className="h-full w-full">
        <CourseFormSkeleton />
      </div>
    )

  return (
    <CourseDetials
      courseId={courseId}
      user={user}
      defaults={defaults}
      isUpdateAllowed={isUpdateAllowed}
    />
  )
}

export default CourseDetailsPage
