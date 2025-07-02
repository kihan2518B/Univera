"use client"
import { useParams } from "next/navigation"
import React, { useContext } from "react"
import QuizReview from "../../_components/QuizReview"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { QuizReviewSkeleton } from "@/components/(commnon)/Skeleton"
import { UserContext } from "@/context/user"
import { AlertCircle } from "lucide-react"
import QuizSubmission from "../../_components/QuizSubmission"

async function getQuizDetails(quizId: number, classId: number) {
  const res = await axios.get(
    `/api/classes/my-class/${classId}/quizzes/${quizId}`
  )
  return res.data.Quiz
}

export default function Page() {
  const { user } = useContext(UserContext)
  const roles = user?.roles.map((r) => r.id) || []
  const { quizId, classId } = useParams()
  const {
    data: quizDetails,
    refetch,
    isLoading
  } = useQuery({
    queryKey: ["quizDetails", quizId],
    queryFn: () => getQuizDetails(Number(quizId), Number(classId)),
    enabled: !!String(quizId)
  })
  const UpdateStatus = async (quizId: number, newStatus: string) => {
    try {
      // console.log(newStatus)
      const res = await axios.patch(
        `/api/classes/my-class/${classId}/quizzes/${quizId}`,
        { newStatus },
        {
          params: { UpdateStatus: true }
        }
      )
      console.log(res)
      refetch()
    } catch (error) {
      console.log(error)
    }
  }
  const UpdateVisibility = async (quizId: number, newVisibility: string) => {
    try {
      const res = await axios.patch(
        `/api/classes/my-class/${classId}/quizzes/${quizId}`,
        { newVisibility },
        {
          params: { UpdateVisibility: true }
        }
      )
      console.log(res)
      refetch()
    } catch (error) {
      console.log(error)
    }
  }
  if (isLoading) {
    return <QuizReviewSkeleton />
  }

  return (
    <div>
      {quizDetails && (
        <>
          {roles.includes(4) ? (
            <QuizReview
              onUpdateStatus={UpdateStatus}
              onUpdateVisibility={UpdateVisibility}
              quiz={quizDetails}
              classId={classId as string}
            />
          ) : roles.includes(7) ? (
            <QuizSubmission quiz={quizDetails} studentId={user?.id as string} />
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center p-8 bg-lamaSkyLight rounded-lg border border-lamaSky">
                <AlertCircle className="mx-auto mb-2 text-gray-500" size={32} />
                <p className="text-TextTwo font-medium">
                  You are not authorized to view this page.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
