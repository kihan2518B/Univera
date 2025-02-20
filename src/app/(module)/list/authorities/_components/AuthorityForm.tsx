"use client"
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useContext, useEffect, useState } from "react"
import axios from "axios"
import { UserContext } from "@/context/user"
import { useQuery } from "@tanstack/react-query"
import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { Prisma, User } from "@prisma/client"
import UserForm from "./UserForm"
import RoleForm from "./RoleForm"
import WorkForm from "./WorkForm"

const fetchCourses = async (departmentId: string, userId: string) => {
  const { data } = await axios.get(`/api/courses`, {
    params: { departmentId, userId }
  })
  return data?.courses || []
}
async function fetchRoles() {
  const { data } = await axios.get("/api/roles")
  return data.roles
}

type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    Department: true
    roles: true
    course: true
  }
}>
interface AuthorityFormProps {
  data: UserWithRelations | null
}
export function AuthorityForm({ data }: AuthorityFormProps) {
  const router = useRouter()
  const [fName, setFName] = useState<string>("")
  const [fEmail, setFEmail] = useState<string>("")
  const [fPassword, setFPassword] = useState<string>("")
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [roleIds, setRoleIds] = useState<number[]>([])
  const [position, setPosition] = useState<string>("")
  const [step, setStep] = useState(1)
  const { user } = useContext(UserContext)
  useEffect(() => {
    if (data) {
      setFName(data?.name)
      setFEmail(data?.email)
      setSelectedCourse(data.course?.id.toString() || "")
      setRoleIds(data?.roles.map((r) => r.id))
    }
  }, [data])

  const {
    data: courses,
    error: coursesError,
    refetch: refetchCourses,
    isRefetching: isCourseRefetching
  } = useQuery({
    queryKey: ["courses", user?.departmentId, user?.id],
    queryFn: () => fetchCourses(String(user?.departmentId), user?.id as string),
    enabled: !!user?.departmentId && !!user?.id
  })

  const {
    data: roles,
    error: rolesError,
    refetch: rolesRefetch,
    isRefetching: isRolesRefetching
  } = useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoles,
    enabled: true
  })

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    const btnId = e.currentTarget.id
    try {
      if (btnId == "save-authority") {
        const res = await axios.post("/api/list/authorities/create", {
          name: fName,
          email: fEmail,
          password: fPassword,
          roleIds,
          position,
          courseId: selectedCourse,
          departmentId: user?.departmentId,
          universityId: user?.universityId
        })
        if (res.status == 201) {
          toast.success(res.data.message)
          router.push("/list/authorities")
        } else {
          toast.error(res.data.message)
        }
      } else if (btnId == "update-authority") {
        const res = await axios.patch(
          `/api/list/authorities/${data?.clerkId}`,
          {
            name: fName,
            email: fEmail,
            password: fPassword,
            roleIds,
            position,
            courseId: selectedCourse,
            departmentId: user?.departmentId,
            universityId: user?.universityId
          }
        )
        if (res.status == 200) {
          toast.success(res.data.message)
          router.push("/list/authorities")
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
    }
  }

  // Handle errors or loading states
  if (coursesError || rolesError) {
    return (
      <div className="text-red-500">
        {coursesError && (
          <div>
            <p>Failed to load courses. Please try again later.</p>
            <p className="text-sm text-gray-500">
              {coursesError?.message || "An unexpected error occurred."}
            </p>
            <ButtonV1
              icon={RotateCcw}
              label="Retry Courses"
              onClick={() => refetchCourses()}
            />
          </div>
        )}
        {rolesError && (
          <div>
            <p>Failed to load roles. Please try again later.</p>
            <p className="text-sm text-gray-500">
              {rolesError?.message || "An unexpected error occurred."}
            </p>
            <ButtonV1
              icon={RotateCcw}
              label="Retry Courses"
              onClick={() => rolesRefetch()}
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="mt-8 max-w-2xl">
      {step == 1 && (
        <UserForm
          isEditing={!!data}
          setStep={setStep}
          name={fName}
          setName={setFName}
          email={fEmail}
          setEmail={setFEmail}
          password={fPassword}
          setPassword={setFPassword}
        />
      )}
      {step == 2 && (
        <RoleForm
          selectedRoleIds={roleIds}
          setSelectedRoleIds={setRoleIds}
          roles={roles}
          setStep={setStep}
        />
      )}
      {step == 2 && roleIds.includes(11) && (
        <WorkForm
          courses={courses}
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
          departmentName={
            data?.Department?.name ?? String(user?.Department?.name)
          }
          departmentId={user?.departmentId as number}
        />
      )}
      <div className="flex gap-4 mt-4">
        {step == 1 && (
          <Button
            type="button"
            className="flex justify-end"
            onClick={() => {
              setStep(2)
            }}
          >
            Next
          </Button>
        )}
        {step == 2 && (
          <div className="flex gap-4 w-full">
            <Button
              type="button"
              className="flex justify-end"
              onClick={() => setStep(1)}
            >
              Back
            </Button>
            <Button
              id={data ? "update-authority" : "save-authority"}
              type="button"
              className="flex justify-end"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
