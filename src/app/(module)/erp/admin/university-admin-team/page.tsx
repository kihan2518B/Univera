"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import TeamMember from "@/components/TeamMember"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function UniversityAdminTeamPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  React.useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in")
    }
  }, [isLoaded, user, router])

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  if (user?.publicMetadata.role !== "admin") {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Access Denied. You need administrator privileges to view this page.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">University Admin Team</h1>
      <TeamMember />
    </div>
  )
}
