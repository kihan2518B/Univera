"use client"
import React from "react"
import { useState } from "react"
import axios from "axios"
import { Department } from "@prisma/client"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { Subject } from "@prisma/client"
import "react-loading-skeleton/dist/skeleton.css"
import {
  Building2,
  BookOpen,
  FileText,
  Hash,
  Award,
  Calendar,
  Save,
  Edit3,
  Sparkles
} from "lucide-react"

interface SubjectFormProps {
  courseName: string | null | undefined
  courseId: number | null
  departmentName: string
  department: Department | null | undefined
  subject?: Subject
  submitBtnId?: string
  submitBtnLabel?: string
  isAllowedUpdatation: boolean
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
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const buttonId = (e.nativeEvent as SubmitEvent).submitter?.id

    if (buttonId == "submit") {
      try {
        setIsSubmitting(true)
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
      } finally {
        setIsSubmitting(false)
      }
    } else if (buttonId == "subject-update") {
      try {
        setIsSubmitting(true)
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
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const isEditing = !!subject

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-white" />
              <h2 className="text-2xl font-semibold text-white">
                Subject Information
              </h2>
            </div>
            <p className="text-blue-100 mt-2">
              Fill in the details below to {isEditing ? "update" : "create"}{" "}
              your subject
            </p>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <form className="space-y-8" onSubmit={handleSubmit}>
              {/* Read-only Fields Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Department Name */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Building2 className="h-4 w-4 text-blue-600" />
                    Department Name
                  </label>
                  <div className="relative">
                    <input
                      disabled
                      value={departmentName}
                      className="w-full h-12 px-4 bg-gray-100 border-2 border-gray-200 rounded-xl text-gray-700 font-medium cursor-not-allowed"
                      type="text"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Course Name */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <BookOpen className="h-4 w-4 text-green-600" />
                    Course Name
                  </label>
                  <div className="relative">
                    <input
                      disabled
                      value={courseName ?? "fetching course.."}
                      className="w-full h-12 px-4 bg-gray-100 border-2 border-gray-200 rounded-xl text-gray-700 font-medium cursor-not-allowed"
                      type="text"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Editable Fields Section */}
              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Edit3 className="h-5 w-5 text-blue-600" />
                  Subject Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Subject Name */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <FileText className="h-4 w-4 text-purple-600" />
                      Subject Name
                    </label>
                    <div className="relative group">
                      <input
                        value={subjectName}
                        className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 group-hover:border-gray-300"
                        type="text"
                        placeholder="Enter subject name"
                        onChange={(e) => {
                          setSubjectName(e.target.value)
                        }}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Subject Code */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Hash className="h-4 w-4 text-orange-600" />
                      Subject Code
                    </label>
                    <div className="relative group">
                      <input
                        value={subjectCode}
                        className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 group-hover:border-gray-300"
                        type="text"
                        placeholder="Enter subject code"
                        onChange={(e) => {
                          setSubjectCode(e.target.value)
                        }}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Credits */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Award className="h-4 w-4 text-yellow-600" />
                      Credits
                    </label>
                    <div className="relative group">
                      <input
                        value={credits}
                        className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 group-hover:border-gray-300"
                        type="number"
                        placeholder="Enter credits"
                        min="0"
                        onChange={(e) => {
                          setCredits(Number(e.target.value))
                        }}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Semester */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Calendar className="h-4 w-4 text-red-600" />
                      Semester
                    </label>
                    <div className="relative group">
                      <input
                        value={semester}
                        className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 group-hover:border-gray-300"
                        type="number"
                        placeholder="Enter semester"
                        min="1"
                        onChange={(e) => {
                          setSemester(Number(e.target.value))
                        }}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="border-t border-gray-200 pt-8">
                <button
                  id={submitBtnId ?? "submit"}
                  type="submit"
                  className="w-full md:w-auto min-w-[200px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
                >
                  <Save className="h-5 w-5" />
                  {submitBtnLabel ||
                    (isEditing
                      ? "Update Subject"
                      : `${isSubmitting ? "Creating" : "Create Subject"}`)}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
