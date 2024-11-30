import { TeamMember } from "@/types/teamMember"

export async function fetchTeamMembers(): Promise<TeamMember[]> {
  const response = await fetch("/api/admin/getTeamMembers")
  if (!response.ok) {
    throw new Error("Failed to fetch team members")
  }
  return response.json()
}

export async function addTeamMember(
  data: Omit<TeamMember, "id">
): Promise<TeamMember> {
  const response = await fetch("/api/admin/addTeamMember", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  if (!response.ok) {
    throw new Error("Failed to add team member")
  }
  return response.json()
}

export async function updateTeamMember(
  id: string,
  data: Omit<TeamMember, "id">
): Promise<TeamMember> {
  const response = await fetch(`/api/admin/updateTeamMember?id=${id}`, {
    // Added id as query param
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data) // Removed id from body since it's in query
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to update team member")
  }
  return response.json()
}

export async function deleteTeamMember(id: string): Promise<void> {
  const response = await fetch(`/api/admin/deleteTeamMember?id=${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to delete team member")
  }
}
