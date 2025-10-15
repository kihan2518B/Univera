"use client"
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useContext, useEffect, useState } from "react"
import axios from "axios"
import { UserContext } from "@/context/user"
import { useQuery } from "@tanstack/react-query"
import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
import { Button } from "@/components/ui/button"
import {
  RotateCcw,
  PersonStanding,
  Shield,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  UserPlus
} from "lucide-react"
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
  const [loading, setLoading] = useState(false)
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
    setLoading(true)
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
    } finally {
      setLoading(false)
    }
  }

  if (coursesError || rolesError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 max-w-md w-full mx-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-4">
            Error Loading Data
          </h2>

          {coursesError && (
            <div className="mb-4 sm:mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-4">
                <h3 className="font-semibold text-red-800 mb-2 text-sm sm:text-base">
                  Failed to load courses
                </h3>
                <p className="text-xs sm:text-sm text-red-600 mb-3">
                  {coursesError?.message || "An unexpected error occurred."}
                </p>
                <ButtonV1
                  icon={RotateCcw}
                  label="Retry Courses"
                  onClick={() => refetchCourses()}
                />
              </div>
            </div>
          )}

          {rolesError && (
            <div className="mb-4 sm:mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-4">
                <h3 className="font-semibold text-red-800 mb-2 text-sm sm:text-base">
                  Failed to load roles
                </h3>
                <p className="text-xs sm:text-sm text-red-600 mb-3">
                  {rolesError?.message || "An unexpected error occurred."}
                </p>
                <ButtonV1
                  icon={RotateCcw}
                  label="Retry Roles"
                  onClick={() => rolesRefetch()}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const steps = [
    {
      id: 1,
      title: "User Information",
      description: "Basic user details and credentials",
      icon: PersonStanding,
      color: "blue"
    },
    {
      id: 2,
      title: "Roles & Permissions",
      description: "Assign roles and work details",
      icon: Shield,
      color: "green"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl mb-3 sm:mb-4">
            <UserPlus className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2 px-2">
            {data ? "Edit Authority" : "Create New Authority"}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 px-4 sm:px-8 max-w-2xl mx-auto">
            {data
              ? "Update authority information and permissions"
              : "Set up a new authority with appropriate roles and permissions"}
          </p>
        </div>

        {/* Progress Steps */}
        {/* ... (no changes to progress steps) */}

        {/* Updated Form Container */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden max-w-4xl mx-auto w-full">
          <div className="p-4 sm:p-6 lg:p-8">
            {step == 1 && (
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <PersonStanding className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    User Information
                  </h2>
                </div>
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
              </div>
            )}

            {step == 2 && (
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Roles & Permissions
                  </h2>
                </div>
                <RoleForm
                  selectedRoleIds={roleIds}
                  setSelectedRoleIds={setRoleIds}
                  roles={roles}
                  setStep={setStep}
                />

                {roleIds.includes(11) && (
                  <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-amber-900">
                        Work Assignment
                      </h3>
                    </div>
                    <WorkForm
                      courses={courses}
                      selectedCourse={selectedCourse}
                      setSelectedCourse={setSelectedCourse}
                      departmentName={
                        data?.Department?.name ?? String(user?.Department?.name)
                      }
                      departmentId={user?.departmentId as number}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="bg-gray-50 border-t border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            {step == 1 && (
              <div className="flex justify-end w-full">
                <Button
                  type="button"
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-200/50 flex items-center justify-center gap-2"
                  onClick={() => setStep(2)}
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {step == 2 && (
              <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 w-full">
                <Button
                  type="button"
                  className="w-full sm:w-auto bg-white border-2 border-gray-300 text-gray-700 px-6 sm:px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-gray-50 hover:border-gray-400 flex items-center justify-center gap-2"
                  onClick={() => setStep(1)}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </Button>

                <Button
                  id={data ? "update-authority" : "save-authority"}
                  type="button"
                  disabled={loading}
                  className={`w-full sm:w-auto ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  } bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-green-200/50 flex items-center justify-center gap-2`}
                  onClick={handleSubmit}
                >
                  <CheckCircle2
                    className="w-4 h-4 animate-spin"
                    style={{ display: loading ? "block" : "none" }}
                  />
                  <span className="hidden sm:inline">
                    {loading
                      ? data
                        ? "Updating..."
                        : "Creating..."
                      : data
                        ? "Update Authority"
                        : "Create Authority"}
                  </span>
                  <span className="sm:hidden">
                    {loading
                      ? data
                        ? "Updating"
                        : "Creating"
                      : data
                        ? "Update"
                        : "Create"}
                  </span>
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-xs sm:text-sm text-gray-500 px-4">
            Need help? Contact your system administrator for assistance with
            authority management.
          </p>
        </div>
      </div>
    </div>
  )
}
