"use client"
import { X, Loader2 } from "lucide-react"
import { useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { useParams } from "next/navigation"

// Dialog component for adding a new chapter
const AddChapterDialog = ({ isOpen, onClose, onAddChapter }: any) => {
  const [chapterTitle, setChapterTitle] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { subjectId, classId, weekId, lessionId } = useParams()
  console.log("isOpen: ", isOpen)
  if (!isOpen) return null

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (chapterTitle.trim()) {
      setIsSubmitting(true)
      try {
        const res = await axios.post(
          `/api/classes/my-class/${classId}/classNotes/${subjectId}/${weekId}/${lessionId}/chapter`,
          {
            title: chapterTitle
          }
        )
        console.log(res)
        if (res.status === 201) {
          const result = await onAddChapter(res.data.chapter)
          if (result) {
            toast.success(res.data.message || "Chapter added successfully")
          }
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          toast.error(error.response.data.message || "Failed to add week")
        } else {
          toast.error("An unexpected error occurred")
        }
      } finally {
        setIsSubmitting(false)
        setChapterTitle("")
        onClose()
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md animate-scaleIn">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-TextTwo">Add New Chapter</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-TextTwo transition-colors"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="chapterTitle"
              className="block text-sm font-medium text-TextTwo mb-2"
            >
              chapter Title
            </label>
            <input
              id="chapterTitle"
              type="text"
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
              placeholder="e.g., Introduction to Python"
              className="w-full p-3 bg-lamaSkyLight border border-lamaSky rounded-lg text-TextTwo 
                focus:outline-none focus:ring-2 focus:ring-ColorTwo focus:border-transparent
                transition-all duration-200"
              autoFocus
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 text-TextTwo rounded-lg 
                hover:bg-gray-100 transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !chapterTitle.trim()}
              className={`px-4 py-2 bg-gradient-to-r from-ColorThree to-ColorTwo rounded-lg 
                text-white font-medium flex items-center justify-center min-w-24
                transition-all duration-200 ${isSubmitting ? "opacity-70" : "hover:shadow-md"}`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Chapter"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddChapterDialog
