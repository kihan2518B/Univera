"use client"

import React, { useContext, useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { UserContext } from "@/context/user"
import toast from "react-hot-toast"
import { X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { AttendanceHeader } from "./_components/AttendanceHeader"
import { AttendanceStats } from "./_components/AttendanceStats"
import { AttendanceTable } from "./_components/AttendanceTable"
import { AttendanceControls } from "./_components/AttendanceControls"
import { AttendanceActions } from "./_components/AttendanceActions"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

async function fetchStudents(classId: number) {
  try {
    const response = await fetch(`/api/classes/${classId}?onlyStudents=${true}`)
    if (!response.ok) {
      toast.error("Failed to fetch students")
    }
    const data = await response.json()
    // Return empty array if no students found instead of undefined
    return data?.Class?.students || []
  } catch (error) {
    console.log("Error fetching students:", error)
    // Return empty array on error instead of undefined
    return []
  }
}

export default function AttendancePage() {
  const { user } = useContext(UserContext)
  const searchParams = useSearchParams()
  const existingClassID = Number(searchParams.get("id"))
  const existingClassDate = searchParams.get("date")
  const classId = 1
  const [attendance, setAttendance] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(false)
  const [rollNumbersInput, setRollNumbersInput] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const roles = user?.roles?.map((role: any) => role.id) || []
  const canUsePage = roles.includes(4)

  const {
    data: students,
    error,
    refetch,
    isLoading
  } = useQuery({
    queryKey: ["classes", classId, user?.id],
    queryFn: () =>
      classId && user?.id
        ? fetchStudents(Number(classId))
        : Promise.resolve([]),
    enabled: !!classId && !!user?.id
  })

  // Update attendance state with default "absent" for all students
  useEffect(() => {
    if (
      existingClassID ||
      existingClassDate ||
      students.length === 0 ||
      Object.keys(attendance).length > 0
    ) {
      return
    }

    const initialAttendance = students.reduce(
      (acc: Record<string, boolean>, student: any) => {
        acc[student.id] = false
        return acc
      },
      {}
    )

    setAttendance(initialAttendance)
  }, [students?.length, existingClassID, existingClassDate, attendance])

  useEffect(() => {
    const fetchAnnouncementDetails = async () => {
      if (!existingClassID) return

      setLoading(true)
      try {
        const response = await fetch(
          `/api/attendance?classId=${existingClassID}&date=${existingClassDate}`
        )
        if (!response.ok) {
          throw new Error("Failed to fetch the announcements")
        } else {
          const data = await response.json()

          const attendanceMap: Record<string, boolean> = {}
          data.forEach((record: any) => {
            attendanceMap[record.studentId] = record.status === "present"
          })
          setAttendance(attendanceMap)
        }
      } catch (error) {
        if (error) toast.error("Failed to fetch the announcements")
      } finally {
        setLoading(false)
      }
    }

    fetchAnnouncementDetails()
  }, [existingClassID, existingClassDate])

  const handleToggleAttendance = (studentId: string) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: !prev[studentId]
    }))
  }

  const handleMarkAllPresent = () => {
    if (!students.length) {
      toast.error("No students available")
      return
    }
    const allPresent: Record<string, boolean> = {}
    students.forEach((student: any) => {
      allPresent[student.id] = true
    })
    setAttendance(allPresent)
    toast.success("Marked all students present")
  }

  const handleMarkAllAbsent = () => {
    if (!students.length) {
      toast.error("No students available")
      return
    }
    const allPresent: Record<string, boolean> = {}
    students.forEach((student: any) => {
      allPresent[student.id] = false
    })
    setAttendance(allPresent)
    toast.success("Marked all students absent")
  }

  const handleBatchAttendance = (status: boolean) => {
    if (!rollNumbersInput.trim()) {
      toast.error("Please enter roll numbers")
      return
    }

    if (!/^[\d,\s]+$/.test(rollNumbersInput)) {
      toast.error("Only numbers, commas, and spaces are allowed")
      return
    }

    const rollNumbers = rollNumbersInput
      .split(/[,\s]+/)
      .filter(Boolean)
      .map(Number)

    const studentRollNumbers = new Set(
      students.map((student: any) => student.rollNo)
    )
    const invalidRollNumbers = rollNumbers.filter(
      (rollNo) => !studentRollNumbers.has(rollNo)
    )

    if (invalidRollNumbers.length) {
      toast.error(`Invalid roll numbers: ${invalidRollNumbers.join(", ")}`)
      return
    }

    const updatedAttendance = { ...attendance }
    students.forEach((student: any) => {
      if (rollNumbers.includes(student.rollNo)) {
        updatedAttendance[student.id] = status
      }
    })

    setAttendance(updatedAttendance)
    toast.success(
      `Marked ${status ? "present" : "absent"} for entered roll numbers`
    )
    setRollNumbersInput("")
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!students.length) {
      toast.error("No students available")
      return
    }

    setLoading(true)

    const attendanceData = Object.entries(attendance)
      .map(([studentId, checked]) => {
        const student = students.find((s: any) => s.id === studentId)
        if (!student) return null

        return {
          studentId,
          rollNo: student.rollNo,
          classId,
          slotId: 1,
          semester: student.semester,
          status: checked ? "present" : "absent",
          date: new Date().toISOString(),
          facultyId: user?.id,
          subjectId: 1,
          courseId: student.courseId,
          departmentId: student.departmentId,
          universityId: student.universityId
        }
      })
      .filter(Boolean)

    if (!attendanceData.length) {
      toast.error("No attendance data to submit")
      setLoading(false)
      return
    }

    try {
      const response = await fetch(
        `/api/attendance${existingClassID ? `?id=${existingClassID}&date=${existingClassDate}&canUsePage=${canUsePage}` : `?canUsePage=${canUsePage}`}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(attendanceData)
        }
      )

      if (response.status === 401) {
        toast.error("You are not allowed to create or modify attendance")
        return
      }

      if (!response.ok) {
        toast.error("Failed to submit attendance")
        return
      }

      toast.success("Attendance submitted successfully!")
      setAttendance({})
      if (existingClassID) router.push(`/attendance`)
    } catch (error) {
      if (error) toast.error("Error occurred while submitting attendance")
    } finally {
      setLoading(false)
    }
  }

  console.log("attendance: ", attendance)

  const filteredStudents = students?.filter(
    (student: any) =>
      student.rollNo.toString().includes(searchQuery) ||
      student.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-ColorThree" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <X className="w-12 h-12 text-red-500" />
        <p className="text-lg font-medium text-gray-900">
          Error loading students
        </p>
        <Button onClick={() => refetch()} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  if (!canUsePage && user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <X className="w-12 h-12 text-red-500" />
        <p className="text-lg font-medium text-gray-900">
          You do not have access to this page.
        </p>
      </div>
    )
  }

  const totalStudents = students?.length
  const presentCount = Object.values(attendance).filter(Boolean).length
  const absentCount = totalStudents - presentCount
  const attendancePercentage = totalStudents
    ? (presentCount / totalStudents) * 100
    : 0

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <Card className="mx-auto max-w-7xl shadow-lg">
        <CardHeader className="space-y-6 pb-8 border-b">
          <AttendanceHeader
            studentsCount={totalStudents}
            onMarkAllPresent={handleMarkAllPresent}
            onMarkAllAbsent={handleMarkAllAbsent}
          />
          <AttendanceStats
            totalStudents={totalStudents}
            presentCount={presentCount}
            absentCount={absentCount}
            attendancePercentage={attendancePercentage}
          />
        </CardHeader>

        <CardContent className="space-y-8 pt-8">
          <AttendanceControls
            studentsCount={totalStudents}
            searchQuery={searchQuery}
            rollNumbersInput={rollNumbersInput}
            onRollNumbersChange={setRollNumbersInput}
            onBatchAttendance={handleBatchAttendance}
            onSearchChange={setSearchQuery}
          />

          <AttendanceTable
            students={filteredStudents}
            attendance={attendance}
            onToggleAttendance={handleToggleAttendance}
            searchQuery={searchQuery}
            onClearSearch={() => setSearchQuery("")}
          />

          <AttendanceActions
            loading={loading}
            studentsCount={totalStudents}
            hasAttendance={Object.keys(attendance).length > 0}
            onClear={() => {
              setAttendance({})
              toast.success("Attendance cleared")
            }}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </div>
  )
}
