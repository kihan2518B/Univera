"use client"

import React, { useContext, useState, useRef, useEffect } from "react"
import { BookOpen, Coffee, FlaskConical, Users } from "lucide-react"
import axios from "axios"
import { UserContext } from "@/context/user"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import toast from "react-hot-toast"
import { TimeTableSlot } from "@/types/globals"
import TimetableHeader from "./TimetableHeader"
import TimetableGrid from "./TimetableGrid"
import SlotDialog from "./SlotDialog"

// Helper functions for styling
const getBackgroundColor = (tag: string) => {
  switch (tag) {
    case "Lecture":
      return "#E3F2FD" // Soft blue
    case "Lab":
      return "#F3E5F5" // Soft purple
    case "Seminar":
      return "#FFF8E1" // Soft yellow
    case "Break":
      return "#CBF5CB" // Soft Blue Romance
    default:
      return "#ffffff" // White
  }
}

const getBorderColor = (tag: string) => {
  switch (tag) {
    case "Lecture":
      return "#90CAF9" // Darker blue border
    case "Lab":
      return "#CE93D8" // Darker purple border
    case "Seminar":
      return "#FFE082" // Darker yellow border
    case "Break":
      return "#7BE37B" // Darker paster green
    default:
      return "#e5e7eb" // Default gray border
  }
}

