"use client"
import Link from "next/link"
import Left from "@/components/Icons/Left"
import StudentForm from "../../_components/forms/StudentForm"
import { useContext } from "react"
import { UserContext } from "@/context/user"

export default function SubjectsPage() {
  const { user } = useContext(UserContext)

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
          Add Student:
        </h1>
        <div className="h-full w-full flex flex-col gap-2">
          <StudentForm
            courseId={Number(user?.courseId)}
            departmentId={Number(user?.departmentId)}
            universityId={Number(user?.universityId)}
            submitBtnId="student-submit"
            submitBtnLabel="Create Student"
          />
        </div>
      </div>
    </section>
  )
}
