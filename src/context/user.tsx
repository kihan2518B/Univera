"use client"
import React, {
  createContext,
  useReducer,
  useEffect,
  useMemo,
  useState
} from "react"
import { useUser } from "@clerk/nextjs"
import { useQuery } from "@tanstack/react-query"
import { RotateCcw } from "lucide-react"
import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
import { Prisma } from "@prisma/client"

type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    course: true
    faculty: true
    student: true
    roles: true
    university: true
    Department: true
  }
}>

interface UserContextType {
  user: UserWithRelations | null
  dispatch: React.Dispatch<any>
}

export const UserContext = createContext<UserContextType>({
  user: null,
  dispatch: () => {}
})

const UserReducer = (
  state: UserWithRelations | null,
  action: { type: string; user: UserWithRelations | null }
) => {
  switch (action.type) {
    case "SET_USER":
      return action.user
    default:
      return state
  }
}

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [isClient, setIsClient] = useState(false)
  const [state, dispatch] = useReducer(UserReducer, null)
  const { user } = useUser()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const fetchUserData = async () => {
    if (user?.publicMetadata.role && user?.id) {
      const response = await fetch(
        `/api/profile?role=${user.publicMetadata.role}&userId=${user.id}`
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`)
      }

      const data = await response.json()
      return data.User
    }
    throw new Error("User data is missing.")
  }

  const {
    data,
    isLoading,
    error: fetchError,
    isSuccess,
    refetch
  } = useQuery({
    queryKey: ["user", user?.id],
    queryFn: fetchUserData,
    enabled: !!user?.id
  })

  useEffect(() => {
    if (isSuccess) {
      dispatch({ type: "SET_USER", user: data })
    }
  }, [isSuccess, data])

  const contextValue = useMemo(
    () => ({ user: state, dispatch }),
    [state, dispatch]
  )
  if (!isClient) return null // Avoid rendering on the server
  if (isLoading || !data) return <div>Loading...</div>

  if (fetchError)
    return (
      <div className="text-red-500">
        <p>Failed to load User. Please try again later.</p>
        <p className="text-sm text-gray-500">
          {fetchError?.message || "An unexpected error occurred."}
        </p>
        <ButtonV1 icon={RotateCcw} label="Retry" onClick={() => refetch()} />
      </div>
    )

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  )
}
