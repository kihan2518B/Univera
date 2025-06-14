"use client"

import React, { useContext, useMemo, useState, FormEvent } from "react"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { UserContext } from "@/context/user"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import axious from "axios"
import toast from "react-hot-toast"
import { ProxySlot } from "@/types/globals"
import CurrentDayDisplay from "../../_components/(MyTimeTableComponents)/CurrentDayDisplay"
import MyTimeTableHeader from "../../_components/(MyTimeTableComponents)/MyTimeTableHeader"
import PaginationControls from "../../_components/(MyTimeTableComponents)/PaginationControls"
import ProxyRequestDialog from "../../_components/(MyTimeTableComponents)/ProxyRequestDialog"

const myTimeTableSlots = async (userId: string) => {
  const response = await axios.get(
    `/api/classes/timeTable?route=myTimeTableSlots`,
    {
      params: { userId }
    }
  )
  return response?.data || []
}

const courseFaculties = async (courseId: number) => {
  const response = await axios.get(`/api/courses/${courseId}`)
  return response?.data.course.faculties || []
}

const proxySlotsFetcher = async (userId: string) => {
  const response = await axios.get(`/api/proxySlot?userId=${userId}`)
  return response?.data || []
}

const weekDayNames = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday"
]

function getRollingDays(startOffset = -1, count = 3) {
  const today = new Date()
  return Array.from({ length: count }).map((_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() + startOffset + i)
    const dayIndex = startOffset + i
    return {
      date: d,
      name: weekDayNames[d.getDay()],
      label: d.toLocaleDateString(undefined, { weekday: "long" }),
      isToday: dayIndex === 0,
      offset: startOffset + i
    }
  })
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "bg-green-100 text-green-800 border-green-200"
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "DECLINED":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export default function Page() {
  const { user } = useContext(UserContext)
  const [currentPage, setCurrentPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null)
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>("")
  const [reason, setReason] = useState<string>("")
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [editingProxyId, setEditingProxyId] = useState<number | null>(null)
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
  const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [proxyRequestLoading, setProxyRequestLoading] = useState(false)
  const [statusUpdateLoading, setStatusUpdate] = useState(false)

  const { data: mySlots } = useQuery({
    queryKey: ["mySlots"],
    queryFn: () => myTimeTableSlots(user?.id || ""),
    enabled: !!user?.id
  })

  const { data: faculties } = useQuery({
    queryKey: ["faculties"],
    queryFn: () => courseFaculties(Number(user?.courseId)),
    enabled: !!user?.id
  })

  const { data: proxySlots, refetch: proxySlotsRefetch } = useQuery({
    queryKey: ["proxySlots"],
    queryFn: () => proxySlotsFetcher(user?.id || ""),
    enabled: !!user?.id
  })

  // Split proxySlots into sent and received
  const { askedProxies, receivedProxies } = useMemo(() => {
    const asked: any[] = []
    const received: any[] = []

    proxySlots?.forEach((slot: any) => {
      if (slot.slot.facultyId === user?.id) {
        asked.push(slot)
      } else if (slot.lecturerId === user?.id) {
        received.push(slot)
      }
    })

    return { askedProxies: asked, receivedProxies: received }
  }, [proxySlots, user?.id])

  const rolling = useMemo(
    () => getRollingDays(currentPage - 2, 3),
    [currentPage]
  )

  const mySlotsByDay = useMemo(() => {
    return rolling.reduce(
      (map: { [key: string]: any[] }, { name }) => {
        map[name] = mySlots?.filter(
          (slot: any) =>
            slot.facultyId === user?.id && slot.day.toLowerCase() === name
        )
        return map
      },
      {} as { [key: string]: any[] }
    )
  }, [mySlots, user, rolling])

  const handlePrevious = () => setCurrentPage((prev) => prev - 1)
  const handleNext = () => setCurrentPage((prev) => prev + 1)
  const goToToday = () => setCurrentPage(1)

  const currentDay = rolling[1]
  const currentSlots = mySlotsByDay[currentDay?.name] || []
  const currentDate = currentDay?.date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  })

  const todayDate = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  })

  const sortedSlots = useMemo(() => {
    const approvedProxySlots = receivedProxies
      ?.filter(
        (slot: ProxySlot) =>
          slot.status === "APPROVED" && slot.date === currentDate
      )
      .map((slot: ProxySlot) => ({ ...slot, isProxy: true }))

    return [...currentSlots, ...approvedProxySlots].sort((a, b) => {
      const timeA = new Date(`1970/01/01 ${a.startTime}`)
      const timeB = new Date(`1970/01/01 ${b.startTime}`)
      return timeA.getTime() - timeB.getTime()
    })
  }, [currentSlots, receivedProxies])

  function openProxyDialog(slotId: number) {
    const existingProxy = askedProxies?.find((proxy) => proxy.slotId === slotId)

    if (existingProxy) {
      // Edit mode
      setIsEditMode(true)
      setEditingProxyId(existingProxy.id)
      setSelectedSlotId(existingProxy.slotId)
      setSelectedFacultyId(existingProxy.lecturerId)
      setReason(existingProxy.reason || "")
    } else {
      // New proxy request
      setIsEditMode(false)
      setEditingProxyId(null)
      setSelectedSlotId(slotId)
      setSelectedFacultyId("")
      setReason("")
    }
    setDialogOpen(true)
  }

  async function handleProxySubmit(e: FormEvent) {
    e.preventDefault()
    if (!selectedSlotId || !selectedFacultyId) return
    setProxyRequestLoading(true)

    try {
      const res = await axious.patch(
        `/api/proxySlot?${editingProxyId ? "route=editProxy" : "route=createProxy"}`,
        {
          slotId: selectedSlotId,
          lecturerId: selectedFacultyId,
          date: currentDate,
          reason: reason.trim() || null,
          editingProxyId: editingProxyId || null
        }
      )

      if (res.status >= 200 && res.status < 300) {
        toast.success(
          res.data.message || editingProxyId
            ? "Proxy request updated!"
            : "Proxy request sent successfully!"
        )
      }
      setDialogOpen(false)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Something went wrong")
      } else {
        toast.error("An unexpected error occurred")
      }
    } finally {
      proxySlotsRefetch() // Refetch proxy slots to update the list
      setProxyRequestLoading(false)
    }
  }

  const findFacultyName = (id?: string): string => {
    if (!id) return ""
    return faculties?.find((f: any) => f.id === id)?.user?.name || ""
  }

  const handleProxyResponse = async (
    proxyId: number,
    action: "APPROVED" | "DECLINED" | string
  ) => {
    setStatusUpdate(true)
    if (!proxyId) return
    try {
      const res = await axios.patch("/api/proxySlot?route=statusUpdate", {
        proxyId,
        status: action
      })

      if (res.status >= 200 && res.status < 300) {
        toast.success(
          res.data.message || `Request ${action.toLowerCase()} successfully!`
        )
        proxySlotsRefetch() // Refresh the list
      }
    } catch (error) {
      console.log("Error updating proxy status:", error)
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Something went wrong")
      } else {
        toast.error("An unexpected error occurred")
      }
    } finally {
      if (action === "APPROVED") {
        setIsApproveDialogOpen(false)
      } else {
        setIsDeclineDialogOpen(false)
      }
      setStatusUpdate(false)
    }
  }

  const pendingCount: number = (proxySlots as ProxySlot[])?.filter(
    (r: ProxySlot) => r.status === "PENDING"
  ).length

  const getProxyStatusForSlot = (slotId: number) => {
    const match = askedProxies.find((proxy) => proxy.slotId === slotId)
    if (match?.status === "APPROVED") return "APPROVED"
    if (match?.status === "PENDING") return "PENDING"
    if (match?.status === "DECLINE") return "DECLINE"
    return ""
  }

  const handleDeleteClick = () => setDeleteDialogOpen(true)

  const handleDeleteCancel = () => setDeleteDialogOpen(false)

  const handleDeleteConfirm = async (proxyId: number) => {
    if (!proxyId) return
    setIsDeleting(true)

    try {
      const res = await axious.delete("/api/proxySlot", {
        data: { id: proxyId }
      })

      if (res.status >= 200 && res.status < 300) {
        toast.success(res.data.message || "Proxy request deleted successfully!")
        proxySlotsRefetch() // Refresh the list
        setDeleteDialogOpen(false)
      }
    } catch (error) {
      console.log("Error deleting proxy request:", error)
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Something went wrong")
      } else {
        toast.error("An unexpected error occurred")
      }
    } finally {
      setIsDeleting(false)
    }
  }

  type ConfirmationDialogContentProps = {
    action: "APPROVED" | "DECLINED" | string
    onConfirm: () => void
  }

  const ConfirmationDialogContent: React.FC<ConfirmationDialogContentProps> = ({
    action,
    onConfirm
  }) => {
    const isApprove = action === "APPROVED"

    return (
      <>
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-center">
            <div
              className="p-3 rounded-full"
              style={{ backgroundColor: isApprove ? "#FAE27C" : "#CFCEFF" }}
            >
              <AlertTriangle className="h-6 w-6" style={{ color: "#112C71" }} />
            </div>
          </div>
          <DialogTitle
            className="text-xl font-bold text-center"
            style={{ color: "#0A2353" }}
          >
            Confirm {isApprove ? "Approval" : "Decline"}
          </DialogTitle>
          <DialogDescription
            className="text-center text-base leading-relaxed"
            style={{ color: "#0A2353" }}
          >
            Are you sure you want to{" "}
            <span
              className="font-semibold"
              style={{ color: isApprove ? "#5B58EB" : "#BB63FF" }}
            >
              {isApprove ? "accept" : "decline"}
            </span>{" "}
            ?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button
            onClick={onConfirm}
            disabled={statusUpdateLoading}
            className={`flex-1 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg ${
              isApprove
                ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                : "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700"
            }`}
          >
            {statusUpdateLoading ? (
              "Processing..."
            ) : isApprove ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Yes, Accept
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 mr-2" />
                Yes, Decline
              </>
            )}
          </Button>

          <Button
            onClick={() =>
              isApprove
                ? setIsApproveDialogOpen(false)
                : setIsDeclineDialogOpen(false)
            }
            className="flex-1 font-bold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-105 border-2"
            style={{
              backgroundColor: "#CECDF9",
              borderColor: "#5B58EB",
              color: "#0A2353"
            }}
          >
            Cancel
          </Button>
        </DialogFooter>
      </>
    )
  }

  console.log("Current Slots:", sortedSlots)
  console.log("currentDate:", currentDate)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <MyTimeTableHeader />
      <PaginationControls
        handlePrevious={handlePrevious}
        handleNext={handleNext}
        rolling={rolling}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <CurrentDayDisplay
        currentDay={currentDay}
        currentDate={currentDate}
        todayDate={todayDate}
        pendingCount={pendingCount}
        currentPage={currentPage}
        goToToday={goToToday}
        receivedProxies={receivedProxies}
        askedProxies={askedProxies}
        findFacultyName={findFacultyName}
        getStatusColor={getStatusColor}
        handleProxyResponse={handleProxyResponse}
        isApproveDialogOpen={isApproveDialogOpen}
        setIsApproveDialogOpen={setIsApproveDialogOpen}
        isDeclineDialogOpen={isDeclineDialogOpen}
        setIsDeclineDialogOpen={setIsDeclineDialogOpen}
        sortedSlots={sortedSlots}
        getProxyStatusForSlot={getProxyStatusForSlot}
        openProxyDialog={openProxyDialog}
        ConfirmationDialogContent={ConfirmationDialogContent}
        handleDeleteClick={handleDeleteClick}
        handleDeleteCancel={handleDeleteCancel}
        handleDeleteConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        deleteDialogOpen={deleteDialogOpen}
      />
      <ProxyRequestDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        isEditMode={isEditMode}
        handleProxySubmit={handleProxySubmit}
        selectedFacultyId={selectedFacultyId}
        setSelectedFacultyId={setSelectedFacultyId}
        reason={reason}
        setReason={setReason}
        faculties={faculties}
        user={user}
        proxyRequestLoading={proxyRequestLoading}
      />
    </div>
  )
}
