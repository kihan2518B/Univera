// "use client"
// import React, {
//   createContext,
//   useReducer,
//   useEffect,
//   useMemo,
//   useState
// } from "react"
// import { useUser } from "@clerk/nextjs"
// import { useQuery } from "@tanstack/react-query"
// import { RotateCcw } from "lucide-react"
// import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
// import { Prisma } from "@prisma/client"
// import UniveraLoader from "@/components/(commnon)/UniveraLoader"

// type UserWithRelations = Prisma.UserGetPayload<{
//   include: {
//     course: true
//     faculty: true
//     student: true
//     roles: true
//     university: true
//     Department: true
//   }
// }>

// interface UserContextType {
//   user: UserWithRelations | null
//   dispatch: React.Dispatch<any>
// }

// export const UserContext = createContext<UserContextType>({
//   user: null,
//   dispatch: () => {}
// })

// const UserReducer = (
//   state: UserWithRelations | null,
//   action: { type: string; user: UserWithRelations | null }
// ) => {
//   switch (action.type) {
//     case "SET_USER":
//       return action.user
//     default:
//       return state
//   }
// }

// export const UserProvider = ({ children }: { children: React.ReactNode }) => {
//   const [isClient, setIsClient] = useState(false)
//   const [state, dispatch] = useReducer(UserReducer, null)
//   const { user } = useUser()

//   useEffect(() => {
//     setIsClient(true)
//   }, [])

//   const fetchUserData = async () => {
//     if (user?.publicMetadata.role && user?.id) {
//       const response = await fetch(
//         `/api/profile?role=${user.publicMetadata.role}&userId=${user.id}`
//       )

//       if (!response.ok) {
//         throw new Error(`Failed to fetch: ${response.statusText}`)
//       }

//       const data = await response.json()
//       return data.User
//     }
//     throw new Error("User data is missing.")
//   }

//   const {
//     data,
//     isLoading,
//     error: fetchError,
//     isSuccess,
//     refetch
//   } = useQuery({
//     queryKey: ["user", user?.id],
//     queryFn: fetchUserData,
//     enabled: !!user?.id
//   })

//   useEffect(() => {
//     if (isSuccess) {
//       dispatch({ type: "SET_USER", user: data })
//     }
//   }, [isSuccess, data])

//   const contextValue = useMemo(
//     () => ({ user: state, dispatch }),
//     [state, dispatch]
//   )
//   if (!isClient) return null // Avoid rendering on the server
//   if (isLoading || !data) return <UniveraLoader />

//   if (fetchError)
//     return (
//       <div className="text-red-500">
//         <p>Failed to load User. Please try again later.</p>
//         <p className="text-sm text-gray-500">
//           {fetchError?.message || "An unexpected error occurred."}
//         </p>
//         <ButtonV1 icon={RotateCcw} label="Retry" onClick={() => refetch()} />
//       </div>
//     )

//   return (
//     <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
//   )
// }

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
import UniveraLoader from "@/components/(commnon)/UniveraLoader"
import Cookies from "js-cookie"

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

// Cookie configuration
const USER_COOKIE_NAME = "univera_user_data"
const COOKIE_EXPIRY_DAYS = 7

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [isClient, setIsClient] = useState(false)
  const [state, dispatch] = useReducer(UserReducer, null)
  const { user } = useUser()

  // Function to save user data to a cookie
  const saveUserDataToCookie = (userData: UserWithRelations) => {
    try {
      Cookies.set(USER_COOKIE_NAME, JSON.stringify(userData), {
        expires: COOKIE_EXPIRY_DAYS,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
      })
    } catch (error) {
      console.error("Failed to save user data to cookie:", error)
    }
  }

  // Function to get user data from cookie
  const getUserDataFromCookie = (): UserWithRelations | null => {
    try {
      const cookieData = Cookies.get(USER_COOKIE_NAME)
      if (cookieData) {
        return JSON.parse(cookieData)
      }
    } catch (error) {
      console.error("Failed to parse user data from cookie:", error)
      // If there's an error parsing the cookie, remove it
      Cookies.remove(USER_COOKIE_NAME)
    }
    return null
  }

  // Initialize client state and check for cookie data
  useEffect(() => {
    setIsClient(true)

    // Try to load user data from cookie
    if (user?.id) {
      const cookieData = getUserDataFromCookie()
      if (cookieData && cookieData.id === user.id) {
        dispatch({ type: "SET_USER", user: cookieData })
      }
    }
  }, [user?.id])

  const fetchUserData = async () => {
    // First check if we have valid cookie data
    const cookieData = getUserDataFromCookie()
    if (cookieData && user?.id && cookieData.id === user.id) {
      return cookieData
    }

    // If no valid cookie data, fetch from API
    if (user?.publicMetadata.role && user?.id) {
      const response = await fetch(
        `/api/profile?role=${user.publicMetadata.role}&userId=${user.id}`
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`)
      }

      const data = await response.json()

      // Save the fetched data to cookie for future use
      if (data.User) {
        saveUserDataToCookie(data.User)
      }

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
    enabled: !!user?.id,
    // Adding staleTime to reduce unnecessary refetches
    staleTime: 1000 * 60 * 5, // 5 minutes
    // Initialize with cookie data if available
    initialData: () => {
      const cookieData = getUserDataFromCookie()
      if (cookieData && user?.id && cookieData.id === user.id) {
        return cookieData
      }
      return undefined
    }
  })

  const handleRefetch = () => {
    // Clear cookie before refetching to ensure fresh data
    Cookies.remove(USER_COOKIE_NAME)
    refetch()
  }

  useEffect(() => {
    if (isSuccess && data) {
      dispatch({ type: "SET_USER", user: data })

      // Update cookie with latest data
      saveUserDataToCookie(data)
    }
  }, [isSuccess, data])

  const contextValue = useMemo(
    () => ({ user: state, dispatch }),
    [state, dispatch]
  )

  if (!isClient) return null // Avoid rendering on the server

  // Use data from cookie if available while loading
  const cookieData = getUserDataFromCookie()
  if (
    isLoading &&
    !state &&
    cookieData &&
    user?.id &&
    cookieData.id === user.id
  ) {
    dispatch({ type: "SET_USER", user: cookieData })
    return (
      <UserContext.Provider value={{ user: cookieData, dispatch }}>
        {children}
      </UserContext.Provider>
    )
  }

  if (isLoading && !state) return <UniveraLoader />

  if (fetchError)
    return (
      <div className="text-red-500">
        <p>Failed to load User. Please try again later.</p>
        <p className="text-sm text-gray-500">
          {fetchError?.message || "An unexpected error occurred."}
        </p>
        <ButtonV1 icon={RotateCcw} label="Retry" onClick={handleRefetch} />
      </div>
    )

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  )
}
