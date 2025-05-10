"use client"
import React, { useContext } from "react"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { UserContext } from "@/context/user"
import { AssignmentSubmissions } from "../../../../_components/AssignmentSubmission"
import { AssignmentSubmissionsSkeleton } from "@/components/(commnon)/Skeleton"

async function getAssignment(
  classId: string,
  subjectId: string,
  assignmentId: string
) {
  const res = await axios.get(
    `/api/classes/my-class/${classId}/assignments/${subjectId}/${assignmentId}`
  )
  return res.data.assignment
}

export default function SubmissionsPage() {
  const { user } = useContext(UserContext)
  const { classId, subjectId, assignmentId } = useParams()
  const { data: assignment, isLoading } = useQuery({
    queryKey: ["submissions"],
    queryFn: () =>
      getAssignment(
        classId as string,
        subjectId as string,
        assignmentId as string
      ),
    enabled: !!classId && !!subjectId && !!assignmentId
  })
  const roles = user?.roles.map((role: any) => role.id)
  if (roles && !roles.includes(4)) {
    return <div>You do not have permission to this page</div>
  }
  return (
    <div>
      {isLoading && (
        <AssignmentSubmissionsSkeleton classId={classId as string} />
      )}
      {assignment && (
        <AssignmentSubmissions
          assignment={assignment}
          classId={classId as string}
          subjectId={subjectId as string}
        />
      )}
    </div>
  )
}
