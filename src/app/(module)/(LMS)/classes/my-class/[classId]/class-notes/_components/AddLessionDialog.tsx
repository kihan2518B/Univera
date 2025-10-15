"use client"
import React, { useState } from "react"
import { X, Loader2 } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"
import { useParams } from "next/navigation"

interface AddLessionDialogProps {
  isOpen: boolean
  onClose: () => void
  onAddLession: (lessionTitle: string) => void
  weekId: number
}

const AddLessionDialog: React.FC<AddLessionDialogProps> = ({
  isOpen,
  onClose,
  onAddLession,
  weekId
}) => {
  const [lessionTitle, setLessionTitle] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { classId, subjectId } = useParams()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (lessionTitle.trim()) {
      setIsSubmitting(true)
      try {
        const res = await axios.post(
          `/api/classes/my-class/${classId}/classNotes/${subjectId}/${weekId}`,
          { lessionTitle },
          { params: { AddLession: true } }
        )

        if (res.status === 201) {
          toast.success(res.data.message || "Lesson added successfully")
          onAddLession(lessionTitle)
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          toast.error(error.response.data.message || "Failed to add lesson")
        } else {
          toast.error("An unexpected error occurred")
        }
      } finally {
        setIsSubmitting(false)
        setLessionTitle("")
        onClose()
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md animate-scaleIn">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-TextTwo">Add New Lesson</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-TextTwo transition-colors"
            aria-label="Close dialog"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="lessionTitle"
              className="block text-sm font-medium text-TextTwo mb-2"
            >
              Lesson Title
            </label>
            <input
              id="lessionTitle"
              type="text"
              value={lessionTitle}
              onChange={(e) => setLessionTitle(e.target.value)}
              placeholder="e.g., Chapter 1 - Introduction"
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
              disabled={isSubmitting || !lessionTitle.trim()}
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
                "Add Lesson"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddLessionDialog
