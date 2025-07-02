"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Check,
  Clock,
  MapPin,
  Save,
  UserCheck,
  Users,
  X
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { attendacePayload } from "@/types/globals"
import { AttendancePageSkeleton } from "@/components/(commnon)/Skeleton"
import Link from "next/link"

type Student = {
  prn: string
  user: any
  id: string
  rollNo: number
}

type Slot = {
  class?: {
    students: Student[]
  }
}

const selectdSlot = async (slotId: string) => {
  const response = await axios.get(`/api/classes/timeTable?route=selectdSlot`, {
    params: { slotId }
  })
  return response?.data || []
}

const selectdSlotAttendance = async (
  slotId: string,
  date: string,
  classId: string
) => {
  const response = await axios.get(`/api/attendance?route=specificSlot`, {
    params: { slotId, date, classId }
  })
  return response?.data || []
}

export default function AttendancePage() {
  const { slotId } = useParams()
  const searchParams = useSearchParams()
  const paramsDate = searchParams.get("date")
  const date =
    typeof paramsDate === "string"
      ? paramsDate
      : Array.isArray(paramsDate)
        ? (paramsDate[0] ?? "")
        : ""
  const [attendance, setAttendance] = useState<
    Record<string, "present" | "absent" | "pending">
  >({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bulkRollNumbers, setBulkRollNumbers] = useState("")
  const router = useRouter()

  const todayDate = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  })

  const { data: slot, isLoading: isSlotLoading } = useQuery({
    queryKey: ["slot"],
    queryFn: () => selectdSlot(slotId as string),
    enabled: !!slotId
  })

  const { data: slotAttendance, isLoading: isSlotAttendanceLoading } = useQuery(
    {
      queryKey: ["slotAttendance"],
      queryFn: () =>
        selectdSlotAttendance(slotId as string, date, slot?.classId),
      enabled: !!slotId
    }
  )

  // to make all student absent by default
  useEffect(() => {
    const initialAttendance: Record<string, "present" | "absent" | "pending"> =
      {}

    const attendanceByRollNo: { [key: string]: string } =
      slotAttendance?.attendance || {}

    ;(slot as Slot)?.class?.students.forEach((student: Student) => {
      // If attendance is available, set true if status is "present"
      const rollStatus = attendanceByRollNo[student.rollNo]
      if (rollStatus === "present") {
        initialAttendance[student.id] = "present"
      } else if (rollStatus === "absent") {
        initialAttendance[student.id] = "absent"
      } else {
        initialAttendance[student.id] = "pending"
      }
    })

    setAttendance(initialAttendance)
  }, [slotAttendance, slot])

  const handleAttendanceChange = (
    studentId: string,
    status: "present" | "absent"
  ) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status
    }))
  }

  const updateAllAttendance = (present: boolean) => {
    const allPresentAttendance: Record<string, "present" | "absent"> = {}

    ;(slot as Slot)?.class?.students.forEach((student: Student) => {
      allPresentAttendance[student.id] = present ? "present" : "absent"
    })

    setAttendance(allPresentAttendance)
  }

  const validateAndProcessBulkInput = (input: any) => {
    // Only allow numbers, spaces, and commas
    const validPattern = /^[0-9\s,]+$/
    if (!validPattern.test(input) && input !== "") {
      return false
    }
    return true
  }

  const handleBulkInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (validateAndProcessBulkInput(value)) {
      setBulkRollNumbers(value)
    }
  }

  const processBulkAttendance = () => {
    if (!bulkRollNumbers.trim()) {
      toast.error("Please enter roll numbers")
      return
    }

    // Parse roll numbers from input (split by comma or space, filter empty)
    const rollNumbers = bulkRollNumbers
      .split(/[,\s]+/)
      .map((num) => num.trim())
      .filter((num) => num !== "")
      .map((num) => parseInt(num, 10))

    const validRollNumbers: number[] = []
    const invalidRollNumbers: number[] = []
    const updatedAttendance = { ...attendance }

    rollNumbers.forEach((rollNo) => {
      const student = slot.class.students.find(
        (s: Student) => s.rollNo === rollNo
      )
      if (student) {
        updatedAttendance[student.id] = "present"
        validRollNumbers.push(rollNo)
      } else {
        invalidRollNumbers.push(rollNo)
      }
    })

    setAttendance(updatedAttendance) // update attendance according roll numbers

    // Show feedback
    if (validRollNumbers.length > 0) {
      toast.success(`Marked present: Roll ${validRollNumbers.join(", ")}`)
    }

    if (invalidRollNumbers.length > 0) {
      toast.error(`Invalid roll numbers: ${invalidRollNumbers.join(", ")}`)
    }

    setBulkRollNumbers("")
  }

  const handleSubmit = async () => {
    if (!slot?.class?.students?.length) {
      toast.error("No students available")
      return
    }

    setIsSubmitting(true)

    const attendanceMap: Record<string, string> = {}

    if (slot?.class?.students) {
      slot.class.students.forEach((student: Student) => {
        const status = attendance[student.id]
        attendanceMap[student.rollNo] =
          status === "present" ? "present" : "absent"
      })
    }

    const payload: attendacePayload = {
      classId: slot?.classId,
      slotId,
      subjectId: slot?.subjectId,
      facultyId: slot?.ProxySlot?.[0]?.lecturerId ?? slot?.facultyId,
      courseId: slot?.courseId,
      departmentId: slot?.departmentId,
      universityId: slot?.class?.universityId,
      date,
      todayDate,
      attendance: attendanceMap
    }

    // If attendance is already taken, add ID and original date
    if (slotAttendance) {
      payload.attendanceId = slotAttendance.id
      payload.attendanceDate = slotAttendance.date
      payload.isLock = slotAttendance.isLock
    }

    try {
      const res = await fetch("/api/attendance", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const { error } = await res.json()
        toast.error(error || "Failed to submit attendance")
        return
      }

      toast.success("Attendance submitted successfully!")
      setAttendance({})
      router.push("/dashboard/time-table")
    } catch (error) {
      if (error) toast.error("Error occurred while submitting attendance")
    } finally {
      setIsSubmitting(false)
    }
  }

  const presentCount = Object.values(attendance).filter(
    (v) => v === "present"
  ).length
  const absentCount = Object.values(attendance).filter(
    (v) => v === "absent"
  ).length

  const isAttendanceActionable =
    date === todayDate ||
    (slotAttendance && !Array.isArray(slotAttendance)
      ? !slotAttendance.isLock
      : false)

  return (
    <div className="min-h-screen p-4 md:p-6">
      {isSlotAttendanceLoading ? (
        <AttendancePageSkeleton />
      ) : isSlotLoading ? (
        <div className="bg-muted text-muted-foreground p-4 rounded-xl border border-border shadow-sm text-center font-medium">
          Fetching slot details...
        </div>
      ) : !slot ? (
        <div className="bg-destructive text-destructive-foreground p-4 rounded-xl border border-border shadow-sm text-center font-semibold">
          No slot available
        </div>
      ) : (
        <>
          <div className="px-2 py-1 mb-1 rounded w-fit border border-Dark">
            <Link
              href={"/dashboard/time-table"}
              className="flex items-center text-TextTwo "
            >
              <ArrowLeft size={18} className="mr-2" />
              Back
            </Link>
          </div>
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
              <div className="bg-ColorThree text-white p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                      {slot.title}
                    </h1>
                    <p className="text-blue-100 text-sm lg:text-base">
                      {slot.class.name} ({slot.class.code}) - Semester{" "}
                      {slot.class.semister}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-white border-white/30 self-start lg:self-center"
                  >
                    {slot.tag.toUpperCase()}
                  </Badge>
                </div>
              </div>

              {/* Slot Details */}
              <div className="p-6 bg-gray-50">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Day
                      </p>
                      <p className="font-semibold text-gray-900 capitalize">
                        {slot.day}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
                    <Clock className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Time
                      </p>
                      <p className="font-semibold text-gray-900">
                        {slot.startTime} - {slot.endTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
                    <MapPin className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Location
                      </p>
                      <p className="font-semibold text-gray-900">
                        {slot.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
                    <Users className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Students
                      </p>
                      <p className="font-semibold text-gray-900">
                        {slot.class.students.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Attendance Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 text-sm font-medium">
                        Present
                      </p>
                      <p className="text-2xl font-bold text-green-700">
                        {presentCount}
                      </p>
                    </div>
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-600 text-sm font-medium">Absent</p>
                      <p className="text-2xl font-bold text-red-700">
                        {absentCount}
                      </p>
                    </div>
                    <X className="w-8 h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-sm font-medium">
                        Attendance Rate
                      </p>
                      <p className="text-2xl font-bold text-blue-700">
                        {Math.round(
                          (presentCount / slot.class.students.length) * 100
                        )}
                        %
                      </p>
                    </div>
                    <BookOpen className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bulk Actions Section */}
            {isAttendanceActionable ? (
              <Card className="bg-white shadow-lg border border-gray-200">
                <CardHeader className="bg-blue-50 border-b border-gray-200">
                  <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-blue-600" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>
                    Manage attendance efficiently with bulk operations
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* Make All Present */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-gray-700">
                        Mark All Present
                      </Label>
                      <Button
                        onClick={() => updateAllAttendance(true)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        <UserCheck className="w-4 h-4" />
                        Make All Present
                      </Button>
                    </div>

                    {/* Make All Present */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-gray-700">
                        Mark All Absent
                      </Label>
                      <Button
                        onClick={() => updateAllAttendance(false)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                      >
                        <UserCheck className="w-4 h-4" />
                        Make All Absent
                      </Button>
                    </div>

                    {/* Bulk Roll Number Input */}
                    <div className="space-y-3">
                      <label
                        htmlFor="bulkRollNumbers"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Mark Present by Roll Numbers
                      </label>
                      <div className="flex gap-2">
                        <Input
                          id="bulkRollNumbers"
                          value={bulkRollNumbers}
                          onChange={handleBulkInputChange}
                          placeholder="e.g., 1, 2, 3 or 1 2 3"
                          className="flex-1"
                        />
                        <Button
                          onClick={processBulkAttendance}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4"
                          disabled={!bulkRollNumbers.trim()}
                        >
                          Apply
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Enter roll numbers separated by commas or spaces
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {/* Attendance Table */}
            <Card className="bg-white shadow-lg border border-gray-200">
              <CardHeader className="bg-gray-50 border-b border-gray-200">
                <CardTitle className="text-xl text-gray-800">
                  Student Attendance
                </CardTitle>
                <CardDescription>
                  Mark students as present or absent for this session
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {/* Desktop/Tablet Table View */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 border-b border-gray-200">
                      <tr>
                        <th className="text-left p-4 font-semibold text-gray-700">
                          Roll No.
                        </th>
                        <th className="text-left p-4 font-semibold text-gray-700">
                          Student Name
                        </th>
                        <th className="text-left p-4 font-semibold text-gray-700 hidden md:table-cell">
                          PRN
                        </th>
                        <th className="text-left p-4 font-semibold text-gray-700 hidden lg:table-cell">
                          Email
                        </th>
                        {isAttendanceActionable ? (
                          <th className="text-center p-4 font-semibold text-gray-700">
                            Attendance
                          </th>
                        ) : null}
                      </tr>
                    </thead>
                    <tbody>
                      {[...slot.class.students]
                        .sort((a, b) => a.rollNo - b.rollNo)
                        .map((student: Student) => {
                          const status = attendance[student.id]
                          return (
                            <tr
                              key={student.id}
                              className={`border-b border-gray-100 hover:opacity-90 transition-all duration-300 ${
                                status === "present"
                                  ? "bg-green-50 hover:bg-green-100 border-l-4 border-l-green-500"
                                  : status === "absent"
                                    ? "bg-red-50 hover:bg-red-100 border-l-4 border-l-red-500"
                                    : "bg-yellow-50 hover:bg-yellow-100 border-l-4 border-l-yellow-500"
                              }`}
                            >
                              <td className="p-4">
                                <div className="font-semibold text-gray-900">
                                  {student.rollNo}
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="font-medium text-gray-900">
                                  {student.user.name}
                                </div>
                              </td>
                              <td className="p-4 hidden md:table-cell">
                                <div className="text-gray-700 font-mono text-sm">
                                  {student.prn}
                                </div>
                              </td>
                              <td className="p-4 hidden lg:table-cell">
                                <div className="text-gray-600 text-sm">
                                  {student.user.email}
                                </div>
                              </td>
                              {isAttendanceActionable ? (
                                <td className="p-4 text-center">
                                  <div className="flex items-center justify-center gap-3">
                                    <Checkbox
                                      checked={status === "present"}
                                      onCheckedChange={(checked) =>
                                        handleAttendanceChange(
                                          student.id,
                                          checked === true
                                            ? "present"
                                            : "absent"
                                        )
                                      }
                                      className="w-5 h-5 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                                    />
                                    <span
                                      className={`text-sm font-medium ${
                                        status === "present"
                                          ? "text-green-600"
                                          : status === "absent"
                                            ? "text-red-600"
                                            : "text-yellow-500"
                                      }`}
                                    >
                                      {status === "present"
                                        ? "Present"
                                        : status === "absent"
                                          ? "Absent"
                                          : "Pending"}
                                    </span>
                                  </div>
                                </td>
                              ) : null}
                            </tr>
                          )
                        })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="block sm:hidden">
                  <div className="space-y-3 p-4">
                    {slot.class.students.map((student: Student) => {
                      const status = attendance[student.id]
                      return (
                        <div
                          key={student.id}
                          className={`rounded-lg p-4 border-l-4 transition-all duration-300 ${
                            status === "present"
                              ? "bg-green-50 hover:bg-green-100 border-l-4 border-l-green-500"
                              : status === "absent"
                                ? "bg-red-50 hover:bg-red-100 border-l-4 border-l-red-500"
                                : "bg-yellow-50 hover:bg-yellow-100 border-l-4 border-l-yellow-500"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            {/* Student Info */}
                            <div className="flex items-center gap-3 flex-1">
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-gray-900 text-lg">
                                  {student.user.name}
                                </div>
                                <div className="text-sm text-gray-600">
                                  Roll No:{" "}
                                  <span className="font-medium">
                                    {student.rollNo}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Attendance Toggle */}
                            {isAttendanceActionable ? (
                              <div className="flex flex-col items-center gap-2 ml-4">
                                <Checkbox
                                  checked={status === "present"}
                                  onCheckedChange={(checked) =>
                                    handleAttendanceChange(
                                      student.id,
                                      checked === true ? "present" : "absent"
                                    )
                                  }
                                  className="w-6 h-6 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                                />
                                <span
                                  className={`text-xs font-semibold ${
                                    status === "present"
                                      ? "text-green-600"
                                      : status === "absent"
                                        ? "text-red-600"
                                        : "text-yellow-500"
                                  }`}
                                >
                                  {status === "present"
                                    ? "Present"
                                    : status === "absent"
                                      ? "Absent"
                                      : "Pending"}
                                </span>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            {isAttendanceActionable ? (
              <div className="flex justify-center pb-6">
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`px-8 py-3 text-lg font-semibold transition-all duration-300 ${
                    isSubmitting
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-blue-600  hover:from-blue-700 "
                  } text-white shadow-lg hover:shadow-xl transform hover:scale-105`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="w-5 h-5" />
                      Submit Attendance
                    </div>
                  )}
                </Button>
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  )
}
