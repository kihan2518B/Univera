"use client"
import React from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import "react-loading-skeleton/dist/skeleton.css"
import { useState } from "react"
import { Prisma } from "@prisma/client"
import { CourseFormSkeleton } from "@/components/(commnon)/Skeleton"
import { Loader2 } from "lucide-react"

type StudentWithRelations = Prisma.StudentGetPayload<{
  include: {
    user: true
  }
}>

interface StudentFormProps {
  student?: StudentWithRelations
  submitBtnId?: string
  submitBtnLabel?: string
  isEditable?: boolean
  courseId: number
  departmentId: number
  universityId: number
  refetch?: () => void
  isLoading?: boolean
  isError?: boolean
}

export default function StudentForm({
  student,
  submitBtnId,
  submitBtnLabel,
  isEditable,
  courseId,
  departmentId,
  universityId,
  refetch,
  isLoading,
  isError
}: StudentFormProps) {
  const [name, setName] = useState<string>(student?.user.name ?? "")
  const [email, setEmail] = useState<string>(student?.user.email ?? "")
  const [password, setPassword] = useState<string>("")
  const [rollno, setRollNo] = useState<number>(student?.rollNo ?? 0)
  const [prn, setPRN] = useState<string>(student?.prn ?? "")
  const [semester, setSemester] = useState<number>(student?.semester ?? 0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const buttonId = (e.nativeEvent as SubmitEvent).submitter?.id
    setIsSubmitting(true)

    try {
      if (buttonId == "student-submit") {
        const createFormData = {
          name: name,
          email: email,
          password: password,
          rollNo: Number(rollno),
          prn: prn,
          semester: Number(semester),
          year: Math.ceil(Number(semester) / 2),
          courseId,
          departmentId,
          universityId
        }
        const res = await axios.post(`/api/list/student/create`, createFormData)
        if (res.status === 201) {
          toast.success(res.data.message)
          router.push(`/list/students`)
        } else {
          toast.error(res.data.message)
        }
      } else if (buttonId == "student-update") {
        const updatedStudent = {
          rollNo: Number(rollno),
          courseId,
          prn: prn,
          semester: Number(semester)
        }
        const res = await axios.patch(
          `/api/list/student/${student?.id}`,
          updatedStudent
        )
        if (res.status === 200) {
          toast.success(res.data.message)
          if (refetch) refetch()
          router.push(`/list/students`)
        } else {
          toast.error(res.data.message)
        }
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

  const inputClasses =
    "h-10 w-full rounded-lg bg-white border-2 border-gray-200 px-3 py-2 text-sm ring-offset-white transition-colors placeholder:text-gray-500 focus:border-ColorThree focus:outline-none focus:ring-2 focus:ring-ColorThree/20 disabled:cursor-not-allowed disabled:opacity-50"
  const labelClasses = "text-sm font-medium text-TextTwo mb-1.5 block"

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      {isError && (
        <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-lg mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">
                Something went wrong. Please try again.
              </p>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <CourseFormSkeleton />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className={labelClasses}>Full Name</label>
              <input
                value={name}
                disabled={!!isEditable || isSubmitting}
                className={inputClasses}
                type="text"
                placeholder="Enter full name"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className={labelClasses}>College Email</label>
              <input
                value={email}
                disabled={!!isEditable || isSubmitting}
                className={inputClasses}
                type="email"
                placeholder="Enter college email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {!isEditable && (
              <div>
                <label className={labelClasses}>Password</label>
                <input
                  value={password}
                  disabled={isSubmitting}
                  className={inputClasses}
                  type="password"
                  placeholder="Enter password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Roll No</label>
                <input
                  value={rollno}
                  disabled={isSubmitting}
                  className={inputClasses}
                  type="number"
                  placeholder="Enter roll number"
                  onChange={(e) => setRollNo(Number(e.target.value))}
                  required
                />
              </div>

              <div>
                <label className={labelClasses}>PRN</label>
                <input
                  value={prn}
                  disabled={isSubmitting}
                  className={inputClasses}
                  type="text"
                  placeholder="Enter PRN"
                  onChange={(e) => setPRN(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className={labelClasses}>Semester</label>
              <input
                value={semester}
                disabled={isSubmitting}
                className={inputClasses}
                type="number"
                min="1"
                max="8"
                placeholder="Enter semester"
                onChange={(e) => setSemester(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <button
            id={submitBtnId ?? "submit"}
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 px-8 flex items-center justify-center font-medium rounded-lg text-white bg-gradient-to-r from-ColorThree to-ColorTwo hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ColorThree/20 disabled:opacity-70 transition-all duration-200"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isEditable ? "Updating..." : "Creating..."}
              </>
            ) : (
              (submitBtnLabel ?? "Submit")
            )}
          </button>
        </form>
      )}
    </div>
  )
}
