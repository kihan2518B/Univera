import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import axios from "axios"
import toast from "react-hot-toast"
import { Prisma } from "@prisma/client"
import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
import { X } from "lucide-react"

type FacultyWithRelations = Prisma.FacultyGetPayload<{
  include: {
    user: {
      include: {
        roles: true
      }
    }
    class: true
  }
}>

interface ClassFacultiesProps {
  faculties: FacultyWithRelations[]
  classId: number
  refetch: () => void
}

export default function ClassFaculties({
  faculties,
  classId,
  refetch
}: ClassFacultiesProps) {
  const [selectedFaculties, setSelectedFaculties] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [removing, setRemoving] = useState<string | null>(null)

  const assignedFaculties = faculties.filter((faculty) =>
    faculty.class?.some((cls: any) => cls.id === classId)
  )

  const unassignedFaculties = faculties.filter(
    (faculty) => !faculty.class?.some((cls: any) => cls.id === classId)
  )

  const handleCheckboxChange = (facultyId: string) => {
    setSelectedFaculties((prev) =>
      prev.includes(facultyId)
        ? prev.filter((id) => id !== facultyId)
        : [...prev, facultyId]
    )
  }

  const handleRemoveFaculty = async (facultyId: string) => {
    try {
      setRemoving(facultyId)
      const res = await axios.patch(
        `/api/classes/${classId}?removeFaculty=true`,
        { removedFaultyId: facultyId }
      )
      if (res.status === 200) {
        toast.success(res.data.message)
        refetch()
      } else {
        toast.error(res.data.message)
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Failed to remove faculty")
      }
    } finally {
      setRemoving(null)
    }
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)
      const res = await axios.patch(
        `/api/classes/${classId}?assignFaculty=true`,
        {
          classId,
          facultyIds: selectedFaculties
        }
      )
      if (res.status === 200) {
        toast.success(res.data.message)
        refetch()
        setSelectedFaculties([])
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Something went wrong")
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
      <section className="mb-12">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-Dark">
          Assigned Faculties
        </h2>
        {assignedFaculties.length === 0 ? (
          <p className="text-sm text-gray-500">No faculty assigned</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {assignedFaculties.map((faculty) => (
              <Card
                key={faculty.id}
                className="relative border-Primary border-2 overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-4 sm:p-5">
                  <button
                    onClick={() => handleRemoveFaculty(faculty.id)}
                    disabled={removing === faculty.id}
                    className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-red-50 transition-colors duration-200 text-ColorTwo"
                  >
                    <X size={20} />
                  </button>
                  <div className="pr-8">
                    <h3 className="font-semibold text-base sm:text-lg mb-2 text-TextTwo line-clamp-1">
                      {faculty.user.name}
                    </h3>
                    <p className="text-xs sm:text-sm mb-3 text-Dark line-clamp-1">
                      {faculty.user.email}
                    </p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {faculty.user.roles.map((role: any) => (
                        <span
                          key={role.id}
                          className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium text-Dark bg-ColorOne whitespace-nowrap"
                        >
                          {role.rolename}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex flex-col sm:flex-row w-full items-start sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-Dark">
            Available Faculties
          </h2>
          {selectedFaculties.length > 0 && (
            <ButtonV1
              varient="outline"
              className="rounded-md text-base sm:text-lg py-2 sm:py-3 px-4 sm:px-6 whitespace-nowrap"
              disabled={submitting}
              onClick={handleSubmit}
              label={
                submitting
                  ? "Assigning..."
                  : `Assign Faculty (${selectedFaculties.length})`
              }
            />
          )}
        </div>
        {faculties.length === 0 ? (
          <p className="text-sm text-gray-500">No faculty available</p>
        ) : unassignedFaculties.length === 0 ? (
          <p className="text-sm text-gray-500">No faculty remain to assign</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {unassignedFaculties.map((faculty) => (
              <Card
                key={faculty.id}
                className="hover:shadow-lg transition-shadow duration-300 border-Primary border-2"
              >
                <CardContent className="p-4 sm:p-5 flex items-start space-x-3 sm:space-x-4">
                  <Checkbox
                    id={`faculty-${faculty.id}`}
                    checked={selectedFaculties.includes(faculty.id)}
                    onCheckedChange={() => handleCheckboxChange(faculty.id)}
                    className="mt-1 text-ColorTwo border-ColorTwo"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base sm:text-lg mb-2 text-TextTwo line-clamp-1">
                      {faculty.user.name}
                    </h3>
                    <p className="text-xs sm:text-sm mb-3 text-Dark line-clamp-1">
                      {faculty.user.email}
                    </p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {faculty.user.roles.map((role: any) => (
                        <span
                          key={role.id}
                          className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium text-Dark bg-ColorOne whitespace-nowrap"
                        >
                          {role.rolename}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
