"use client"

import React, { useContext, useState } from "react"
import axios from "axios"
import { UserContext } from "@/context/user"
import { useQuery } from "@tanstack/react-query"
import { Prisma } from "@prisma/client"
import { useParams } from "next/navigation"
import { ClassStudentTable } from "../_components/ClassStudentTable"
import { AddStudentsDialog } from "../_components/AddStudent"
import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
import Left from "@/components/Icons/Left"
import Link from "next/link"
import { CoursesSkeleton } from "@/components/(commnon)/Skeleton"

export type StudentsWithRelation = Prisma.StudentGetPayload<{
  include: {
    user: true
  }
}>

const fetchStudents = async (cId: string) => {
  const res = await axios.get("/api/list/student", {
    params: {
      courseId: cId
    }
  })
  return res.data.students
}

export default function ClassStudentsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const params = useParams()
  const classId = params.classId
  const { user } = useContext(UserContext)
  console.log("user: ", user)
  const { data, isLoading, isError, error, refetch } = useQuery<
    StudentsWithRelation[]
  >({
    queryKey: ["Students"],
    queryFn: () => fetchStudents(String(user?.courseId)),
    enabled: !!user
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-lamaSkyLight to-lamaPurpleLight p-6 rounded-t-lg">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white/50 backdrop-blur-sm p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl md:text-3xl font-bold text-TextTwo">
            Class Students
          </h1>
          <div className="flex gap-3 flex-col md:flex-row">
            <Link
              className="flex items-center gap-2 border border-gray-300 bg-white text-gray-700 font-semibold rounded-lg px-4 py-2 hover:bg-gray-100 hover:shadow transition duration-200 w-fit"
              href={`/classes/my-class/${classId}`}
            >
              <Left />
              Back
            </Link>
            <ButtonV1
              onClick={() => setIsDialogOpen(true)}
              className=""
              label="Add Students"
            />
          </div>
        </div>

        {isLoading && <CoursesSkeleton />}

        {isError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 font-medium">
              Error:{" "}
              {error instanceof Error
                ? error.message
                : "Failed to fetch students"}
            </p>
          </div>
        )}

        {data && (
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-6">
            <ClassStudentTable
              students={data}
              classId={classId as string}
              onDeleteSuccess={refetch}
            />
          </div>
        )}

        {isDialogOpen && (
          <AddStudentsDialog
            students={data as StudentsWithRelation[]}
            classId={classId as string}
            onClose={() => setIsDialogOpen(false)}
            onAddSuccess={refetch}
          />
        )}
      </div>
    </div>
  )
}
