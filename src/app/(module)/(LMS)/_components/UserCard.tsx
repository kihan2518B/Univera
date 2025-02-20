import { Prisma, User } from "@prisma/client"
import Image from "next/image"
import React, { useState } from "react"
import { Edit, Mail, Briefcase } from "lucide-react"
import { UpdateCoordinator, UpdateMentor } from "./AddCoordinator"
import { ButtonV1 } from "@/components/(commnon)/ButtonV1"

type FacultyWithRelations = Prisma.FacultyGetPayload<{
  include: {
    user: {
      include: {
        roles: true // Include roles relation
      }
    }
  }
}>

interface UserCardProps {
  User: User
  type: "coordinator" | "mentor"
  classId: string
  Users: FacultyWithRelations[]
  refetch: () => void
}

export default function UserCard({
  User,
  type,
  classId,
  Users,
  refetch
}: UserCardProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative bg-gradient-to-br from-[#f4f5ff] to-[#e6e8f3] p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-Secondary">
      {/* Header Section with Update Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-Dark">
          {type === "coordinator" ? "Class Coordinator" : "Class Mentor"}
        </h1>
        <ButtonV1
          icon={Edit}
          id={`edit-${type}`}
          label={`Edit ${type == "coordinator" ? "Coordinator" : "Mentor"}`}
          className="bg-[#5B58EB] text-white hover:bg-[#4845c7] flex items-center gap-2 px-4 py-2 rounded-lg"
          onClick={() => setOpen(true)}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Image Section */}
        <div className="flex-shrink-0">
          <div className="relative h-32 w-32 rounded-full overflow-hidden shadow-xl border-4 border-white">
            <Image
              src={`${User?.imageUrl || "/user.jpg"}`}
              className="object-cover transition-transform duration-300 hover:scale-105"
              fill
              alt={User?.name || "Profile"}
              priority
            />
          </div>
        </div>

        {/* User Details Section */}
        <div className="flex-grow space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-Dark">{User?.name}</h2>
            <div className="flex items-center gap-2 text-TextTwo/80">
              <Mail className="h-4 w-4" />
              <span>{User?.email}</span>
            </div>
            <div className="flex items-center gap-2 text-TextTwo/80">
              <Briefcase className="h-4 w-4" />
              <span className="capitalize">{type}</span>
            </div>
          </div>

          {/* Roles Section */}
          <div className="flex flex-wrap gap-2">
            {Users.find((u) => u.user.id === User?.id)?.user.roles.map(
              (role: any) => (
                <span
                  key={role.id}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-ColorOne text-Dark"
                >
                  {role.rolename}
                </span>
              )
            )}
          </div>

          {/* Last Updated */}
          <p className="text-sm text-TextTwo/60">
            Last Updated:{" "}
            {User && new Date(User.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Dialog Components */}
      {type === "coordinator" ? (
        <UpdateCoordinator
          open={open}
          setOpen={setOpen}
          refetch={refetch}
          classId={classId}
          CoordinatorUsers={Users}
        />
      ) : (
        <UpdateMentor
          open={open}
          setOpen={setOpen}
          refetch={refetch}
          classId={classId}
          MentorUsers={Users}
        />
      )}
    </div>
  )
}
