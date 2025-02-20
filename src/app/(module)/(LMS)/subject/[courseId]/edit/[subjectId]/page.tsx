"use client"
/* eslint-disable @typescript-eslint/no-unused-vars */

import { SubjectForm } from "@/app/(module)/(LMS)/_components/SubjectForm"
import { UserContext } from "@/context/user"
import { Course, Subject } from "@prisma/client"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import DeleteButton from "@/components/(commnon)/DeleteButton"
import Left from "@/components/Icons/Left"

const initForm = {
  name: "",
  code: "",
  credit: 0,
  semester: 0
}

export default function EditSubjectPage() {
  const { user } = useContext(UserContext)
  const { subjectId, courseId } = useParams()
  const [course, setCourse] = useState<Course | null>(null)
  const [defaults, setDefaults] = useState<any>(initForm)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true)
      try {
        const res = await axios.get(
          `/api/courses/${courseId}?courseId=${courseId}`
        )
        if (res.status !== 200) {
          toast.error("Error while getting course details")
          return
        }
        setCourse(res.data.course)

        const subject = res.data.course.subjects.find(
          (s: Subject) => s.id == Number(subjectId)
        )
        if (subject) {
          setDefaults(subject)
        }
      } catch (error) {
        toast.error("Failed to load subject details.")
      } finally {
        setLoading(false)
      }
    }
    fetchSubjects()
  }, [subjectId, courseId])

  const handleUpdateSubject = async (updatedData: any) => {
    try {
      const res = await axios.put(`/api/subjects/${subjectId}`, updatedData)
      if (res.status === 200) {
        toast.success("Subject updated successfully!")
        router.push(`/subject/${courseId}`)
      }
    } catch (error) {
      console.error("Error updating subject:", error)
      toast.error("Something went wrong while updating the subject.")
    }
  }

  const handleDeleteClick = async () => {
    try {
      const res = await axios.delete(`/api/subjects/${subjectId}`)
      if (res.status === 200) {
        toast.success(res.data.message)
        router.push(`/subject/${courseId}`)
      } else {
        toast.error(res.data.message)
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Something went wrong")
      } else {
        toast.error("An unexpected error occurred")
      }
    }
  }

  return (
    <section className="mt-8 max-w-2xl mx-auto p-4">
      {/* Navigation */}
      <div className="flex justify-start mb-6">
        <Link
          className="flex items-center gap-2 border border-gray-300 bg-white text-gray-700 font-semibold rounded-lg px-4 py-2 hover:bg-gray-100 hover:shadow transition duration-200"
          href={`/subject/${courseId}`}
        >
          <Left />
          Show All Subjects
        </Link>
      </div>

      {/* Loading Indicator */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        course && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Editing Subject:{" "}
              <span className="text-blue-600">{defaults.name}</span>
            </h2>

            {/* Subject Form */}
            <SubjectForm
              subject={defaults}
              submitBtnId="subject-update"
              courseId={Number(courseId)}
              department={user?.Department}
              courseName={course?.name}
              departmentName={String(user?.Department?.name)}
              submitBtnLabel={"Update"}
            />

            {/* Delete Button */}
            <div className="mt-6">
              <DeleteButton
                label="Delete This Subject"
                onDelete={handleDeleteClick}
                className="bg-red-500 text-white w-full hover:bg-red-600 font-semibold rounded-lg px-4 py-2 transition duration-200"
              />
            </div>
          </div>
        )
      )}
    </section>
  )
}
