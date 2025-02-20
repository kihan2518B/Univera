"use client"
import React, { useContext } from "react"
import ClassesCard from "../_components/ClassesCard"
import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
import { UserContext } from "@/context/user"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { ClassesCardSkeleton } from "@/components/(commnon)/Skeleton"
import DepartmentClasses from "../_components/DepartmentClasses"

async function fetchClasses(courseId: number) {
  const { data } = await axios.get(`/api/classes`, {
    params: { courseId }
  })
  return data?.classes || []
}
async function getFacultyClasses(facultyId: string) {
  const { data } = await axios.get(`/api/classes`, {
    params: { facultyId, isFaculty: true }
  })
  return data?.classes || []
}

export default function ClassesPage() {
  const { user } = useContext(UserContext)

  // Handle roles safely
  const roles = user?.roles?.map((role: any) => role.id) || []

  if (!user) {
    return (
      <div className="p-6">
        <p>Loading user data...</p>
        {/* Optionally, add a loader or skeleton */}
      </div>
    )
  }
  if (roles.includes(4)) {
    return (
      <div>
        <FacultyClasses user={user} roles={roles} />
      </div>
    )
  }
  //Principal and Dean
  if (roles.includes(10) || roles.includes(12)) {
    return (
      <div>
        <DepartmentClasses
          departmentId={String(user?.departmentId)}
          user={user}
          roles={roles}
        />
      </div>
    )
  }

  //authority
  if (roles.includes(5) || roles.includes(11) || roles.includes(13)) {
    return <Authority user={user} roles={roles} />
  }
  return (
    <div className="p-6">
      <p>You do not have access to this page.</p>
    </div>
  )
}

interface AuthorityProps {
  roles: number[]
  user: any
}
function Authority({ roles, user }: AuthorityProps) {
  const courseId = user?.faculty?.courseId || user?.course?.id
  const {
    data: classes,
    error,
    isLoading
  } = useQuery({
    queryKey: ["classes", courseId, user?.id],
    queryFn: () => fetchClasses(courseId),
    enabled: !!courseId && !!user?.id
  })

  const {
    data: FacultyClasses,
    isLoading: isFClassLoading,
    error: isFClasserror
  } = useQuery({
    queryKey: ["facultyClasses", user?.id],
    queryFn: () => getFacultyClasses(user?.id),
    enabled: !!user?.id
  })

  if (error) {
    return <p>Failed to load classes. Please try again later.</p>
  }

  return (
    <div>
      {/* Faculty */}
      {roles.includes(4) && (
        <div className="">
          My Classes
          <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 ml-2">
            {isFClasserror && <>Failed to load your classes</>}
            {FacultyClasses && FacultyClasses.length === 0 && (
              <p>No classes found.</p>
            )}
            {isFClassLoading ? (
              <>
                {[...Array(8)].map((_, i) => (
                  <ClassesCardSkeleton key={i} />
                ))}
              </>
            ) : (
              FacultyClasses &&
              FacultyClasses.map((c: any) => (
                <ClassesCard key={c.id} Class={c} isFaculty={true} />
              ))
            )}
          </div>
        </div>
      )}
      {/* Course Authority */}
      <div className="flex justify-end p-6">
        {(roles.includes(5) || roles.includes(11)) && (
          <ButtonV1 label="Create New Class" href="/classes/create" />
        )}
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 ml-2">
        {classes && classes.length === 0 && <p>No classes found.</p>}
        {isLoading ? (
          <>
            {[...Array(8)].map((_, i) => (
              <ClassesCardSkeleton key={i} />
            ))}
          </>
        ) : (
          classes &&
          classes.map((c: any) => <ClassesCard key={c.id} Class={c} />)
        )}
      </div>
      {/* Department Authority */}
      {(roles.includes(10) || roles.includes(12)) && (
        <div>
          <DepartmentClasses
            departmentId={user?.Department?.id}
            user={user}
            roles={roles}
          />
        </div>
      )}
    </div>
  )
}

interface FacultyClassesProps {
  user: any
  roles: number[]
}
function FacultyClasses({ user, roles }: FacultyClassesProps) {
  const {
    data: classes,
    isLoading,
    error: FacultyError
  } = useQuery({
    queryKey: ["facultyClasses", user?.id],
    queryFn: () => getFacultyClasses(user?.id),
    enabled: !!user?.id
  })
  const courseId = user?.faculty?.courseId || user?.course?.id
  const {
    data: AuthorityClasses,
    error: isAuthorityError,
    isLoading: isAuthorityClassesLoading
  } = useQuery({
    queryKey: ["classes", courseId, user?.id],
    queryFn: () => fetchClasses(courseId),
    enabled: !!courseId && !!user?.id
  })

  return (
    <div className="flex flex-col h-full w-full">
      {/* Course Authority */}
      <div className="flex justify-end p-6">
        {(roles.includes(5) || roles.includes(11)) && (
          <ButtonV1 label="Create New Class" href="/classes/create" />
        )}
      </div>
      <div className="">
        <h1 className="text-2xl font-bold text-Dark text-center py-4">
          My classes
        </h1>
        <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 ml-2">
          {FacultyError && (
            <p>Failed to load your classes. Please try again later.</p>
          )}
          {classes && classes.length === 0 && <p>No classes found.</p>}
          {isLoading ? (
            <>
              {[...Array(3)].map((_, i) => (
                <ClassesCardSkeleton key={i} />
              ))}
            </>
          ) : (
            classes &&
            classes.map((c: any) => (
              <ClassesCard key={c.id} Class={c} isFaculty={true} />
            ))
          )}
        </div>
      </div>

      {/* principal,dean */}
      {(roles.includes(10) || roles.includes(12)) && (
        <div>
          <DepartmentClasses
            departmentId={user?.Department?.id}
            user={user}
            roles={roles}
          />
        </div>
      )}

      {/* Course Authority but not principal and dean */}
      {(roles.includes(5) || roles.includes(11) || roles.includes(13)) &&
        !(roles.includes(10) || roles.includes(12)) && (
          <div className="">
            <h1 className="text-2xl font-bold text-Dark text-center py-4">
              Course Classes
            </h1>
            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 ml-2">
              {isAuthorityError && (
                <p>Failed to load course classes. Please try again later.</p>
              )}
              {AuthorityClasses && AuthorityClasses.length === 0 && (
                <p>No classes found.</p>
              )}
              {isAuthorityClassesLoading ? (
                <>
                  {[...Array(8)].map((_, i) => (
                    <ClassesCardSkeleton key={i} />
                  ))}
                </>
              ) : (
                AuthorityClasses &&
                AuthorityClasses.map((c: any) => (
                  <ClassesCard key={c.id} Class={c} />
                ))
              )}
            </div>
          </div>
        )}
    </div>
  )
}
