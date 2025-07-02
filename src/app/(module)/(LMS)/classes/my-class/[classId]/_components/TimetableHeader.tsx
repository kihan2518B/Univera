import React, { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Save,
  ZoomIn,
  ZoomOut,
  Upload,
  Info,
  ChevronDown,
  Settings,
  FileText,
  BookOpen,
  Users,
  Coffee,
  FlaskConical,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"

interface TimetableHeaderProps {
  isCoordinator: boolean
  isStudent: boolean
  handleZoom: (delta: number) => void
  saveTimetableSlotsToDb: () => Promise<void>
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  downloadTemplate?: () => void
  backButtonUrl?: string
}

const TimetableHeader: React.FC<TimetableHeaderProps> = ({
  isCoordinator,
  handleZoom,
  saveTimetableSlotsToDb,
  isStudent,
  handleFileChange,
  downloadTemplate,
  backButtonUrl
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [showControls, setShowControls] = useState(false)
  const [savedAnimation, setSavedAnimation] = useState(false)

  const triggerFileInput = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  // Toggle controls visibility on mobile
  const toggleControls = () => {
    setShowControls((prev) => !prev)
  }

  // Save with animation effect
  const handleSave = async () => {
    setSavedAnimation(true)
    await saveTimetableSlotsToDb()
    setTimeout(() => setSavedAnimation(false), 2000)
  }

  return (
    <>
      {backButtonUrl && (
        <div className="mb-1 px-2 py-1 rounded w-fit border border-Dark">
          <Link
            href={backButtonUrl ?? "#"}
            className="flex items-center text-TextTwo "
          >
            <ArrowLeft size={18} className="mr-2" />
            Back
          </Link>
        </div>
      )}
      <div className="w-full bg-white shadow-sm rounded-lg mb-1">
        {/* Main header container with gradient border top */}
        <div className="rounded-t-lg px-4 py-4 sm:py-5">
          <div className="flex flex-col small:flex-row justify-between items-start lg:items-center gap-4">
            {/* Title section */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 rounded-full bg-blue-50 items-center justify-center shadow-sm">
                <Calendar className="text-blue-600" size={20} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Class Timetable
                </h2>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Manage and view class schedules
                </p>
              </div>
            </div>

            {/* Action buttons for larger screens */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Access indicator */}
              {!isStudent && !isCoordinator && (
                <div className="bg-amber-50 border border-amber-100 text-red-500 px-3 py-2 rounded-lg flex items-center gap-2">
                  <Info size={16} className="text-red-500 flex-shrink-0" />
                  <p className="text-sm font-medium">
                    View-only mode: Coordinator access required for editing
                  </p>
                </div>
              )}

              {/* Action buttons for coordinators */}
              {isCoordinator && (
                <>
                  <Button
                    onClick={downloadTemplate}
                    className="bg-purple-500 hover:bg-purple-600 text-white font-medium px-3 py-2 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all"
                    title="Download Template"
                  >
                    <FileText size={16} />
                    <span>Download Template</span>
                  </Button>

                  <Button
                    onClick={triggerFileInput}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-3 py-2 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all"
                    title="Upload Timetable"
                  >
                    <Upload size={16} />
                    <span>Upload Timetable</span>
                  </Button>

                  <Button
                    onClick={handleSave}
                    className={`${
                      savedAnimation
                        ? "bg-green-500 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    } font-medium px-4 py-2 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all`}
                    title="Save Timetable"
                    disabled={savedAnimation}
                  >
                    {savedAnimation ? (
                      <>
                        <span className="inline-block animate-bounce">✓</span>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        <span>Save</span>
                      </>
                    )}
                  </Button>
                </>
              )}

              {/* Zoom controls */}
              <div className="flex bg-gray-50 rounded-lg p-1 border border-gray-200">
                <Button
                  onClick={() => handleZoom(-0.1)}
                  className="bg-transparent hover:bg-gray-100 text-gray-700 px-2 rounded-l-md"
                  aria-label="Zoom Out"
                >
                  <ZoomOut size={18} />
                </Button>
                <div className="h-full w-px bg-gray-200"></div>
                <Button
                  onClick={() => handleZoom(0.1)}
                  className="bg-transparent hover:bg-gray-100 text-gray-700 px-2 rounded-r-md"
                  aria-label="Zoom In"
                >
                  <ZoomIn size={18} />
                </Button>
              </div>
            </div>

            {/* Mobile toggle button */}
            <button
              onClick={toggleControls}
              className="mx-auto small:mx-0 lg:hidden flex items-center text-gray-600 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg border border-gray-200 shadow-sm transition-all"
              aria-expanded={showControls}
              aria-controls="timetable-controls"
            >
              <Settings size={16} className="mr-2" />
              <span className="text-sm font-medium">Controls</span>
              <ChevronDown
                size={16}
                className={`ml-2 transition-transform duration-300 ${showControls ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Mobile controls panel - slides down when active */}
        <div
          id="timetable-controls"
          className={`
          overflow-hidden transition-all lg:hidden duration-300 ease-in-out  border-t border-gray-100
          ${showControls ? "max-h-96 py-4" : "max-h-0"}
        `}
        >
          <div className="px-4 space-y-4">
            {/* Hidden file input */}
            <input
              type="file"
              ref={inputRef}
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
              aria-label="Upload Excel file"
            />

            {/* Non-coordinator notice */}
            {!isStudent && !isCoordinator && (
              <div className="bg-amber-50 border border-amber-100 text-red-500 px-3 py-3 rounded-lg flex items-center gap-2">
                <Info size={18} className="text-red-500 flex-shrink-0" />
                <p className="text-sm font-medium">
                  View-only mode: Coordinator access required for editing
                </p>
              </div>
            )}

            {/* Control buttons group */}
            {isCoordinator && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button
                  onClick={downloadTemplate}
                  className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all"
                  title="Download Template"
                >
                  <FileText size={18} />
                  <span>Download Template</span>
                </Button>

                <Button
                  onClick={triggerFileInput}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all"
                  title="Upload Timetable"
                >
                  <Upload size={18} />
                  <span>Upload Timetable</span>
                </Button>

                <Button
                  onClick={handleSave}
                  className={`${
                    savedAnimation
                      ? "bg-green-500 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  } font-medium py-3 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all`}
                  title="Save Timetable"
                  disabled={savedAnimation}
                >
                  {savedAnimation ? (
                    <>
                      <span className="inline-block animate-bounce">✓</span>
                      <span>Saved Successfully!</span>
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>Save Timetable</span>
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Zoom controls */}
            <div className="flex justify-center">
              <div className="inline-flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
                <Button
                  onClick={() => handleZoom(-0.1)}
                  className="bg-transparent hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-l-md"
                  aria-label="Zoom Out"
                  title="Zoom Out"
                >
                  <ZoomOut size={18} className="mr-2" />
                  <span>Zoom Out</span>
                </Button>
                <div className="h-full w-px bg-gray-200"></div>
                <Button
                  onClick={() => handleZoom(0.1)}
                  className="bg-transparent hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-r-md"
                  aria-label="Zoom In"
                  title="Zoom In"
                >
                  <ZoomIn size={18} className="mr-2" />
                  <span>Zoom In</span>
                </Button>
              </div>
            </div>

            {/* Legend */}
            <div className="pt-2 border-t border-gray-200">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="flex items-center gap-2 bg-white p-2 rounded-md border border-gray-100">
                  <div className="w-4 h-4 rounded-full bg-blue-100 border-2 border-blue-300 flex-shrink-0"></div>
                  <span className="text-sm text-gray-700 flex items-center gap-1">
                    <BookOpen size={14} className="text-blue-400" />
                    Lecture
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white p-2 rounded-md border border-gray-100">
                  <div className="w-4 h-4 rounded-full bg-purple-100 border-2 border-purple-300 flex-shrink-0"></div>
                  <span className="text-sm text-gray-700 flex items-center gap-1">
                    <FlaskConical size={14} className="text-purple-400" />
                    Lab
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white p-2 rounded-md border border-gray-100">
                  <div className="w-4 h-4 rounded-full bg-amber-100 border-2 border-amber-300 flex-shrink-0"></div>
                  <span className="text-sm text-gray-700 flex items-center gap-1">
                    <Users size={14} className="text-amber-400" />
                    Seminar
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white p-2 rounded-md border border-gray-100">
                  <div className="w-4 h-4 rounded-full bg-green-100 border-2 border-green-300 flex-shrink-0"></div>
                  <span className="text-sm text-gray-700 flex items-center gap-1">
                    <Coffee size={14} className="text-green-400" />
                    Break
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend for larger screens - always visible */}
        <div className="hidden lg:flex items-center justify-end gap-4 px-4 py-2 rounded-b-lg border-t border-gray-100">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-100 border-2 border-blue-300"></div>
            <span className="text-xs text-gray-600 flex items-center">
              <BookOpen size={12} className="text-blue-400 mr-1" />
              Lecture
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-purple-100 border-2 border-purple-300"></div>
            <span className="text-xs text-gray-600 flex items-center">
              <FlaskConical size={12} className="text-purple-400 mr-1" />
              Lab
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-amber-100 border-2 border-amber-300"></div>
            <span className="text-xs text-gray-600 flex items-center">
              <Users size={12} className="text-amber-400 mr-1" />
              Seminar
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-100 border-2 border-green-300"></div>
            <span className="text-xs text-gray-600 flex items-center">
              <Coffee size={12} className="text-green-400 mr-1" />
              Break
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export default TimetableHeader
