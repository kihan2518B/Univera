import React, { useState, useEffect, useContext } from "react"
import axios from "axios"
import { Plus, Edit, BookOpen, FileText, X } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import RichTextForm from "./_lessionComponents/AddChapterWiseContent"
import { ChapterContentSkeleton } from "@/components/(commnon)/Skeleton"
import { UserContext } from "@/context/user"
import { userProgress } from "@prisma/client"
import toast from "react-hot-toast"

type ChapterWiseContentPageProps = {
  chapter: number
  classId: string
  subjectId: string
  classNoteId: string
  lessionId: string
}

const fetchChapter = async (
  chapterId: string,
  classId: string,
  subjectId: string,
  classNoteId: string,
  lessionId: string
) => {
  const res = await axios.get(
    `/api/classes/my-class/${classId}/classNotes/${subjectId}/${classNoteId}/${lessionId}/chapter/${chapterId}`
  )
  return res.data
}

// Empty State Component
const EmptyState = () => {
  return (
    <div className="text-center py-16">
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <FileText className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        No Content Yet
      </h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        This chapter doesn&apos;t have any content yet. Click &quot;Add Chapter
        Content&quot; to get started.
      </p>
    </div>
  )
}

// Main Component
export default function ChapterWiseContentPage({
  chapter,
  classId,
  subjectId,
  classNoteId,
  lessionId
}: ChapterWiseContentPageProps) {
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const { user } = useContext(UserContext)
  const roles = user?.roles.map((r) => r.id)
  const canEditChapter = roles?.includes(4) //only faculty

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["chapter", chapter, classId, subjectId, classNoteId, lessionId],
    queryFn: () =>
      fetchChapter(String(chapter), classId, subjectId, classNoteId, lessionId),
    enabled: !!chapter
  })

  const hasContent = data?.chapter?.data && data?.chapter?.data.length > 0
  const existingContent = hasContent ? data.chapter.data.join("") : null

  const handleOpenEditor = () => {
    setIsEditing(hasContent)
    setIsEditorOpen(true)
  }

  const handleCloseEditor = () => {
    setIsEditorOpen(false)
    setIsEditing(false)
  }

  // ⬇️ Track if viewing update is already sent
  const [viewingTracked, setViewingTracked] = useState(false)

  const handleViewing = async () => {
    try {
      const res = await axios.patch(
        `/api/classes/my-class/${classId}/classNotes/${subjectId}/${classNoteId}/${lessionId}/chapter/${chapter}`,
        {
          isCompleted: false,
          isViewing: true
        },
        {
          params: {
            updateProgress: true
          }
        }
      )
      if (res.status == 200) {
        toast.success(res.data.message)
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data.message)
      }
    }
  }

  // ⬇️ This runs after data is loaded and viewing is not yet tracked
  useEffect(() => {
    if (!data || !user || viewingTracked) return

    const userProgress: userProgress | undefined =
      data.chapter.userProgress?.find(
        (progress: userProgress) => progress.userId === user.id
      )

    if (!userProgress) {
      // First time visiting, track viewing
      handleViewing()
      setViewingTracked(true)
    }
  }, [data, user, viewingTracked])

  const handleClickComplete = async () => {
    try {
      const res = await axios.patch(
        `/api/classes/my-class/${classId}/classNotes/${subjectId}/${classNoteId}/${lessionId}/chapter/${chapter}`,
        {
          isCompleted: true,
          isViewing: false
        },
        {
          params: {
            updateProgress: true
          }
        }
      )
      if (res.status == 200) {
        toast.success(res.data.message)
        refetch()
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message)
      }
    }
  }
  console.log("data: ", data)
  const progress = data
    ? data.chapter.userProgress?.find(
        (progress: userProgress) => progress.userId === user?.id
      )
    : {}
  console.log("progress: ", progress)
  const isCompleted = progress?.isCompleted || false

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Chapter {String(chapter)}
                </h1>
                {hasContent && (
                  <p className="text-sm text-gray-500 mt-1">
                    Last updated: {new Date().toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            {canEditChapter && (
              <button
                onClick={handleOpenEditor}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-6 py-3 font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {hasContent ? (
                  <>
                    <Edit className="w-5 h-5" />
                    <span>Edit Chapter Content</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>Add Chapter Content</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Editor Modal */}
        {isEditorOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {isEditing ? "Edit Chapter Content" : "Add New Content"}
                  </h2>
                  <button
                    onClick={handleCloseEditor}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <RichTextForm
                  classId={String(classId)}
                  subjectId={String(subjectId)}
                  classNoteId={String(classNoteId)}
                  lessionId={String(lessionId)}
                  chapterId={String(chapter)}
                  refetch={refetch}
                  existingContent={existingContent}
                  onClose={handleCloseEditor}
                />
              </div>
            </div>
          </div>
        )}

        {/* Content Display Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[600px]">
          {isLoading ? (
            <div className="p-8">
              <ChapterContentSkeleton />
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="mx-aut w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-12 h-12 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.ə-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Failed to Load Content
              </h3>
              <p className="text-gray-500 mb-6">
                There was an error loading the chapter content. Please try
                again.
              </p>
              <button
                onClick={() => refetch()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : !hasContent ? (
            <div className="p-8">
              <EmptyState />
            </div>
          ) : (
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Chapter Content
                </h3>
              </div>

              {/* Content Display */}
              <div className="space-y-6">
                {data.chapter.data.map((html: any, index: number) => (
                  <div key={index} className="prose prose-sm max-w-none">
                    <div
                      dangerouslySetInnerHTML={{ __html: html }}
                      className="text-gray-700 leading-relaxed"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Chapter completion button */}
        <div className="mt-6 sm:mt-8 flex justify-end">
          <button
            onClick={handleClickComplete}
            className={`px-3 sm:px-4 py-2 rounded-lg flex items-center space-x-2 transition duration-150 text-sm sm:text-base ${
              isCompleted
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-ColorThree text-white hover:shadow-md"
            }`}
          >
            <span>{isCompleted ? "Completed" : "Mark as Complete"}</span>
            {isCompleted && (
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
  )
}
