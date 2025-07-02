"use client"

import React, { useContext, useState } from "react"
import {
  Calendar,
  MapPin,
  User,
  BookOpen,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  X
} from "lucide-react"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import { UserContext } from "@/context/user"
import { useQuery } from "@tanstack/react-query"
import { SlotData, SlotDetail } from "@/types/globals"
import {
  AttendanceCardSkeleton,
  AttendanceStateSkeleton
} from "@/components/(commnon)/Skeleton"
import Link from "next/link"

const fetchTimeTableSlots = async (classId: number) => {
  const response = await axios.get(
    `/api/classes/timeTable?route=timeTableSlots`,
    {
      params: { classId: String(classId) }
    }
  )
  return response?.data || []
}

const fetchAttendance = async (classId: number, rollNo: number) => {
  const response = await axios.get(`/api/attendance?route=studentsAttendance`, {
    params: { classId: String(classId), rollNo }
  })

  return response?.data || []
}

const StudentAttendancePage: React.FC = () => {
  const { user } = useContext(UserContext)
  const [selectedSlot, setSelectedSlot] = useState<SlotDetail | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const today = new Date()
  const startDate = new Date("2025-06-02")
  const todayStr = today.toISOString().split("T")[0]
  const [expandedDates, setExpandedDates] = useState<string[]>([todayStr])

  const { data: slots, isLoading: isSlotsLoading } = useQuery({
    queryKey: ["timeTableSlots", user?.student?.classId],
    queryFn: () => fetchTimeTableSlots(user?.student?.classId as number),
    enabled: !!user
  })

  const { data: attendance, isLoading: isAttendanceLoading } = useQuery({
    queryKey: ["attendance", user?.student?.classId],
    queryFn: () =>
      fetchAttendance(
        user?.student?.classId as number,
        user?.student?.rollNo as number
      ),
    enabled: !!user
  })

  const generateDateRange = () => {
    const dates = []
    const current = new Date(startDate)
    while (current <= today) {
      // 0 = Sunday, so skip it
      if (current.getDay() !== 0) {
        dates.push(new Date(current))
      }
      current.setDate(current.getDate() + 1)
    }
    return dates.reverse()
  }

  const formatToReadableDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    }) // matches: 'Tuesday, June 17, 2025'
  }

  const getAttendanceStatus = (slotId: number, date: string): string => {
    const formattedDate = formatToReadableDate(new Date(date)) // convert dateStr to same format
    const record = attendance?.find(
      (r: any) => r.slotId === slotId && r.date === formattedDate
    )
    return (
      (user?.student?.rollNo !== undefined &&
        record?.attendance?.[user.student.rollNo]) ||
      "pending"
    )
  }

  const dateRange = generateDateRange()

  const dateStrings = generateDateRange().map(
    (d) => d.toISOString().split("T")[0]
  )

  const allStatuses: string[] = []

  const getDayName = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "long" })
  }

  // getting status for all slots
  for (const dateStr of dateStrings) {
    const dayName = getDayName(new Date(dateStr))
    const slotsForDay =
      slots?.filter(
        (slot: SlotData) => slot.day.toLowerCase() === dayName.toLowerCase()
      ) || []

    slotsForDay.forEach((slot: SlotData) => {
      const status = getAttendanceStatus(slot.id, dateStr)
      allStatuses.push(status)
    })
  }

  // Calculate stats for attendance metrics
  const stats = allStatuses.reduce(
    (acc, status) => {
      if (status === "present") acc.present += 1
      else if (status === "absent") acc.absent += 1
      else acc.pending += 1
      return acc
    },
    { present: 0, absent: 0, pending: 0 }
  )

  const getSlotsForDay = (dayName: string): SlotData[] => {
    return (slots || []).filter(
      (slot: SlotData) => slot.day?.toLowerCase() === dayName.toLowerCase()
    )
  }

  const getFacultyName = (slot: SlotData) => {
    if (slot.ProxySlot?.lecturer?.user?.name) {
      return slot.ProxySlot.lecturer.user.name
    }

    if (typeof slot.faculty === "object" && "user" in slot.faculty) {
      return slot.faculty.user.name
    }

    return "Unknown Faculty"
  }

  const handleSlotClick = (slot: SlotData, date: string, status: string) => {
    const slotDetail: SlotDetail = {
      slot,
      date,
      status,
      facultyName: getFacultyName(slot),
      subjectName: slot?.title
    }

    setSelectedSlot(slotDetail)
    setIsDrawerOpen(true)
  }

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "present":
        return {
          text: "Present",
          color: "text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20",
          icon: CheckCircle
        }
      case "absent":
        return {
          text: "Absent",
          color: "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20",
          icon: XCircle
        }
      case "pending":
        return {
          text: "Pending",
          color: "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20",
          icon: AlertCircle
        }
      default:
        return {
          text: "No Class",
          color: "text-muted-foreground bg-muted/30 border-muted/20",
          icon: null
        }
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    })
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const toggleDateExpansion = (dateStr: string) => {
    setExpandedDates((prev) =>
      prev.includes(dateStr)
        ? prev.filter((d) => d !== dateStr)
        : [...prev, dateStr]
    )
  }

  return (
    <div className="min-h-screen">
      <div className="px-2 py-1 mb-1 rounded w-fit border border-Dark">
        <Link href={"/dashboard"} className="flex items-center text-TextTwo ">
          <ArrowLeft size={18} className="mr-2" />
          Back
        </Link>
      </div>
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-lg shadow-2xl border-b border-border/50 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-[#87CEEB] to-[#56E1E9] p-3 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-200">
                <Calendar className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[#112C71] to-[#0A2353] bg-clip-text text-transparent">
                  Attendance Dashboard
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base mt-1">
                  Track your class attendance effortlessly
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      {isSlotsLoading || isAttendanceLoading ? (
        <AttendanceStateSkeleton />
      ) : (
        <section className="max-w-5xl mx-auto px-2 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-[#87CEEB]/10 to-[#87CEEB]/5 rounded-2xl p-3 border border-[#87CEEB]/20 backdrop-blur-sm hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#87CEEB]/20 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                    Present
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-[#112C71]">
                    {stats.present}%
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-[#87CEEB]/10 to-[#87CEEB]/5 rounded-2xl p-3 border border-[#87CEEB]/20 backdrop-blur-sm hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#87CEEB]/20 rounded-xl">
                  <XCircle className="w-5 h-5 text-[#EF4444]" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                    Absent
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-[#112C71]">
                    {stats.absent}%
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-[#87CEEB]/10 to-[#87CEEB]/5 rounded-2xl p-3 border border-[#87CEEB]/20 backdrop-blur-sm hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#87CEEB]/20 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                    Pending
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-[#112C71]">
                    {stats.pending}%
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Main Content */}
      {isSlotsLoading || isAttendanceLoading ? (
        <AttendanceCardSkeleton />
      ) : (
        <main className="max-w-5xl mx-auto">
          {/* Attendance Timeline */}
          <section className="relative">
            <div className="absolute left-3 sm:left-8 h-full w-1 bg-[#87CEEB]/20"></div>
            {dateRange.map((date, index) => {
              const dayName = getDayName(date)
              const dateStr = date.toISOString().split("T")[0]
              const isExpanded = expandedDates.includes(dateStr)
              const slots = getSlotsForDay(getDayName(date))

              return (
                <motion.div
                  key={dateStr}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="relative mb-3 pl-6 sm:pl-16"
                >
                  <div className="absolute left-2 sm:left-7 top-4 w-3 h-3 bg-[#87CEEB] rounded-full border-2 border-white"></div>
                  <div
                    className={`bg-card/90 backdrop-blur-sm rounded-2xl shadow-xl border border-border/50 p-4 sm:p-6 cursor-pointer transition-all duration-200 hover:shadow-2xl`}
                    onClick={() => toggleDateExpansion(dateStr)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-[#87CEEB]" />
                        <div>
                          <h3
                            className={`text-lg font-bold ${dateStr === todayStr ? "text-[#87CEEB]" : "text-foreground"}`}
                          >
                            {formatDate(date)}
                            {dateStr === todayStr && (
                              <span className="ml-2 text-xs bg-[#87CEEB] text-white px-2 py-1 rounded-full">
                                Today
                              </span>
                            )}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {dayName}
                          </p>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-[#112C71]" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-[#112C71]" />
                        )}
                      </motion.div>
                    </div>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 grid gap-3"
                        >
                          {slots.length === 0 ? (
                            <div className="text-center text-muted-foreground text-sm py-4">
                              No classes scheduled
                            </div>
                          ) : (
                            slots.map((slot, slotIndex) => {
                              const status = getAttendanceStatus(
                                slot.id,
                                dateStr
                              )
                              const statusDisplay = getStatusDisplay(status)

                              return (
                                <motion.button
                                  key={slot.id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{
                                    duration: 0.2,
                                    delay: slotIndex * 0.1
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleSlotClick(slot, dateStr, status)
                                  }}
                                  disabled={status === "-"}
                                  className={`w-full text-left p-4 rounded-xl border shadow-sm transition-all duration-200 ${
                                    status !== "-"
                                      ? "hover:shadow-md hover:scale-[1.02]"
                                      : "opacity-50 cursor-not-allowed"
                                  } ${statusDisplay.color}`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <Clock className="w-4 h-4" />
                                      <div>
                                        <p className="text-sm font-semibold text-foreground">
                                          {[slot.title]}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          {formatTime(slot.startTime)} -{" "}
                                          {formatTime(slot.endTime)}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {statusDisplay.icon &&
                                        React.createElement(
                                          statusDisplay.icon,
                                          {
                                            className: "w-4 h-4"
                                          }
                                        )}
                                      <span className="text-xs font-medium">
                                        {statusDisplay.text}
                                      </span>
                                    </div>
                                  </div>
                                </motion.button>
                              )
                            })
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )
            })}
          </section>
        </main>
      )}

      {/* Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="border-border/50 max-h-[90vh] bg-white sm:rounded-3xl sm:max-w-2xl sm:mx-auto">
          <DrawerHeader className="px-6 bg-gradient-to-r from-[#C3EBFA] to-[#CFCEFF]">
            <DrawerTitle className="text-2xl font-bold text-[#112C71] tracking-tight pr-8">
              Class Details
            </DrawerTitle>
            <DrawerDescription className="text-[#0A2353]/70 text-base">
              Comprehensive class information
            </DrawerDescription>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="absolute top-7 right-2 p-1 rounded-full bg-white/80 hover:bg-white/90 transition-all duration-200 shadow-sm hover:shadow-md border border-[#112C71]/10 group"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5 text-[#112C71] group-hover:text-[#0A2353] transition-colors" />
            </button>
          </DrawerHeader>
          {selectedSlot && (
            <div className="px-6 py-3 space-y-3 overflow-y-auto max-h-[calc(90vh-140px)] sm:max-h-[calc(80vh-140px)]">
              {/* Date and Time Card */}
              <div className="bg-gradient-to-r from-[#EDF9FD] to-[#F1F0FF] rounded-2xl p-3 shadow-md border border-[#87CEEB]/20">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-evenly">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#87CEEB]/20 rounded-xl">
                      <Calendar className="w-6 h-6 text-[#87CEEB]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#112C71]">
                        {new Date(selectedSlot.date).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric"
                          }
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {getDayName(new Date(selectedSlot.date))}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#56E1E9]/20 rounded-xl">
                      <Clock className="w-6 h-6 text-[#56E1E9]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#112C71]">
                        {formatTime(selectedSlot.slot.startTime)} -{" "}
                        {formatTime(selectedSlot.slot.endTime)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Class Duration
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subject Information */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground leading-tight mb-2">
                    {selectedSlot.subjectName}
                  </h3>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span className="text-base">
                      {selectedSlot.facultyName}
                    </span>
                  </div>
                </div>
                <div
                  className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-sm transition-all ${getStatusDisplay(selectedSlot.status).color}`}
                >
                  {(() => {
                    const Icon = getStatusDisplay(selectedSlot.status).icon
                    return Icon ? <Icon className="w-4 h-4" /> : null
                  })()}
                  <span className="font-bold text-lg capitalize">
                    {selectedSlot.status === "pending"
                      ? "Pending"
                      : selectedSlot.status}
                  </span>
                </div>
              </div>

              {/* Additional Details */}
              <div className="grid gap-3">
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-secondary/20 to-secondary/10 rounded-xl shadow-sm hover:shadow-md transition-all border border-secondary/20">
                  <div className="p-2 bg-[#87CEEB]/20 rounded-lg">
                    <MapPin className="w-5 h-5 text-[#87CEEB]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      Location
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedSlot.slot.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-secondary/20 to-secondary/10 rounded-xl shadow-sm hover:shadow-md transition-all border border-secondary/20">
                  <div className="p-2 bg-[#56E1E9]/20 rounded-lg">
                    <BookOpen className="w-5 h-5 text-[#56E1E9]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      class type
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedSlot.slot.tag}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default StudentAttendancePage
