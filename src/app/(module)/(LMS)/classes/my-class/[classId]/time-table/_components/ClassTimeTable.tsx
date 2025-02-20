"use client"

import React, { useContext, useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Calendar, Clock, Plus, X, Edit2 } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { UserContext } from "@/context/user"
import axios from "axios"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger
} from "@/components/ui/select"
import { useParams } from "next/navigation"
import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
import toast from "react-hot-toast"
import { SelectedSlot, TimeTableSlot } from "@/types/globals"
import Left from "@/components/Icons/Left"
import Link from "next/link"
import { DaySchedule, TableSlotCell } from "./TimeTableComponents"

async function fetchSubjects(courseId: string) {
  const response = await axios.get(`/api/subjects?courseId=${courseId}`)
  return response.data.subjects || []
}

const fetchSubjectfaculties = async (classId: string) => {
  const response = await axios.get(
    `/api/classes/timeTable?route=facultyDetails`,
    {
      params: {
        classId
      }
    }
  )
  return response?.data || []
}

const fetchTimeTableSlots = async (classId: string) => {
  const response = await axios.get(
    `/api/classes/timeTable?route=timeTableSlots`,
    {
      params: {
        classId
      }
    }
  )
  return response?.data || []
}

export default function ClassTimeTable({
  isMyClass = true
}: {
  isMyClass?: boolean
}) {
  const { classId } = useParams()
  const [timeSlots, setTimeSlots] = useState<{
    [IntClassId: number]: string[]
  }>({})
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedSlots, setSelectedSlots] = useState<SelectedSlot>({})
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null)
  const [currentSubject, setCurrentSubject] = useState("Non Academic")
  const [isEditing, setIsEditing] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isSubmittingTimeTable, setIsSubmittingTimeTable] = useState(false)
  const { user } = useContext(UserContext)

  const courseId = user?.courseId
  const departmentId = user?.departmentId
  const IntClassId = Number(classId)
  const userRoles = user?.roles?.map((role: any) => role.id) || []
  const isCoordinator = userRoles.includes(5)

  const { data: subjects } = useQuery({
    queryKey: ["subjects", user?.courseId],
    queryFn: () => fetchSubjects(String(user?.courseId)),
    enabled: !!user?.courseId
  })

  const { data: faculties } = useQuery({
    queryKey: ["faculties", classId],
    queryFn: () => fetchSubjectfaculties(classId as string),
    enabled: !!classId
  })

  const { data: timeTableSlots } = useQuery<TimeTableSlot[]>({
    queryKey: ["ExistingSlots", classId],
    queryFn: () => fetchTimeTableSlots(classId as string),
    enabled: !!classId
  })

  const handleSubjectSelectChange = (value: string) => {
    setCurrentSubject(value)
    setSelectedFaculty(null)
  }

  const handleFacultySelectChange = (value: string) => {
    setSelectedFaculty(value)
  }

  const matchedFaculty = faculties?.filter((faculty: any) =>
    faculty.subject.some((subject: any) => subject.name === currentSubject)
  )

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ]

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 769)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (!timeTableSlots || timeTableSlots.length === 0) return
    // Group time slots by classId
    const updatedTimeSlots = timeTableSlots.reduce((acc: any, slot: any) => {
      const classId = slot.classId
      const newSlot = `${slot.fromTime} - ${slot.toTime}`

      // Initialize the array for the classId if not present
      if (!acc[classId]) acc[classId] = []

      // Add unique time slots to the classId
      if (!acc[classId].includes(newSlot)) acc[classId].push(newSlot)

      return acc
    }, {})

    // Create an object to store the slots details
    const updatedSelectedSlots = timeTableSlots?.reduce(
      (acc: any, slot: any) => {
        const key = `${slot.day},${slot.fromTime} - ${slot.toTime}`

        let faculty = null
        if (slot.facultyId) {
          const facultyData = faculties?.find(
            (f: any) => f.id === slot.facultyId
          )
          faculty = facultyData?.user?.name
        }

        // Initialize the object for the classId if not present
        if (!acc[slot.classId]) acc[slot.classId] = {}

        // Add the slot details under the classId
        acc[slot.classId][key] = {
          subject: slot.title,
          faculty
        }
        return acc
      },
      {}
    )

    setTimeSlots(updatedTimeSlots)
    setSelectedSlots(updatedSelectedSlots)
  }, [timeTableSlots, faculties])

  useEffect(() => {
    const storedSlots = localStorage.getItem("timeSlots")
    const storedSelectedSlots = localStorage.getItem("selectedSlots")

    try {
      setTimeSlots(storedSlots ? JSON.parse(storedSlots) : {})
      setSelectedSlots(
        storedSelectedSlots ? JSON.parse(storedSelectedSlots) : {}
      )
    } catch (e) {
      console.error("Error parsing localStorage data:", e)
      setTimeSlots({})
      setSelectedSlots({})
    }
  }, [])

  const saveToLocalStorage = (slots: any, selected: any) => {
    try {
      localStorage.setItem("timeSlots", JSON.stringify(slots))
      localStorage.setItem("selectedSlots", JSON.stringify(selected))
    } catch (e) {
      console.error("Failed to save to storage:", e)
    }
  }

  const addTimeSlot = () => {
    if (!startTime || !endTime || !IntClassId) {
      alert("Please provide both start and end times.")
      return
    }

    const newSlot = `${startTime} - ${endTime}`

    // Convert a time string like "13:00" into a comparable numeric value
    const parseTime = (time: any) => {
      const [hours, minutes] = time.split(":").map(Number)
      return hours * 60 + minutes
    }

    const currentClassSlots = timeSlots[IntClassId] || []

    if (!currentClassSlots.includes(newSlot)) {
      const updatedClassSlots = [...currentClassSlots, newSlot].sort((a, b) => {
        const timeA = parseTime(a.split(" - ")[0])
        const timeB = parseTime(b.split(" - ")[0])
        return timeA - timeB
      })

      // Update timeSlots for the specific classId
      const updatedTimeSlots = { ...timeSlots, [IntClassId]: updatedClassSlots }

      setTimeSlots(updatedTimeSlots)
      saveToLocalStorage(updatedTimeSlots, selectedSlots)
    }

    setStartTime("")
    setEndTime("")
    setIsDialogOpen(false)
  }

  const handleCellClick = (
    day: string,
    timeSlot: any,
    IntClassId: number,
    isDelete = false
  ) => {
    const key = `${day},${timeSlot}`

    // Ensure the classId exists in the selectedSlots object
    const currentClassSlots = selectedSlots[IntClassId] || {}

    if (isDelete) {
      const updatedClassSlots = { ...currentClassSlots }
      delete updatedClassSlots[key]

      // Update selectedSlots with the modified class slots
      const updatedSelectedSlots = {
        ...selectedSlots,
        [IntClassId]: updatedClassSlots
      }

      setSelectedSlots(updatedSelectedSlots)
      saveToLocalStorage(timeSlots, updatedSelectedSlots)
    } else if (currentSubject && isEditing) {
      const updatedClassSlots = {
        ...currentClassSlots,
        [key]: {
          subject: currentSubject,
          faculty: selectedFaculty
        }
      }

      // Update selectedSlots with the modified class slots
      const updatedSelectedSlots = {
        ...selectedSlots,
        [IntClassId]: updatedClassSlots
      }

      setSelectedSlots(updatedSelectedSlots)
      saveToLocalStorage(timeSlots, updatedSelectedSlots)
    }
  }

  const removeTimeSlot = (IntClassId: number, index: number) => {
    // Ensure the classId exists in timeSlots
    if (!timeSlots[IntClassId]) return

    // Get the slot to be removed
    const slotToRemove = timeSlots[IntClassId][index]

    // Remove the time slot from the timeSlots for the specified IntClassId
    const updatedSlots = {
      ...timeSlots,
      [IntClassId]: timeSlots[IntClassId].filter((_, i) => i !== index)
    }

    // Remove all selected slots associated with this time slot
    const updatedSelected = { ...selectedSlots }
    days.forEach((day) => {
      const key = `${day},${slotToRemove}`
      if (updatedSelected[IntClassId]) {
        delete updatedSelected[IntClassId][key]

        // If the selectedSlots for this IntClassId becomes empty, delete the IntClassId entry
        if (Object.keys(updatedSelected[IntClassId]).length === 0) {
          delete updatedSelected[IntClassId]
        }
      }
    })

    setTimeSlots(updatedSlots)
    setSelectedSlots(updatedSelected)
    saveToLocalStorage(updatedSlots, updatedSelected)
  }

  const handleTimeTableSubmit = async () => {
    setIsSubmittingTimeTable(true)
    try {
      const timeTableData = {
        courseId,
        classId: IntClassId,
        departmentId
      }

      if (
        !timeTableData.courseId ||
        !timeTableData.classId ||
        !timeTableData.departmentId
      ) {
        toast.error(
          "Please ensure course, class, and department details are available."
        )
        return
      }

      const slotsData = Object.entries(selectedSlots[IntClassId] || {}).map(
        ([key, value]: [string, any]) => {
          const [day, timeSlot] = key.split(",")
          const [fromTime, toTime] = timeSlot.split(" - ").map((t) => t.trim())
          const { subject, faculty } = value

          // Find subjectId from subjects array
          const subjectData = subjects.find((s: any) => s.name === subject)
          const subjectId = subjectData ? subjectData.id : null

          console.log("faculty", faculty)
          console.log("faculties", faculties)

          let facultyId = null
          if (faculty) {
            const facultyData = faculties.find(
              (f: any) => f.user.name === faculty
            )
            facultyId = facultyData?.id
          }

          return {
            day,
            fromTime,
            toTime,
            title: subject,
            subjectId,
            facultyId
          }
        }
      )

      // Validate slots data
      if (
        slotsData.some(
          (slot) => !slot.day || !slot.fromTime || !slot.toTime || !slot.title
        )
      ) {
        toast.error(
          "Some slots are missing subject information. Please review your selection."
        )
        return
      }

      // API call to save timetable and slots
      const response = await fetch(`/api/classes/timeTable`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timeTableData,
          slotsData
        })
      })

      if (response.ok) {
        toast.success("Timetable and slots created successfully!")
        localStorage.removeItem("timeSlots")
        localStorage.removeItem("selectedSlots")
      } else {
        toast.error("Failed to create timetable and slots. Please try again.")
      }
    } catch (error: any) {
      console.log("Error submitting timetable:", error.message)
      toast.error("An error occurred while submitting the timetable.")
    } finally {
      setIsSubmittingTimeTable(false)
    }
  }

  return (
    <div className="min-h-screen ">
      {isMyClass && (
        <Link
          className="flex items-center justify-center ml-4 gap-2 border-2 border-black text-black w-32 font-semibold rounded-lg py-2 transition-transform transform hover:scale-105 hover:bg-gray-100"
          href={`/classes/my-class/${classId}`}
        >
          <Left /> Back
        </Link>
      )}
      <div className={`mx-auto p-4 ${!isMobile ? "max-w-7xl" : "max-w-lg"}`}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-TextTwo">Class Time Table</h1>
          {isCoordinator && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-ColorThree hover:bg-ColorTwo">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90%] max-w-md mx-auto bg-lamaSkyLight">
                <DialogHeader>
                  <DialogTitle>Add Time Slot</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 p-4 ">
                  <div>
                    <label className="text-sm font-medium text-TextTwo">
                      Start Time
                    </label>
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-TextTwo">
                      End Time
                    </label>
                    <Input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-ColorThree hover:bg-ColorTwo"
                    onClick={addTimeSlot}
                  >
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {isCoordinator && (
          <div className="mb-6 flex max-[768px]:flex-col gap-5">
            {/* Toggle Edit Button */}
            <Button
              onClick={() => setIsEditing(!isEditing)}
              className={`w-full md:w-auto ${
                isEditing ? "bg-ColorTwo" : "bg-ColorThree"
              } hover:opacity-90`}
            >
              {isEditing ? (
                <>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Cancel Assigning
                </>
              ) : (
                <>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Begin Assigning
                </>
              )}
            </Button>

            {/* Dropdown for Selecting Subjects */}
            {isEditing && (
              <div className="flex max-[425px]:flex-col gap-5 justify-evenly">
                <div className="w-full sm:w-auto">
                  <Select
                    onValueChange={handleSubjectSelectChange}
                    defaultValue="Non Academic"
                  >
                    <SelectTrigger className="w-full sm:w-[180px] px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300">
                      <span className="text-black">
                        {currentSubject || "Select a class"}
                      </span>
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {subjects?.map((subject: any) => (
                        <SelectItem
                          key={subject.id}
                          value={subject.name}
                          className="cursor-pointer"
                        >
                          {subject.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="Break" className="cursor-pointer">
                        Break
                      </SelectItem>
                      <SelectItem
                        value="Non Academic"
                        className="cursor-pointer"
                      >
                        Non Academic
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {matchedFaculty && (
                  <Select
                    onValueChange={handleFacultySelectChange}
                    disabled={matchedFaculty.length === 0}
                  >
                    <SelectTrigger className="w-full sm:w-[180px] px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300">
                      <span className="text-black">
                        {selectedFaculty
                          ? selectedFaculty
                          : matchedFaculty.length > 0
                            ? "Select Faculty"
                            : "No faculty available"}
                      </span>
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {matchedFaculty.map((faculty: any) => (
                        <SelectItem
                          key={faculty.user.id}
                          value={faculty.user.name}
                          className="cursor-pointer"
                        >
                          {faculty.user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}
          </div>
        )}

        {Object.keys(timeSlots).length === 0 ? (
          <Card className="p-8 text-center bg-white/50 backdrop-blur-sm">
            <Calendar className="h-12 w-12 mx-auto text-ColorThree opacity-50" />
            <p className="mt-4 text-TextTwo">No time slots added yet.</p>
            <Button
              className="mt-4 bg-ColorThree hover:bg-ColorTwo"
              onClick={() => setIsDialogOpen(true)}
            >
              Add Your First Time Slot
            </Button>
          </Card>
        ) : isMobile ? (
          // Mobile Layout
          <div className="space-y-2">
            {days.map((day) => (
              <DaySchedule
                key={day}
                day={day}
                isCoordinator={isCoordinator}
                IntClassId={IntClassId}
                timeSlots={timeSlots[IntClassId] || []} // Fetch slots for the specific classId
                selectedSlots={selectedSlots} // Fetch selected slots for the specific classId
                onCellClick={handleCellClick}
                isEditing={isEditing}
                removeTimeSlot={removeTimeSlot}
                currentSubject={currentSubject}
                selectedFaculty={selectedFaculty || ""}
              />
            ))}
          </div>
        ) : (
          // Desktop Layout
          <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-lamaSky">
                  <TableHead className="text-TextTwo text-center">
                    Time Slot
                  </TableHead>
                  {days.map((day) => (
                    <TableHead key={day} className="text-TextTwo text-center">
                      {day}
                    </TableHead>
                  ))}
                  {isCoordinator && (
                    <TableHead className="text-TextTwo w-10 text-center">
                      Actions
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeSlots[IntClassId]?.map(
                  (slot: string, rowIndex: number) => (
                    <TableRow key={`${IntClassId}-${rowIndex}`}>
                      <TableCell className="font-medium text-TextTwo whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-ColorThree" />
                          {slot}
                        </div>
                      </TableCell>
                      {days.map((day) => (
                        <TableSlotCell
                          key={`${IntClassId}-${day}-${slot}`}
                          selected={
                            selectedSlots[IntClassId]?.[`${day},${slot}`]
                          } // Access slots specific to the classId
                          onSelect={() =>
                            handleCellClick(day, slot, IntClassId)
                          }
                          onDelete={() =>
                            handleCellClick(day, slot, IntClassId, true)
                          }
                          currentSubject={currentSubject}
                          selectedFaculty={selectedFaculty}
                          isEditing={isEditing}
                          isCoordinator={isCoordinator}
                        />
                      ))}
                      {isCoordinator && (
                        <TableCell>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => removeTimeSlot(IntClassId, rowIndex)}
                            className="rounded-full transition-all duration-200 text-red-500 hover:bg-red-500 hover:text-white "
                          >
                            <X />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>
        )}
        {isCoordinator && (
          <div className="">
            <ButtonV1
              icon={Plus}
              label={isSubmittingTimeTable ? "Submitting..." : "submit"}
              disabled={
                !selectedSlots[IntClassId] ||
                Object.keys(selectedSlots[IntClassId]).length === 0 ||
                isSubmittingTimeTable
              }
              onClick={() => handleTimeTableSubmit()}
            />
          </div>
        )}
      </div>
    </div>
  )
}
