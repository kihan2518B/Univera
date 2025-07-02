import clsx from "clsx"
import { Loader2 } from "lucide-react"
import { useState } from "react"

interface DeleteButtonProps {
  label: string
  onDelete: () => void
  className?: string
  isDeleting?: boolean
}

export default function DeleteButton({
  label,
  onDelete,
  isDeleting,
  className
}: DeleteButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const btnClassName = clsx(
    "bg-Primary text-black text-md hover:bg-red-500 hover:text-white rounded-lg px-4 py-2",
    className
  )
  if (showConfirm) {
    return (
      <div className="fixed bg-black/80 inset-0 flex items-center h-full justify-center">
        <div className="bg-white p-4 rounded-lg">
          <div>Are you sure you want to delete?</div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-2">
            <button
              onClick={() => setShowConfirm(false)}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-red-600 border border-red-600
                  w-full sm:w-auto hover:bg-red-50 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onDelete()
                setShowConfirm(false)
              }}
              disabled={isDeleting}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 
                  transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              {isDeleting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Deleting...
                </>
              ) : (
                "Confirm Delete"
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <button
      type="button"
      className={btnClassName}
      onClick={() => setShowConfirm(true)}
    >
      {label}
    </button>
  )
}
