"use client"
import { UserContext } from "@/context/user"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import React, { useContext } from "react"
import axios from "axios"
import { RotateCcw } from "lucide-react"
import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
import { ClassEditForm } from "../../../_components/ClassEditForm"

async function fetchClassById(classId: number) {
  const { data } = await axios.get(`/api/classes/${classId}`)
  return data?.Class
}

export default function ClassEditPage() {
  const { user } = useContext(UserContext)
  const { classId } = useParams()

  const {
    data: Class,
    error,
    refetch,
    isLoading
  } = useQuery({
    queryKey: ["classes", classId, user?.id],
    queryFn: () => fetchClassById(Number(classId)),
    enabled: !!classId && !!user?.id
  })

  if (error) {
    return (
      <div className="text-red-500">
        <p>Failed to load class. Please try again later.</p>
        <p className="text-sm text-gray-500">
          {error?.message || "An unexpected error occurred."}
        </p>
        <ButtonV1 icon={RotateCcw} label="Retry" onClick={() => refetch()} />
      </div>
    )
  }
  return (
    <div>
      <ClassEditForm
        defaults={Class}
        isLoading={isLoading}
        user={user}
        classId={classId}
      />
    </div>
  )
}
