"use client"
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useContext, useEffect, useState } from "react"
import UserForm from "./UserForm"
import WorkForm from "./WorkForm"
import RoleForm from "./RoleForm"
import axios from "axios"
import { UserContext } from "@/context/user"
import { useQuery } from "@tanstack/react-query"
import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
import { RotateCcw } from "lucide-react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { Prisma } from "@prisma/client"

// Custom type including the relations
type FacultyWithRelations = Prisma.FacultyGetPayload<{
  include: {
    user: {
      include: {
        roles: true // Include roles relation
      }
    }
    subject: true // Include subject relation
    department: true // Include department relation
  }
}>

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
interface TeacherFormProps {
  data: FacultyWithRelations | null
}
export function TeacherForm({ data }: TeacherFormProps) {
  const router = useRouter()
  const [fName, setFName] = useState<string>("")
  const [fEmail, setFEmail] = useState<string>("")
  const [fPassword, setFPassword] = useState<string>("")
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<number[]>([])
  const [roleIds, setRoleIds] = useState<number[]>([])
  const [position, setPosition] = useState<string>("")

  const [step, setStep] = useState(1)
  const { user } = useContext(UserContext)
  useEffect(() => {
    if (data) {
      setFName(data?.user.name)
      setFEmail(data?.user.email)
      setSelectedCourse(String(data?.courseId))
      setRoleIds(data?.user.roles.map((r) => r.id))
      setPosition(data?.position ?? "")
      setSelectedSubjectIds(data.subject.map((s) => s.id))
    }
  }, [data])

  const {
    data: courses,
    error: coursesError,
    refetch: refetchCourses
  } = useQuery({
    queryKey: ["courses", user?.departmentId, user?.id],
    queryFn: () => fetchCourses(String(user?.departmentId), user?.id as string),
    enabled: !!user?.departmentId && !!user?.id
  })
  const {
    data: roles,
    error: rolesError,
    refetch: rolesRefetch
  } = useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoles,
    enabled: true
  })

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    const btnId = e.currentTarget.id
    try {
      if (btnId == "save-faculty") {
        const res = await axios.post("/api/list/teacher/create", {
          name: fName,
          email: fEmail,
          password: fPassword,
          roleIds,
          position,
          courseId: selectedCourse,
          departmentId: user?.departmentId,
          universityId: user?.universityId,
          subjectIds: selectedSubjectIds
        })
        if (res.status == 201) {
          toast.success("Faculty Created successfully")
          router.push("/list/teachers")
        }
      } else if (btnId == "update-faculty") {
        const res = await axios.patch(`/api/list/teacher/${data?.clerkId}`, {
          name: fName,
          email: fEmail,
          password: fPassword,
          roleIds,
          position,
          courseId: selectedCourse,
          departmentId: user?.departmentId,
          universityId: user?.universityId,
          subjectIds: selectedSubjectIds
        })
        if (res.status == 200) {
          toast.success(res.data.message)
          router.push("/list/teachers")
        }
      }
    } catch (error) {
      toast.error("Something went wrong")
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
          isEditable={!data}
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
        <WorkForm
          selectedSubjectIds={selectedSubjectIds}
          setSelectedSubjectIds={setSelectedSubjectIds}
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
          setStep={setStep}
          courses={courses}
          departmentId={Number(user?.departmentId)}
          departmentName={
            data?.department.name ?? String(user?.Department?.name)
          }
        />
      )}
      {step == 3 && (
        <RoleForm
          submitBtnId={data ? "update-faculty" : "save-faculty"}
          handleTeacherSubmit={handleSubmit}
          selectedRoleIds={roleIds}
          setSelectedRoleIds={setRoleIds}
          roles={roles}
          setStep={setStep}
          position={position}
          setPosition={setPosition}
        />
      )}
    </div>
  )
}
