"use client"

import React, { useState, useEffect, useContext } from "react"
import { Pencil, Plus, Check, Circle, Trash2 } from "lucide-react"
import Link from "next/link"
import Left from "@/components/Icons/Left"
import { useParams } from "next/navigation"
import AddWeekDialog from "../_components/AddWeekDialog"
import AddLessionDialog from "../_components/AddLessionDialog"
import { Prisma } from "@prisma/client"
import axios from "axios"
import toast from "react-hot-toast"
import { UserContext } from "@/context/user"
import EditWeekDialog from "../_components/EditWeekDialog"

type ClassNotesWithSubjectAndLessions = Prisma.ClassNoteGetPayload<{
  include: {
    subject: true
    lessions: true
  }
}>

const fetchClassNotes = async (classId: string, subjectId: string) => {
  const res = await axios.get(
    `/api/classes/my-class/${classId}/classNotes/${subjectId}`
  )
  return res.data
}

// Skeleton Component
const CourseOutlineSkeleton = () => {
  return (
    <div className="min-h-screen text-black p-6 bg-lamaSkyLight">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-8">
        <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>

      {/* Subject name skeleton */}
      <div className="mb-6 text-center">
        <div className="h-12 w-64 bg-gray-200 rounded-lg animate-pulse mx-auto"></div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="h-8 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="h-10 w-28 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>

      {/* Weeks skeleton */}
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-lg overflow-hidden bg-white shadow-md mb-6 animate-pulse"
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <div className="h-6 w-48 bg-gray-200 rounded-lg"></div>
            <div className="flex space-x-2">
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            </div>
          </div>

          <div className="divide-y">
            {[1, 2, 3].map((j) => (
              <div key={j} className="flex items-center p-4">
                <div className="h-5 w-5 bg-gray-200 rounded-full mr-4"></div>
                <div className="h-5 w-3/4 bg-gray-200 rounded-lg"></div>
                <div className="h-5 w-5 bg-gray-200 rounded-full ml-auto"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const CourseOutline = () => {
  const { classId, subjectId } = useParams() as {
    classId: string
    subjectId: string
  }

  const [isAddWeekDialogOpen, setIsAddWeekDialogOpen] = useState(false)
  const [isAddLessionDialogOpen, setIsAddLessionDialogOpen] = useState(false)
  const [isEditWeekDialogOpen, setIsEditWeekDialogOpen] = useState(false)
  const [activeWeekId, setActiveWeekId] = useState<number | null>(null)
  const [editingWeekTitle, setEditingWeekTitle] = useState("")
  const [weeks, setWeeks] = useState<ClassNotesWithSubjectAndLessions[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useContext(UserContext)

  const roles = user?.roles.map((r) => r.id)
  const isTeacher = roles?.includes(4)

  useEffect(() => {
    const setFetchedWeeks = async () => {
      try {
        const data = await fetchClassNotes(classId, subjectId)
        setWeeks(data.classNotes)
      } catch (error) {
        toast.error("Failed to load course outline")
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    setFetchedWeeks()
  }, [classId, subjectId])

  const deleteWeek = async (
    weekId: number,
    classId: string,
    subjectId: string
  ) => {
    try {
      const res = await axios.delete(
        `/api/classes/my-class/${classId}/classNotes/${subjectId}/${weekId}`
      )
      if (res.status === 200) {
        setWeeks(weeks.filter((w) => w.id !== weekId))
        toast.success(res.data.message || "Week deleted successfully")
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Failed to delete week")
      } else {
        toast.error("An unexpected error occurred")
      }
    }
  }

  const editWeek = async (weekId: number, newTitle: string) => {
    try {
      const res = await axios.patch(
        `/api/classes/my-class/${classId}/classNotes/${subjectId}/${weekId}`,
        {
          title: newTitle
        }
      )
      if (res.status === 200) {
        setWeeks(
          weeks.map((week) =>
            week.id === weekId ? { ...week, title: newTitle } : week
          )
        )
        toast.success(res.data.message || "Week updated successfully")
        return true
      }
      return false
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Failed to update week")
      } else {
        toast.error("An unexpected error occurred")
      }
      return false
    }
  }

  const handleAddWeek = async (week: ClassNotesWithSubjectAndLessions) => {
    setWeeks([...weeks, week])
    return true
  }

  const openEditWeekDialog = (weekId: number, currentTitle: string) => {
    setActiveWeekId(weekId)
    setEditingWeekTitle(currentTitle)
    setIsEditWeekDialogOpen(true)
  }

  const handleAddLession = (lessionTitle: string) => {
    if (!activeWeekId) return

    setWeeks((prevWeeks) =>
      prevWeeks.map((week) => {
        if (week.id === activeWeekId) {
          const maxLessionId = Math.max(
            ...prevWeeks.flatMap((w) => w.lessions.map((l) => l.id)),
            0
          )
          const newLessionId = maxLessionId + 1

          const weekNumberMatch = week.title.match(/\d+/)
          const weekNumber = weekNumberMatch ? weekNumberMatch[0] : "1"

          return {
            ...week,
            lessions: [
              ...week.lessions,
              {
                id: newLessionId,
                title: `W${weekNumber} ${lessionTitle}`,
                completed: false,
                type: "reading"
              } as any
            ]
          }
        }
        return week
      })
    )
  }

  const openAddLessionDialog = (weekId: number) => {
    setActiveWeekId(weekId)
    setIsAddLessionDialogOpen(true)
  }

  if (isLoading) {
    return <CourseOutlineSkeleton />
  }

  return (
    <div className="min-h-screen text-TextTwo p-6 bg-lamaSkyLight">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-8">
        <Link
          className="inline-flex items-center gap-2 bg-white border-2 border-ColorTwo text-TextTwo font-semibold rounded-lg px-4 py-2 text-base transition-all hover:bg-lamaPurpleLight"
          href={`/classes/my-class/${classId}/class-notes`}
        >
          <Left className="w-5 h-5" /> Back
        </Link>
      </div>

      {/* Subject name */}
      <div className="mb-8 text-center">
        <h1 className="font-extrabold text-4xl mb-4 text-Dark">
          {weeks[0]?.subject?.name ?? "Subject"}
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-ColorTwo to-ColorThree mx-auto rounded-full"></div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-Dark">Lessons</h1>
        <button
          onClick={() => setIsAddWeekDialogOpen(true)}
          className="flex items-center bg-gradient-to-r from-ColorThree to-ColorTwo text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          <Plus size={18} className="mr-2" />
          Add Week
        </button>
      </div>

      <div className="space-y-6">
        {weeks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-10 text-center">
            <div className="text-lg text-TextTwo mb-4">No weeks added yet</div>
            <button
              onClick={() => setIsAddWeekDialogOpen(true)}
              className="inline-flex items-center bg-ColorThree text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
            >
              <Plus size={18} className="mr-2" />
              Add Your First Week
            </button>
          </div>
        ) : (
          weeks.map((week) => (
            <div
              key={week.id}
              className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-lamaSky to-lamaSkyLight border-b border-gray-200">
                <h2 className="text-xl font-semibold text-Dark">
                  {week.title}
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openAddLessionDialog(week.id)}
                    className="p-2 text-TextTwo hover:text-ColorThree bg-white rounded-full shadow-sm hover:shadow transition-all"
                    title="Add Lesson"
                  >
                    <Plus size={18} />
                  </button>
                  <button
                    className="p-2 text-TextTwo hover:text-ColorTwo bg-white rounded-full shadow-sm hover:shadow transition-all"
                    onClick={() => openEditWeekDialog(week.id, week.title)}
                    title="Edit Week"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    className="p-2 text-TextTwo hover:text-red-500 bg-white rounded-full shadow-sm hover:shadow transition-all"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this week?"
                        )
                      ) {
                        deleteWeek(week.id, classId, subjectId)
                      }
                    }}
                    title="Delete Week"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {week.lessions.map((lession) => (
                  <Link
                    href={
                      isTeacher
                        ? `/classes/my-class/${classId}/class-notes/${subjectId}/edit-lession/${week.id}/${lession.id}`
                        : `/classes/my-class/${classId}/class-notes/${subjectId}/${week.id}/${lession.id}`
                    }
                    key={lession.id}
                    className="flex items-center p-4 hover:bg-lamaSkyLight hover:underlin transition-colors duration-200"
                  >
                    <div className="flex-1 flex items-center">
                      <div className="mr-4 text-TextTwo">
                        {lession.completed ? (
                          <div className="w-5 h-5 rounded-full bg-ColorTwo flex items-center justify-center">
                            <Check size={14} className="text-white" />
                          </div>
                        ) : (lession as any).status === "current" ? (
                          <div className="w-5 h-5 rounded-full bg-ColorThree flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          </div>
                        ) : (
                          <Circle size={20} className="text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 text-TextTwo font-medium">
                        {lession.title}
                      </div>
                    </div>
                  </Link>
                ))}
                {week.lessions.length === 0 && (
                  <div className="p-6 text-gray-500 text-center bg-lamaSkyLight bg-opacity-30">
                    <div className="mb-2">No lessons yet</div>
                    <button
                      onClick={() => openAddLessionDialog(week.id)}
                      className="text-ColorThree hover:text-ColorTwo flex items-center mx-auto"
                    >
                      <Plus size={16} className="mr-1" /> Add a lesson
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Week Dialog */}
      <AddWeekDialog
        isOpen={isAddWeekDialogOpen}
        onClose={() => setIsAddWeekDialogOpen(false)}
        onAddWeek={handleAddWeek}
      />

      {/* Edit Week Dialog */}
      <EditWeekDialog
        isOpen={isEditWeekDialogOpen}
        onClose={() => setIsEditWeekDialogOpen(false)}
        onEditWeek={editWeek}
        weekId={activeWeekId || 0}
        initialTitle={editingWeekTitle}
      />

      {/* Add Lesson Dialog */}
      <AddLessionDialog
        isOpen={isAddLessionDialogOpen}
        onClose={() => setIsAddLessionDialogOpen(false)}
        onAddLession={handleAddLession}
        weekId={activeWeekId || 0}
      />
    </div>
  )
}

export default CourseOutline
