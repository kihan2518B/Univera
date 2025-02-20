"use client"
import { useContext } from "react"
import { useParams } from "next/navigation"
import { UserContext } from "@/context/user"
import AssignmentForm from "../../../_components/AssignmentForm"
import Link from "next/link"
import Left from "@/components/Icons/Left"
export default function Page() {
  const { user } = useContext(UserContext)
  const { classId, subjectId } = useParams()

  return (
    <div className="min-h-screen max-w-full bg-lamaSkyLight p-4 md:p-6 flex flex-col overflow-x-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6 md:mb-8">
        <Link
          href={`/classes/my-class/${classId}/assignments/${subjectId}`}
          className="inline-flex items-center justify-center gap-2 bg-white border-2 text-TextTwo font-semibold rounded-lg px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base transition-all hover:bg-lamaPurpleLight hover:border-ColorTwo w-full sm:w-auto"
        >
          <Left className="w-4 h-4 sm:w-5 sm:h-5" /> Back
        </Link>
      </div>
      <div className="flex-1 overflow-auto">
        <AssignmentForm
          courseId={Number(user?.courseId)}
          userId={String(user?.id)}
          classId={String(classId)}
          subjectId={String(subjectId)}
          universityId={Number(user?.universityId)}
          departmentId={Number(user?.departmentId)}
          userName={String(user?.name)}
          assignment={null}
        />
      </div>
    </div>
  )
}
