"use client"
import React, { useContext } from "react"
import axios from "axios"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { UserContext } from "@/context/user"
import toast from "react-hot-toast"
import { AssignmentTableComponent } from "../../_components/AssignmentTable"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

async function fetchAssignments(classId: string, subjectId: string) {
  const res = await axios.get(
    `/api/classes/my-class/${classId}/assignments/${subjectId}`
  )
  return res.data
}

export default function AssignmentListPage() {
  const { user } = useContext(UserContext)
  const { classId, subjectId } = useParams()
  const roles = user?.roles?.map((role: any) => role.id)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["assignments", classId, subjectId],
    queryFn: () => fetchAssignments(classId as string, subjectId as string),
    enabled: !!user
  })
  async function deleteAssignment(id: string) {
    try {
      const res = await axios.delete(
        `/api/classes/my-class/${classId}/assignments/${subjectId}/${id}`
      )
      if (res.status == 200) {
        toast.success(res.data.message)
        refetch()
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
    <div>
      <div
        className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6 md:mb-8 `}
      >
        <Link
          href={`/classes/my-class/${classId}/assignments`}
          className="flex items-center text-TextTwo hover:bg-lamaSkyLight"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back
        </Link>
      </div>
      <AssignmentTableComponent
        data={data}
        isLoading={isLoading}
        isError={isError}
        refetch={refetch}
        userId={String(user?.id)}
        roles={roles as number[]}
        classId={classId as string}
        subjectId={subjectId as string}
        deleteAssignment={deleteAssignment}
      />
    </div>
  )
}
