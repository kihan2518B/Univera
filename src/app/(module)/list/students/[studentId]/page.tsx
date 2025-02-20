"use client"

import Link from "next/link"
import { UserContext } from "@/context/user"
import { useContext } from "react"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import Left from "@/components/Icons/Left"
import StudentForm from "../../_components/forms/StudentForm"
import { useParams } from "next/navigation"
import { CourseFormSkeleton } from "@/components/(commnon)/Skeleton"

async function getStudentById(id: string) {
  const { data } = await axios.get(`/api/list/student/${id}`)
  return data.student
}

export default function EditStudentPage() {
  const { user } = useContext(UserContext)
  const { studentId } = useParams()

  const { data, refetch, isLoading, isError } = useQuery({
    queryKey: ["student", user],
    queryFn: () => getStudentById(studentId as string),
    enabled: !!user
  })
  return (
    <section className="mt-8 max-w-lg mx-auto flex flex-col">
      <div className="mt-8 flex">
        <Link
          className="flex justify-center gap-2 border-2 w-full border-black font-semibold rounded-lg px-6 py-2"
          href={"/list/students"}
        >
          Back
          <Left />
        </Link>
      </div>
      <div className="h-full w-full flex flex-col items-center justify-center">
        <h1 className="text-xl text-gray-500 font-bold uppercase mt-8">
          Edit Student:
        </h1>
        <div className="h-full w-full flex flex-col gap-2">
          {isLoading ? (
            <CourseFormSkeleton />
          ) : (
            <StudentForm
              isLoading={isLoading}
              isError={isError}
              refetch={refetch}
              student={data}
              submitBtnId="student-update"
              submitBtnLabel="Update Student"
              departmentId={Number(user?.departmentId)}
              courseId={Number(user?.courseId)}
              universityId={Number(user?.universityId)}
              isEditable={true}
            />
          )}
        </div>
      </div>
    </section>
  )
}
