"use client"

import React, { useContext, Suspense, useEffect, useState } from "react"
import { UserContext } from "@/context/user"
import { useQuery } from "@tanstack/react-query"
import { fetchCourses } from "../_helper"
import { ClassesCardSkeleton } from "@/components/(commnon)/Skeleton"
import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
import { RotateCcw, PlusCircle } from "lucide-react"
import { Courcecard_c } from "../_components/Courcecard_c"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const CoursesGrid = () => {
  const { user } = useContext(UserContext)
  const [filter, setFilter] = useState("")
  const [roles, setRoles] = useState<number[]>([])
  const {
    data: courses,
    error,
    refetch,
    isLoading
  } = useQuery({
    queryKey: ["courses", user?.departmentId, user?.id],
    queryFn: () => fetchCourses(String(user?.departmentId), user?.id as string),
    enabled: !!user?.Department?.id && !!user?.id
  })
  useEffect(() => {
    setRoles(user?.roles.map((role: any) => role.id) ?? [])
  }, [user?.roles])

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
          {error?.message || "An unexpected error occurred."}
        </p>
        <ButtonV1 icon={RotateCcw} label="Retry" onClick={() => refetch()} />
      </div>
    )
  }

  const filteredCourses =
    courses?.filter((course: any) =>
      course.name.toLowerCase().includes(filter.toLowerCase())
    ) || []

  return (
    <div>
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="Filter courses..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        {roles && roles.includes(3) && (
          <Link href="/courses/create">
            <Button variant="default">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Course
            </Button>
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.map((course: any) => (
          <Courcecard_c key={course.id} course={course} />
        ))}
      </div>
      {filteredCourses.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">No courses found.</p>
        </div>
      )}
    </div>
  )
}

const CoursesPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Courses</h1>
      <Suspense
        fallback={
          <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 ml-2">
            {[...Array(5)].map((_, i) => (
              <ClassesCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <CoursesGrid />
      </Suspense>
    </div>
  )
}

export default CoursesPage
