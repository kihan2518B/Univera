import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { fetchTeamMembers, deleteTeamMember } from "@/services/teamServices"
import TeamMemberForm from "./TeamMemberForm"
import { Pencil, Trash2, Search, UserPlus } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { AdminRole, TeamMember } from "@/types/teamMember"
import { TableLoader, OverlayLoader } from "@/components/ui/loading"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import toast from "react-hot-toast"

export default function TeamMemberTable() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const loadTeamMembers = async () => {
    const loadingToast = toast.loading("Loading team members...")
    try {
      setIsLoading(true)
      const data = await fetchTeamMembers()
      setTeamMembers(data)
      setFilteredMembers(data)
      setError("")
      toast.success("Team members loaded successfully", { id: loadingToast })
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred"
      setError("Failed to load team members")
      toast.error("Failed to load team members", { id: loadingToast })
      console.error("Error loading team members:", errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTeamMembers()
  }, [])

  useEffect(() => {
    const filtered = teamMembers.filter(
      (member) =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredMembers(filtered)
  }, [searchQuery, teamMembers])

  const handleAddMember = () => {
    setSelectedMember(null)
    setIsFormOpen(true)
  }

  const handleEditMember = (member: TeamMember) => {
    setSelectedMember(member)
    setIsFormOpen(true)
  }

  const initiateDelete = (member: TeamMember) => {
    setMemberToDelete(member)
  }

  const handleDeleteMember = async () => {
    if (!memberToDelete) return

    const deleteToast = toast.loading("Deleting team member...")
    try {
      setIsActionLoading(true)
      await deleteTeamMember(memberToDelete.id)
      await loadTeamMembers()
      toast.success("Team member deleted successfully", { id: deleteToast })
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred"
      setError("Failed to delete team member")
      toast.error("Failed to delete team member", { id: deleteToast })
      console.error("Error deleting team member:", errorMessage)
    } finally {
      setIsActionLoading(false)
      setMemberToDelete(null)
    }
  }

  const handleFormSuccess = (action: "add" | "update") => {
    toast.success(
      `Team member ${action === "add" ? "added" : "updated"} successfully`
    )
    loadTeamMembers()
    setIsFormOpen(false)
  }

  const getRoleColor = (role: AdminRole) => {
    switch (role) {
      case "Department Head":
        return "bg-blue-50 text-blue-700 ring-blue-600/20"
      case "Program Coordinator":
        return "bg-green-50 text-green-700 ring-green-600/20"
      case "Administrative Staff":
        return "bg-purple-50 text-purple-700 ring-purple-600/20"
      case "System Administrator":
        return "bg-rose-50 text-rose-700 ring-rose-600/20"
      default:
        return "bg-gray-50 text-gray-700 ring-gray-600/20"
    }
  }

  if (isLoading && teamMembers.length === 0) {
    return <TableLoader />
  }

  return (
    <>
      {isActionLoading && <OverlayLoader />}
      <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            {/* <h2 className="text-2xl font-semibold text-gray-900">
              University Admin Team
            </h2> */}
            <p className="mt-1 text-sm text-gray-500">
              Manage your university's administrative staff and their roles
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Input
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full"
                disabled={isLoading}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            <Button
              onClick={handleAddMember}
              className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
              disabled={isLoading}
            >
              <UserPlus className="h-4 w-4" />
              Add Member
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="bg-white overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {member.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {member.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getRoleColor(
                          member.role as AdminRole
                        )}`}
                      >
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditMember(member)}
                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                        disabled={isActionLoading}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => initiateDelete(member)}
                        className="text-rose-600 hover:text-rose-900"
                        disabled={isActionLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredMembers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center">
                      <div className="text-sm text-gray-500">
                        No team members found
                      </div>
                      {searchQuery && (
                        <Button
                          variant="link"
                          onClick={() => setSearchQuery("")}
                          className="text-indigo-600 mt-1"
                        >
                          Clear search
                        </Button>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {isFormOpen && (
          <TeamMemberForm
            member={selectedMember}
            onClose={() => setIsFormOpen(false)}
            onRefresh={handleFormSuccess}
          />
        )}

        <ConfirmationDialog
          isOpen={!!memberToDelete}
          onClose={() => setMemberToDelete(null)}
          onConfirm={handleDeleteMember}
          title="Delete Team Member"
          description={`Are you sure you want to delete ${memberToDelete?.name}? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
        />
      </div>
    </>
  )
}
