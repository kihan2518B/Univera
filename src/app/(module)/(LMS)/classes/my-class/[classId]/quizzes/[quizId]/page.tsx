"use client"
import { useParams } from "next/navigation"
import React from "react"
import QuizReview from "../../_components/QuizReview"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { QuizReviewSkeleton } from "@/components/(commnon)/Skeleton"

async function getQuizDetails(quizId: number, classId: number) {
  const res = await axios.get(
    `/api/classes/my-class/${classId}/quizzes/${quizId}`
  )
  return res.data.Quiz
}

export default function Page() {
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
        <QuizReview
          onUpdateStatus={UpdateStatus}
          onUpdateVisibility={UpdateVisibility}
          quiz={quizDetails}
        />
      )}
    </div>
  )
}
