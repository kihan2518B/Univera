"use client"
import { Loader2, X } from "lucide-react"
import { useEffect, useState } from "react"

// Edit chapter Dialog Component
const EditChapterDialog = ({
  isOpen,
  onClose,
  onEditChapter,
  chapterId,
  initialTitle
}) => {
  const [title, setTitle] = useState(initialTitle)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setTitle(initialTitle)
  }, [initialTitle])

  if (!isOpen) return null
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onEditChapter(chapterId, title)
      onClose()
    } catch (error) {
      console.error("Error editing week:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-TextTwo">Edit Chapter</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-TextTwo"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="chapterTitle"
              className="block text-sm font-medium text-TextTwo mb-1"
            >
              Chapter Title
            </label>
            <input
              type="text"
              id="chapterTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ColorTwo focus:border-transparent"
              placeholder="Enter chapter title"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-TextTwo rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-ColorThree text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditChapterDialog
