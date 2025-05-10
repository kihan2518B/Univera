"use client"
import { useState, useContext, useEffect } from "react"
import {
  ChevronLeft,
  Plus,
  Edit,
  Trash,
  Menu,
  X,
  ChevronRight
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import AddChapterDialog from "../../../../_components/AddChapterDialog"
import { Chapter } from "@prisma/client"
import axios from "axios"
import toast from "react-hot-toast"
import { useQuery } from "@tanstack/react-query"
import { UserContext } from "@/context/user"
import EditChapterDialog from "../../../../_components/EditChapterDialog"
import ChapterWiseContentPage from "../../../../_components/ChapterWiseContentPage"

const fetchChapters = async (
  classId: string,
  subjectId: string,
  weekId: string,
  lessionId: string
) => {
  const res = await axios.get(
    `/api/classes/my-class/${classId}/classNotes/${subjectId}/${weekId}/${lessionId}/chapter`
  )
  return res.data
}

export default function LearningPlatform() {
  const { user } = useContext(UserContext)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const [isAddingChapter, setIsAddingChapter] = useState(false)
  const [editingChapter, setEditingChapter] = useState(null)
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null)
  const { classId, subjectId, weekId, lessionId } = useParams()

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }

    // Set initial state based on screen size
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Clean up
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["Chapters"],
    queryFn: () =>
      fetchChapters(
        String(classId),
        String(subjectId),
        String(weekId),
        String(lessionId)
      ),
    enabled: !!user?.id
  })

  // Set the first chapter as active initially when data is loaded
  useEffect(() => {
    if (data?.chapters && data.chapters.length > 0 && !activeChapter) {
      setActiveChapter(data.chapters[0])
    }
  }, [data, activeChapter])

  const handleEditChapter = async (chapterId: number, title: string) => {
    try {
      const res = await axios.patch(
        `/api/classes/my-class/${classId}/classNotes/${subjectId}/${weekId}/${lessionId}/chapter/${chapterId}`,
        {
          title: title
        },
        { params: { updateTitle: true } }
      )
      if (res.status === 200) {
        toast.success(res.data.message || "Chapter updated successfully")
        refetch()
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

  const deleteChapter = async (chapterId: number) => {
    try {
      toast("Deleting...")
      const res = await axios.delete(
        `/api/classes/my-class/${classId}/classNotes/${subjectId}/${weekId}/${lessionId}/chapter/${chapterId}`
      )
      if (res.status === 200) {
        toast.success(res.data.message || "Chapter Deleted successfully")
        // If the active chapter is deleted, set the first remaining chapter as active
        if (activeChapter && activeChapter.id === chapterId) {
          const remainingChapters = data.chapters.filter(
            (ch: Chapter) => ch.id !== chapterId
          )
          setActiveChapter(
            remainingChapters.length > 0 ? remainingChapters[0] : null
          )
        }
        refetch()
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // When selecting a chapter on mobile, close the sidebar
  const handleChapterSelect = (chapter: Chapter) => {
    setActiveChapter(chapter)
    if (window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-lamaSkyLight">
      {/* Navigation */}
      <div className="bg-gradient-to-r from-ColorThree to-ColorTwo text-white px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Link
            href={`/classes/my-class/${classId}/class-notes/${subjectId}`}
            className="flex items-center space-x-1 px-2 sm:px-3 py-1 hover:bg-white/10 rounded-lg transition duration-150"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-sm sm:text-base hidden sm:inline">
              Lessons
            </span>
          </Link>
          <div className="hidden sm:flex space-x-2">
            <button className="px-2 sm:px-3 py-1 hover:bg-white/10 rounded-lg transition duration-150 text-sm sm:text-base">
              Prev
            </button>
            <button className="px-2 sm:px-3 py-1 hover:bg-white/10 rounded-lg transition duration-150 text-sm sm:text-base">
              Next
            </button>
          </div>
        </div>
        {/* WEEK TITLE */}

        <button className="p-1 sm:p-2 hover:bg-white/10 rounded-full transition duration-150">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex flex-grow overflow-hidden relative">
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full sm:translate-x-0 sm:w-16"
          } transition-all duration-300 absolute sm:relative z-10 h-full bg-white border-r border-gray-200 overflow-y-auto shadow-sm ${
            sidebarOpen ? "w-full sm:w-80" : "w-0 sm:w-16"
          }`}
        >
          <div className="sticky top-0 bg-white z-10">
            <div
              className="p-3 sm:p-4 border-b border-gray-200 flex items-center bg-lamaPurpleLight justify-between"
              onClick={toggleSidebar}
            >
              <div className="flex items-center cursor-pointer">
                <button className="mr-2 text-ColorThree hover:text-ColorTwo transition duration-150">
                  <Menu size={20} />
                </button>
                {/* LESSON TITLE */}
                {sidebarOpen && (
                  <span className="text-TextTwo font-medium">
                    {data?.lession?.title || "Lesson Content"}
                  </span>
                )}
              </div>

              {sidebarOpen && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSidebarOpen(false)
                  }}
                  className="text-ColorThree hover:text-ColorTwo transition duration-150 sm:hidden"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {sidebarOpen && (
              <div className="flex justify-between items-center p-2 sm:p-3 bg-lamaSkyLight border-b border-gray-200">
                <span className="text-TextTwo font-semibold text-sm sm:text-base">
                  Chapters
                </span>
                <button
                  onClick={() => setIsAddingChapter(true)}
                  className="p-1 sm:p-1.5 text-ColorThree hover:bg-lamaPurpleLight rounded-full transition duration-150 flex items-center justify-center"
                  title="Add new chapter"
                >
                  <Plus size={18} />
                </button>
              </div>
            )}
          </div>

          {sidebarOpen ? (
            <div className="py-2">
              {isLoading ? (
                <div className="flex justify-center p-6">
                  <div className="animate-pulse text-TextTwo">
                    Loading chapters...
                  </div>
                </div>
              ) : data?.chapters && data.chapters.length > 0 ? (
                <ul className="space-y-1 px-2">
                  {data.chapters.map((chapter: Chapter) => (
                    <li
                      key={chapter.id}
                      className={`rounded-lg transition duration-150 ${
                        activeChapter && activeChapter.id === chapter.id
                          ? "bg-gradient-to-r from-lamaSky to-lamaPurple border-l-4 border-ColorThree"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <div
                        className="flex justify-between items-center p-2 sm:p-3 cursor-pointer"
                        onClick={() => handleChapterSelect(chapter)}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-6 h-6 mr-2 sm:mr-3 flex items-center justify-center rounded-full ${
                              chapter.completed
                                ? "bg-ColorThree text-white"
                                : activeChapter &&
                                    activeChapter.id === chapter.id
                                  ? "bg-white/70"
                                  : "bg-gray-100"
                            }`}
                          >
                            {chapter.completed ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            ) : (
                              <span className="text-xs font-medium text-TextTwo">
                                {data.chapters.indexOf(chapter) + 1}
                              </span>
                            )}
                          </div>
                          <span
                            className={`text-sm truncate max-w-[150px] sm:max-w-[180px] ${
                              activeChapter && activeChapter.id === chapter.id
                                ? "font-semibold text-TextTwo"
                                : "text-gray-700"
                            }`}
                          >
                            {chapter.title}
                          </span>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingChapter(chapter)
                            }}
                            className={`p-1 sm:p-1.5 rounded-full ${
                              activeChapter && activeChapter.id === chapter.id
                                ? "text-TextTwo hover:bg-white/30"
                                : "text-gray-500 hover:bg-gray-200"
                            }`}
                            title="Edit chapter"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteChapter(chapter.id)
                            }}
                            className={`p-1 sm:p-1.5 rounded-full ${
                              activeChapter && activeChapter.id === chapter.id
                                ? "text-TextTwo hover:bg-white/30"
                                : "text-gray-500 hover:bg-gray-200"
                            }`}
                            title="Delete chapter"
                          >
                            <Trash size={14} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="text-gray-500 mb-3">No chapters yet</div>
                  <button
                    onClick={() => setIsAddingChapter(true)}
                    className="px-4 py-2 bg-ColorThree text-white rounded-lg hover:bg-ColorTwo transition duration-150"
                  >
                    Create First Chapter
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center py-4">
              {/* Mini icons view when sidebar is collapsed */}
              {!isLoading &&
                data?.chapters &&
                data.chapters.map((chapter: Chapter, index: number) => (
                  <button
                    key={chapter.id}
                    onClick={() => handleChapterSelect(chapter)}
                    className={`w-10 h-10 mb-2 rounded-full flex items-center justify-center ${
                      activeChapter && activeChapter.id === chapter.id
                        ? "bg-gradient-to-r from-lamaSky to-lamaPurple text-TextTwo"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                    title={chapter.title}
                  >
                    {chapter.completed ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <span className="text-xs font-medium">{index + 1}</span>
                    )}
                  </button>
                ))}

              <button
                onClick={() => {
                  setIsAddingChapter(true)
                  setSidebarOpen(true)
                }}
                className="w-10 h-10 rounded-full bg-ColorThree text-white hover:bg-ColorTwo mt-2 flex items-center justify-center"
                title="Add new chapter"
              >
                <Plus size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Mobile sidebar toggle button (visible only when sidebar is closed) */}
        {!sidebarOpen && (
          <button
            className="absolute top-2 left-2 p-2 bg-white text-ColorThree rounded-full shadow-md z-20 sm:hidden"
            onClick={toggleSidebar}
          >
            <ChevronRight size={20} />
          </button>
        )}
        {isAddingChapter && (
          <AddChapterDialog
            isOpen={isAddingChapter}
            onClose={() => setIsAddingChapter(!isAddingChapter)}
            onAddChapter={() => {
              refetch()
              return true
            }}
          />
        )}
        {editingChapter && (
          <EditChapterDialog
            isOpen={!!editingChapter}
            onClose={() => setEditingChapter(null)}
            initialTitle={editingChapter?.title}
            chapterId={editingChapter?.id}
            onEditChapter={handleEditChapter}
          />
        )}

        {/* Main Content */}
        <div className="flex-grow overflow-y-auto bg-white">
          {activeChapter ? (
            <div className="p-3 sm:p-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-TextTwo mb-4">
                  {activeChapter.title}
                </h2>

                {/* Pass the active chapter to the component */}
                <ChapterWiseContentPage chapter={activeChapter} />

                {/* Chapter completion button */}
                <div className="mt-6 sm:mt-8 flex justify-end">
                  <button
                    className={`px-3 sm:px-4 py-2 rounded-lg flex items-center space-x-2 transition duration-150 text-sm sm:text-base ${
                      activeChapter.completed
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-gradient-to-r from-ColorThree to-ColorTwo text-white hover:shadow-md"
                    }`}
                  >
                    <span>
                      {activeChapter.completed
                        ? "Completed"
                        : "Mark as Complete"}
                    </span>
                    {activeChapter.completed && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 sm:h-5 sm:w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-4 sm:p-6 text-center">
              <div className="text-gray-500 mb-4">
                Select a chapter to view content
              </div>
              {!data?.chapters || data.chapters.length === 0 ? (
                <button
                  onClick={() => setIsAddingChapter(true)}
                  className="px-4 py-2 bg-ColorThree text-white rounded-lg hover:bg-ColorTwo transition duration-150"
                >
                  <Plus size={16} className="inline mr-1" />
                  Add Chapter
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
