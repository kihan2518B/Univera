import { useQuery } from "@tanstack/react-query"
import React from "react"
import axios from "axios"
import ClassesCard from "./ClassesCard"
import { ClassesCardSkeleton } from "@/components/(commnon)/Skeleton"

interface DepartmentClassesProps {
  user: any | null
  roles: number[]
  departmentId: string
}

async function fetchClasses(departmentId: string) {
  const { data } = await axios.get(`/api/classes/department`, {
    params: { departmentId }
  })
  return data?.classes || []
}

export default function DepartmentClasses({
  user,
  departmentId
}: DepartmentClassesProps) {
  const {
    data: classes,
    error,
    isLoading
  } = useQuery({
    queryKey: ["Dclasses", departmentId, user?.id],
    queryFn: () => fetchClasses(departmentId),
    enabled: !!departmentId && !!user?.id
  })
  if (error) {
    return <div>Error while fetching classes</div>
  }

  return (
    <div className="flex flex-col ">
      <h1 className="text-2xl font-bold text-Dark my-2">
        Departmental Classes
      </h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 ml-2">
        {isLoading && (
          <>
            {[...Array(8)].map((_, i) => (
              <ClassesCardSkeleton key={i} />
            ))}
          </>
        )}

        {classes && classes.length === 0 && <p>No classes found.</p>}
        {classes &&
          classes.map((c: any) => <ClassesCard key={c.id} Class={c} />)}
      </div>
    </div>
  )
}
