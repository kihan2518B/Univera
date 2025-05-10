import React from "react"
import { Clock, Calendar, Plus, Trash2, User, MapPin } from "lucide-react"

interface TimetableGridProps {
  containerRef: React.RefObject<HTMLDivElement>
  contentRef: React.RefObject<HTMLDivElement>
  scale: number
  days: string[]
  timeSlots: string[]
  shouldRenderSlot: (
    day: string,
    time: string
  ) => {
    render: boolean
    data?: any
    span?: number
  }
  isCoordinator: boolean
  handleSlotClick: (day: string, time: string) => void
  handleDeleteSlot: (day: string, time: string) => Promise<void>
  getBackgroundColor: (tag: string) => string
  getBorderColor: (tag: string) => string
  getTagClass: (tag: string) => string
  getIconForTag: (tag: string) => React.ReactNode
  isDeleteDialogOpen: boolean
  setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  slotToDelete: { day: string; time: string } | null
  setSlotToDelete: React.Dispatch<
    React.SetStateAction<{ day: string; time: string } | null>
  >
}

const TimetableGrid: React.FC<TimetableGridProps> = ({
  containerRef,
  contentRef,
  scale,
  days,
  timeSlots,
  shouldRenderSlot,
  isCoordinator,
  handleSlotClick,
  handleDeleteSlot,
  getBackgroundColor,
  getBorderColor,
  getTagClass,
  getIconForTag,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  slotToDelete,
  setSlotToDelete
}) => {
  return (
    <>
      <div
        ref={containerRef}
        className="overflow-auto rounded-lg shadow-md bg-white"
        style={{ maxHeight: "calc(100vh - 200px)" }}
      >
        <div
          ref={contentRef}
          className="min-w-[800px] relative"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            transition: "transform 0.3s ease"
          }}
        >
          <div className="grid grid-cols-7 bg-lamaSkyLight">
            <div className="top-0 z-10 border-b border-r p-3 text-center font-bold bg-gradient-to-r from-blue-50 to-blue-100 text-gray-800 shadow-sm flex items-center justify-center">
              <Clock size={18} className="mr-2 text-blue-500" />
              <span>Time</span>
            </div>

            {/* Day headers */}
            {days.map((day, index) => (
              <div
                key={index}
                className="top-0 z-10 border-b border-r p-3 text-center font-bold bg-gradient-to-r from-blue-50 to-blue-100 text-gray-800 shadow-sm"
              >
                {<Calendar size={16} className="mb-1 mx-auto text-blue-500" />}{" "}
                {day}
              </div>
            ))}

            {/* Time slots for the first column and the grid */}
            {timeSlots.map((time, i) => (
              <React.Fragment key={`time-slot-${i}`}>
                <div
                  key={`time-${i}`}
                  className="border-b border-r p-2 text-center font-medium bg-gray-50 text-gray-600 flex items-center justify-center"
                >
                  <span>{time}</span>
                </div>

                {days.map((day, j) => {
                  const slotStatus = shouldRenderSlot(day, time)
                  if (!slotStatus.render) return null

                  return (
                    <div
                      key={`slot-${i}-${j}`}
                      className={`border rounded-lg p-3 cursor-pointer transition-all hover:shadow-md flex justify-center items-center relative overflow-hidden group`}
                      style={{
                        minHeight: "80px",
                        gridRow: `span ${slotStatus.span || 1}`,
                        backgroundColor: getBackgroundColor(
                          slotStatus.data?.tag
                        ),
                        borderColor: getBorderColor(slotStatus.data?.tag)
                      }}
                      onClick={() => {
                        if (isCoordinator) handleSlotClick(day, time)
                      }}
                    >
                      {slotStatus.data ? (
                        <div className="flex flex-col gap-1.5 text-sm w-full relative z-10">
                          <div className="absolute top-0 right-0 -z-50 ">
                            {getIconForTag(slotStatus.data.tag)}
                          </div>

                          {isCoordinator && (
                            <button
                              className="absolute bottom-0 right-0 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-white/80 rounded-full p-1.5 transition-all transform hover:scale-110"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSlotToDelete({ day, time })
                                setIsDeleteDialogOpen(true)
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          )}

                          <p className="font-bold text-gray-800">
                            {slotStatus.data.subject}
                          </p>
                          <p className="text-gray-600 flex items-center gap-1">
                            <User size={14} />{" "}
                            {slotStatus.data.faculty || "Not Assigned"}
                          </p>
                          <p className="text-gray-600 flex items-center gap-1">
                            <MapPin size={14} /> {slotStatus.data.location}
                          </p>
                          <p className="text-gray-600 flex items-center gap-1">
                            <Clock size={14} /> {slotStatus.data.startTime} -{" "}
                            {slotStatus.data.endTime}
                          </p>
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full self-start mt-1 ${getTagClass(slotStatus.data.tag)}`}
                          >
                            {slotStatus.data.tag}
                          </span>
                        </div>
                      ) : isCoordinator ? (
                        <div className="flex flex-col items-center justify-center h-full w-full text-gray-400 hover:text-gray-600 transition-colors">
                          <Plus size={20} className="mb-1" />
                          <span className="text-xs">Add Class</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full w-full text-gray-400 hover:text-gray-600 transition-colors">
                          <span className="text-xs">Empty Slot</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog - Moved outside to be properly centered */}
      {isDeleteDialogOpen && slotToDelete && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-sm w-full shadow-xl animate-in fade-in duration-200 border border-gray-100">
            <div className="flex items-center mb-3">
              <div className="bg-red-100 p-2 rounded-full mr-3">
                <Trash2 size={20} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm Deletion
              </h3>
            </div>

            <p className="text-gray-600 mb-3 pl-1">
              Are you sure you want to delete this slot?
            </p>

            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                className="px-3 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDeleteSlot(slotToDelete.day, slotToDelete.time)
                  setIsDeleteDialogOpen(false)
                }}
                className="px-3 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center"
              >
                <Trash2 size={16} className="mr-1.5" />
                Delete Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TimetableGrid
