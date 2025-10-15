"use client"
import { X, Loader2 } from "lucide-react"
import { useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { useParams } from "next/navigation"

// Dialog component for adding a new week
const AddWeekDialog = ({ isOpen, onClose, onAddWeek }: any) => {
  const [weekTitle, setWeekTitle] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { subjectId, classId } = useParams()

  if (!isOpen) return null

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (weekTitle.trim()) {
      setIsSubmitting(true)
      try {
        const res = await axios.post(
          `/api/classes/my-class/${classId}/classNotes/${subjectId}`,
          {
            title: weekTitle
          }
        )

        if (res.status === 201) {
          const result = await onAddWeek(res.data.classNote)
          if (result) {
            toast.success(res.data.message || "Week added successfully")
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
        setWeekTitle("")
        onClose()
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md animate-scaleIn">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-TextTwo">Add New Week</h3>
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
              htmlFor="weekTitle"
              className="block text-sm font-medium text-TextTwo mb-2"
            >
              Week Title
            </label>
            <input
              id="weekTitle"
              type="text"
              value={weekTitle}
              onChange={(e) => setWeekTitle(e.target.value)}
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
              disabled={isSubmitting || !weekTitle.trim()}
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
                "Add Week"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddWeekDialog
