"use client"

import Link from "next/link"
import toast from "react-hot-toast"
import { SubjectForm } from "../../../_components/SubjectForm"
import { UserContext } from "@/context/user"
import { useContext, useEffect, useState } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import { Course } from "@prisma/client"
import Left from "@/components/Icons/Left"

export default function NewSubjectPage() {
  const { user } = useContext(UserContext)
  const { courseId } = useParams()
  const [course, setCourse] = useState<Course | null>(null)

  async function fetchCourse() {
    try {
      const res = await axios.get(
        `/api/courses/${courseId}?courseId=${courseId}`
      )
      console.log("res: ", res)
      setCourse(res.data.course)
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong while fetching course details.")
    }
  }

  useEffect(() => {
    if (courseId) {
      fetchCourse()
    }
  }, [courseId])

  return (
    <section className="mt-8 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Navigation Button */}
      <div className="mb-6">
        <Link
          className="flex items-center gap-2 border border-gray-300 bg-white text-gray-700 font-semibold rounded-lg px-4 py-2 hover:bg-gray-100 hover:shadow transition duration-200"
          href={`/subject/${courseId}`}
        >
          <Left />
          Show All Subjects
        </Link>
      </div>

      {/* Form Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Create a New Subject
        </h2>
        <SubjectForm
          courseId={Number(courseId)}
          department={user?.departmentAdmin}
          courseName={course?.name}
          departmentName={user?.departmentAdmin.name}
          submitBtnId="submit"
          submitBtnLabel={"Create"}
        />
      </div>
    </section>
  )
}
