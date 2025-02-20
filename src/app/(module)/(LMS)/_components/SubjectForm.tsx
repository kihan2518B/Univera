"use client"
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react"
import { useState } from "react"
import axios from "axios"
import { Department } from "@prisma/client"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { Subject } from "@prisma/client"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css" // Import default styles

interface SubjectFormProps {
  courseName: string | null | undefined
  courseId: number | null
  departmentName: string
  department: Department | null | undefined
  subject?: Subject
  submitBtnId?: string
  submitBtnLabel?: string
}

export function SubjectForm({
  courseName,
  departmentName,
  courseId,
  department,
  subject,
  submitBtnId,
  submitBtnLabel
}: SubjectFormProps) {
  const [subjectName, setSubjectName] = useState<string>(subject?.name ?? "")
  const [subjectCode, setSubjectCode] = useState<string>(subject?.code ?? "")
  const [credits, setCredits] = useState<number>(subject?.credits ?? 0)
  const [semester, setSemester] = useState<number>(subject?.semester ?? 0)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const buttonId = (e.nativeEvent as SubmitEvent).submitter?.id

    if (buttonId == "submit") {
      try {
        const createFormData = {
          courseId,
          name: subjectName,
          code: subjectCode,
          department: department,
          credits: Number(credits),
          semester: Number(semester)
        }
        const res = await axios.post(`/api/subjects`, createFormData)
        if (res.status === 201) {
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
    } else if (buttonId == "subject-update") {
      try {
        const updatedSubject = {
          name: subjectName,
          code: subjectCode,
          credits: Number(credits),
          semester: Number(semester)
        }
        const res = await axios.patch(
          `/api/subjects/${subject?.id}?subjectId=${subject?.id}`,
          { updatedSubject }
        )
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
  }

  return (
    <form className="mt-8 max-w-2xl" onSubmit={handleSubmit}>
      <div
        className="grid items-start gap-2"
        // style={{ gridTemplateColumns: '.3fr .7fr' }}
      >
        <div className="grow">
          <label className="text-sm">Department Name</label>
          <input
            disabled
            value={departmentName}
            className="placeholder-transparent h-10 w-full bg-gray-200 rounded-lg border-gray-300 text-gray-900 p-1 mb-4"
            type="text"
          />
          {/* {courseName ? (
            <Skeleton height={40} width="60%" />
          ) : ( */}
          <>
            <label className="text-sm">Course Name</label>
            <input
              disabled
              value={courseName ?? "fetching course.."}
              className="placeholder-transparent h-10 w-full bg-gray-200 rounded-lg border-gray-300 text-gray-900 p-1 mb-4"
              type="text"
            />
          </>
          {/* )} */}

          <label className="text-sm">Subject name</label>
          <input
            value={subjectName}
            className="placeholder-transparent h-10 w-full bg-gray-200 rounded-lg border-gray-300 text-gray-900 p-1 mb-4"
            type="text"
            onChange={(e) => {
              setSubjectName(e.target.value)
            }}
          />

          <label className="text-sm">Subject Code</label>
          <input
            value={subjectCode}
            className="placeholder-transparent h-10 w-full bg-gray-200 rounded-lg border-gray-300 text-gray-900 p-1 mb-4"
            type="text"
            onChange={(e) => {
              setSubjectCode(e.target.value)
            }}
          />

          <label className="text-sm">credits</label>
          <input
            value={credits}
            className="placeholder-transparent h-10 w-full bg-gray-200 rounded-lg border-gray-300 text-gray-900 p-1 mb-4"
            type="number"
            onChange={(e) => {
              setCredits(Number(e.target.value))
            }}
          />

          <label className="text-sm">semester</label>
          <input
            value={semester}
            className="placeholder-transparent h-10 w-full bg-gray-200 rounded-lg border-gray-300 text-gray-900 p-1 mb-4"
            type="number"
            onChange={(e) => {
              setSemester(Number(e.target.value))
            }}
          />
          <br />

          <button
            id={submitBtnId ?? "submit"}
            type="submit"
            className="bg-Primary text-white w-full mt-4 hover:bg-blue-500 rounded-lg px-4 py-2"
          >
            {submitBtnLabel}
          </button>
        </div>
      </div>
    </form>
  )
}