const getTagClass = (tag: string) => {
  switch (tag) {
    case "Lecture":
      return "bg-blue-100 text-blue-800"
    case "Lab":
      return "bg-purple-100 text-purple-800"
    case "Seminar":
      return "bg-amber-100 text-amber-800"
    case "Break":
      return "bg-green-100 text-green-900"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

// Function to render appropriate icons based on slot type
const getIconForTag = (tag: string) => {
  switch (tag) {
    case "Lecture":
      return <BookOpen size={40} className="text-blue-300" />
    case "Lab":
      return <FlaskConical size={40} className="text-purple-300" />
    case "Seminar":
      return <Users size={40} className="text-amber-300" />
    case "Break":
      return <Coffee size={40} className="text-green-300" />
    default:
      return null
  }
}

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
]

const timeSlots = Array.from(
  { length: 15 },
  (_, i) => `${6 + i}:00 ${i + 6 < 12 ? "AM" : "PM"}`
)

const tags = ["Lecture", "Lab", "Seminar", "Break"]

const fetchSubjects = async (courseId: string) => {
  const response = await axios.get(`/api/subjects?courseId=${courseId}`)
  return response.data.subjects || []
}

const fetchSubjectfaculties = async (classId: string) => {
  const response = await axios.get(
    `/api/classes/timeTable?route=facultyDetails`,
    {
      params: { classId }
    }
  )
  return response?.data || []
}

const fetchTimeTableSlots = async (classId: string) => {
  const response = await axios.get(
    `/api/classes/timeTable?route=timeTableSlots`,
    {
      params: { classId }
    }
  )
  return response?.data || []
}

const allTimeTableSlots = async () => {
  const response = await axios.get(
    `/api/classes/timeTable?route=allTimeTableSlots`
  )
  return response?.data || []
}

export default function ClassTimeTable() {
  const { classId } = useParams()
  const { user } = useContext(UserContext)
  const [selectedSlot, setSelectedSlot] = useState<TimeTableSlot | null>(null)
  const [selectedFaculty, setSelectedFaculty] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [currentSubject, setCurrentSubject] = useState("Non Academic")
  const [scale, setScale] = useState(1)
  const [scheduleData, setScheduleData] = useState<Record<string, any>>({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const userRoles = user?.roles?.map((role: any) => role.id) || []
  const isCoordinator = userRoles.includes(5)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [slotToDelete, setSlotToDelete] = useState<{
    day: string
    time: string
  } | null>(null)

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

  const { data: timeTableSlots } = useQuery({
    queryKey: ["timeTableSlots", classId],
    queryFn: () => fetchTimeTableSlots(classId as string),
    enabled: !!classId
  })

  const { data: allSlots } = useQuery({
    queryKey: ["allSlots"],
    queryFn: () => allTimeTableSlots(),
    enabled: !!classId
  })

  useEffect(() => {
    if (timeTableSlots && timeTableSlots.length > 0) {
      const scheduleData = timeTableSlots.reduce((acc: any, slot: any) => {
        let facultyName = null
        if (slot.facultyId) {
          const facultyData = faculties?.find(
            (f: any) => f.user.id === slot.facultyId
          )
          facultyName = facultyData?.user.name
        }
        const key = `${slot.day}-${slot.startTime}`
        acc[key] = {
          day: slot.day,
          subject: slot.title,
          faculty: facultyName,
          startTime: slot.startTime,
          endTime: slot.endTime,
          tag: slot.tag,
          location: slot.location,
          remarks: slot.remarks,
          subjectId: slot.subjectId,
          facultyId: slot.facultyId
        }
        return acc
      }, {})
      setScheduleData(scheduleData)
      localStorage.setItem(`classId-${classId}`, JSON.stringify(scheduleData))
    }
  }, [timeTableSlots, faculties, classId])

  const timeTableId = timeTableSlots?.find(
    (slot: any) => slot.classId === Number(classId)
  )?.timeTableId

  useEffect(() => {
    const setInitialScale = () => {
      if (containerRef.current && contentRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        const contentWidth = 800 // minimum content width
        const initialScale = Math.min(containerWidth / contentWidth, 1)
        setScale(initialScale)
      }
    }

    setInitialScale()
    window.addEventListener("resize", setInitialScale)
    return () => window.removeEventListener("resize", setInitialScale)
  }, [])

  const handleZoom = (delta: any) => {
    setScale((prev) => Math.min(Math.max(0.5, prev + delta), 2))
  }

  const getTimeSlotSpan = (startTime: string, endTime: string) => {
    const startIndex = timeSlots.findIndex((slot) => slot === startTime)
    const endIndex = timeSlots.findIndex((slot) => slot === endTime)
    return endIndex - startIndex
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const endTime = formData.get("endTime")

    const subjectData = subjects.find((s: any) => s.name === currentSubject)
    const subjectId = subjectData ? subjectData.id : null

    let facultyId = null
    if (selectedFaculty) {
      const facultyData = faculties.find(
        (f: any) => f.user.name === selectedFaculty
      )
      facultyId = facultyData?.id
    }

    if (!selectedSlot) {
      console.log("Selected slot is null. Cannot proceed.")
      return
    }

    const data = {
      day: selectedSlot.day,
      subject: currentSubject,
      faculty: selectedFaculty,
      startTime: selectedTime,
      subjectId,
      facultyId,
      endTime,
      tag: formData.get("tag"),
      location: formData.get("location"),
      remarks: formData.get("remarks")
    }

    const updatedScheduleData = { ...scheduleData }

    // If "Break" is selected, update all days from Monday to Saturday
    if (currentSubject === "Break" && selectedTime && endTime) {
      days.forEach((day) => {
        updatedScheduleData[`${day}-${selectedTime}`] = {
          ...data,
          day,
          subject: "Break",
          faculty: "",
          subjectId: null,
          facultyId: null,
          location: "",
          remarks: ""
        }
      })
    } else {
      // Update only the selected slot
      updatedScheduleData[`${selectedSlot.day}-${selectedTime}`] = data
    }

    setScheduleData(updatedScheduleData)
    localStorage.setItem(
      `classId-${classId}`,
      JSON.stringify(updatedScheduleData)
    )
    setIsDialogOpen(false)
    setSelectedSlot(null)
    setSelectedFaculty(null)
    setSelectedTime(null)
    setCurrentSubject("Non Academic")
  }

  const shouldRenderSlot = (day: string, time: string) => {
    const storedData = localStorage.getItem(`classId-${classId}`)
    const parsedData = storedData ? JSON.parse(storedData) : {}

    for (const key in parsedData) {
      const [slotDay, startTime] = key.split("-")
      const data = parsedData[key]
      if (slotDay === day && startTime === time) {
        return {
          render: true,
          data,
          span: getTimeSlotSpan(startTime, data.endTime)
        }
      }
      if (slotDay === day) {
        const startIndex = timeSlots.findIndex((t) => t === startTime)
        const currentIndex = timeSlots.findIndex((t) => t === time)
        const endIndex = timeSlots.findIndex((t) => t === data.endTime)
        if (currentIndex > startIndex && currentIndex < endIndex) {
          return { render: false }
        }
      }
    }
    return { render: true, span: 1 }
  }

  useEffect(() => {
    const storedData = localStorage.getItem(`classId-${classId}`)
    const parsedData = storedData ? JSON.parse(storedData) : {}
    setScheduleData(parsedData)
  }, [classId])

  const handleSubjectSelectChange = (value: any) => {
    setCurrentSubject(value)
    setSelectedFaculty(null)
  }

  const handleFacultySelectChange = (value: any) => {
    setSelectedFaculty(value)
  }

  // const matchedFaculty = faculties?.filter((faculty: any) =>
  //   faculty.subject.some((subject: any) => subject.name === currentSubject)
  // )

  const matchedFaculty = faculties?.filter((faculty: any) => {
    // 1. Filter by current subject match
    const teachesCurrentSubject = faculty.subject.some(
      (subject: any) => subject.name === currentSubject
    )

    if (!teachesCurrentSubject) return false

    // 2. Check for time conflict in other classes
    const hasConflict = allSlots.some((slot: any) => {
      return (
        slot.facultyId === faculty.clerkId &&
        slot.classId !== classId && // 👈 exclude same class
        slot.day === selectedSlot?.day &&
        slot.startTime === selectedTime
      )
    })

    // 3. Only allow if no conflict
    return !hasConflict
  })

  const handleSlotClick = (day: any, time: any) => {
    const storedData = localStorage.getItem(`classId-${classId}`)
    const parsedData = storedData ? JSON.parse(storedData) : {}

    const slotKey = `${day}-${time}`
    const slotData = parsedData[slotKey]

    if (!slotData) {
      // in this only day and time is update
      setSelectedSlot((prev) => ({
        ...prev!,
        day,
        time
      }))
    } else {
      setSelectedSlot({ day, time, ...slotData })
      setCurrentSubject(slotData.subject)
      setSelectedFaculty(slotData.faculty)
    }
    setSelectedTime(time)
    setIsDialogOpen(true)
  }

  const handleDeleteSlot = async (day: string, time: string) => {
    if (!classId) return

    const classKey = `classId-${classId}`
    const storedData = localStorage.getItem(classKey)

    if (!storedData) return

    const parsed = JSON.parse(storedData)
    const keyToRemove = `${day}-${time}`

    // check if the deleted data is last data in local storage the delete the key
    const isLastData =
      Object.keys(parsed).length === 1 && Object.keys(parsed)[0] === keyToRemove
    if (isLastData) {
      localStorage.removeItem(classKey)
      setScheduleData({})
    } else {
      delete parsed[keyToRemove]
      localStorage.setItem(classKey, JSON.stringify(parsed))
      setScheduleData(parsed)
    }

    if (!timeTableId) return // If no timeTableId, return early

    try {
      const res = await fetch("/api/classes/timeTable", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          day,
          startTime: time,
          classId: Number(classId),
          timeTableId
        })
      })

      if (res.ok) {
        toast.success("Slot deleted Successfully!")
      } else {
        toast.error("Failed to delete slot from DB.")
      }
    } catch (err) {
      console.error("Error deleting slot from DB:", err)
      toast.error("Something went wrong while deleting slot.")
    }
  }

  const saveTimetableSlotsToDb = async () => {
    try {
      const validSlots = Object.values(scheduleData).filter(Boolean)

      const response = await fetch(`/api/classes/timeTable`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timeTableData: {
            courseId: user?.courseId,
            classId: Number(classId),
            departmentId: user?.departmentId
          },
          slotsData: validSlots,
          timeTableId: timeTableId || null, // Set to null for creating a new timetable
          timeTableSlots: timeTableSlots || [] // Pass the existing slots if updating
        })
      })

      if (response.ok) {
        toast.success("Timetable and slots created successfully!")
        setCurrentSubject("Non Academic")
        setSelectedSlot(null)
        setSelectedFaculty(null)
        setSelectedTime(null)
      } else {
        toast.error("Failed to create timetable and slots. Please try again.")
      }
    } catch (error) {
      console.error("Error updating timetable:", error)
    } finally {
      setIsDialogOpen(false)
    }
  }

  return (
    <div className="mx-auto p-4">
      <TimetableHeader
        isCoordinator={isCoordinator}
        handleZoom={handleZoom}
        saveTimetableSlotsToDb={saveTimetableSlotsToDb}
      />

      <TimetableGrid
        containerRef={containerRef}
        contentRef={contentRef}
        scale={scale}
        days={days}
        timeSlots={timeSlots}
        shouldRenderSlot={shouldRenderSlot}
        isCoordinator={isCoordinator}
        handleSlotClick={handleSlotClick}
        handleDeleteSlot={handleDeleteSlot}
        getBackgroundColor={getBackgroundColor}
        getBorderColor={getBorderColor}
        getTagClass={getTagClass}
        getIconForTag={getIconForTag}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        slotToDelete={slotToDelete}
        setSlotToDelete={setSlotToDelete}
      />

      <SlotDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        selectedSlot={selectedSlot}
        selectedTime={selectedTime}
        subjects={subjects}
        selectedFaculty={selectedFaculty}
        currentSubject={currentSubject}
        matchedFaculty={matchedFaculty}
        timeSlots={timeSlots}
        tags={tags}
        handleSubmit={handleSubmit}
        handleSubjectSelectChange={handleSubjectSelectChange}
        handleFacultySelectChange={handleFacultySelectChange}
      />
    </div>
  )
}
