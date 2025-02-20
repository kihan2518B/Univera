"use client"
import React, { useState } from "react"
import axios from "axios"
import { Prisma, Student } from "@prisma/client"
import toast from "react-hot-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
import { X, Search, User, Hash, IdCard } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

type StudentWithRelation = Prisma.StudentGetPayload<{
  include: {
    user: true
  }
}>

interface ClassStudentsProps {
  classId: number
  Students: StudentWithRelation[]
  refetch: () => void
}

export default function ClassStudents({
  classId,
  Students,
  refetch
}: ClassStudentsProps) {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [removing, setRemoving] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  if (!Students) {
    return null
  }
  if (Students.length === 0) {
    return <>No students data found. Add some</>
  }
  const assignedStudents = Students.filter(
    (student: Student) => student.classId === classId
  )

  const unassignedStudents = Students.filter((student: StudentWithRelation) => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch =
      student.user.name.toLowerCase().includes(searchLower) ||
      student.user.email.toLowerCase().includes(searchLower) ||
      student.prn?.toLowerCase().includes(searchLower) ||
      student.rollNo?.toString().includes(searchLower)
    return student.classId !== classId && matchesSearch
  })

  const handleCheckboxChange = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    )
  }

  const handleRemoveStudent = async (studentId: string) => {
    try {
      setRemoving(studentId)
      const res = await axios.patch(
        `/api/classes/${classId}?removeStudent=true`,
        { removedStudentId: studentId }
      )
      if (res.status === 200) {
        toast.success(res.data.message)
        refetch()
      } else {
        toast.error(res.data.message)
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Failed to remove Student")
      }
    } finally {
      setRemoving(null)
    }
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)
      const res = await axios.patch(
        `/api/classes/${classId}?assignStudent=true`,
        {
          classId,
          studentIds: selectedStudents
        }
      )
      if (res.status === 200) {
        toast.success(res.data.message)
        refetch()
        setSelectedStudents([])
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Something went wrong")
      }
    } finally {
      setSubmitting(false)
    }
  }

  const StudentCard = ({
    student,
    isAssigned = false
  }: {
    student: StudentWithRelation
    isAssigned?: boolean
  }) => (
    <Card
      className={`relative border-Primary border-2 overflow-hidden hover:shadow-lg transition-shadow duration-300 ${!isAssigned && "hover:border-ColorTwo"}`}
    >
      <CardContent
        className={`p-4 sm:p-5 ${!isAssigned && "flex items-start space-x-3 sm:space-x-4"}`}
      >
        {!isAssigned && (
          <Checkbox
            id={`student-${student.id}`}
            checked={selectedStudents.includes(student.id)}
            onCheckedChange={() => handleCheckboxChange(student.id)}
            className="mt-1 text-ColorTwo border-ColorTwo"
          />
        )}
        {isAssigned && (
          <button
            onClick={() => handleRemoveStudent(student.id)}
            disabled={removing === student.id}
            className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-red-50 transition-colors duration-200 text-ColorTwo"
          >
            <X size={20} />
          </button>
        )}
        <div className={`${isAssigned ? "pr-8" : "flex-1 min-w-0"}`}>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2">
              <User size={16} className="text-TextTwo" />
              <h3 className="font-semibold text-base sm:text-lg text-TextTwo line-clamp-1">
                {student.user.name}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-Dark line-clamp-1 pl-6">
              {student.user.email}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {student.prn && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 text-TextTwo"
                >
                  <IdCard size={14} />
                  <span>PRN: {student.prn}</span>
                </Badge>
              )}
              {student.rollNo && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 text-TextTwo"
                >
                  <Hash size={14} />
                  <span>Roll: {student.rollNo}</span>
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
      <section className="mb-12">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-Dark">
          Assigned Students
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {assignedStudents.map((student: StudentWithRelation) => (
            <StudentCard key={student.id} student={student} isAssigned={true} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex flex-col md:flex-row w-full items-start md:items-center justify-between mb-6 gap-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 w-full">
            <h2 className="text-xl sm:text-2xl font-bold text-Dark whitespace-nowrap">
              Available Students
            </h2>
            <div className="relative w-full max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                type="text"
                placeholder="Search by name, email, or PRN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full border-Primary focus:ring-2 focus:ring-ColorTwo focus:border-ColorThree"
              />
            </div>
          </div>
          {selectedStudents.length > 0 && (
            <ButtonV1
              varient="outline"
              className="rounded-md text-base sm:text-lg py-2 sm:py-3 px-4 sm:px-6 whitespace-nowrap"
              disabled={submitting}
              onClick={handleSubmit}
              label={
                submitting
                  ? "Assigning..."
                  : `Assign Student (${selectedStudents.length})`
              }
            />
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {unassignedStudents.map((student: StudentWithRelation) => (
            <StudentCard
              key={student.id}
              student={student}
              isAssigned={false}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
