import React, { FC, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { TableCell } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Edit2,
  Plus,
  X
} from "lucide-react"
import toast from "react-hot-toast"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import {
  DayScheduleProps,
  TableSlotCellProps,
  TimeSlotCardProps,
  TruncatedTextProps
} from "@/types/globals"

const TruncatedText: FC<TruncatedTextProps> = ({ text, className }) => {
  const textRef = useRef<HTMLDivElement | null>(null)
  const [isTruncated, setIsTruncated] = useState(false)

  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        setIsTruncated(
          textRef.current.scrollWidth > textRef.current.clientWidth
        )
      }
    }

    checkTruncation()
    window.addEventListener("resize", checkTruncation)
    return () => window.removeEventListener("resize", checkTruncation)
  }, [text])

  const content = (
    <span ref={textRef} className={`block truncate ${className}`}>
      {text}
    </span>
  )

  if (isTruncated) {
    return (
      <TooltipProvider delayDuration={50}>
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent
            side="top"
            align="center"
            className="z-50 px-2 py-1 bg-gray-800 text-white rounded-lg shadow-lg max-w-[200px] break-words text-sm"
            sideOffset={5}
          >
            {text}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return content
}

// Desktop Table Cell Component
export const TableSlotCell: React.FC<TableSlotCellProps> = ({
  selected,
  onSelect,
  onDelete,
  isCoordinator,
  isEditing,
  currentSubject,
  selectedFaculty
}) => {
  const isAssignable =
    currentSubject &&
    (currentSubject === "Break" ||
      currentSubject === "Non Academic" ||
      selectedFaculty)

  const showWarning =
    (isEditing && !currentSubject) ||
    (!selectedFaculty &&
      currentSubject !== "Break" &&
      currentSubject !== "Non Academic")

  const handleCellClick = () => {
    if (isEditing && showWarning) {
      toast.error("Please select both subject and faculty")
      return
    }
    if (isEditing && isAssignable) {
      onSelect()
    }
  }

  return (
    <TableCell className="p-2 relative group">
      <div
        className={`
            relative h-[100px] p-3 rounded-lg 
            transition-all duration-300 ease-in-out cursor-pointer
            border-2 
            ${
              selected
                ? "bg-white shadow-lg border-blue-500"
                : "bg-gray-50 border-transparent hover:border-blue-300"
            }
            ${
              isEditing && isAssignable && !selected
                ? "cursor-pointer hover:bg-blue-50 hover:shadow-md"
                : ""
            }
          `}
        onClick={handleCellClick}
      >
        {selected ? (
          <div className="flex justify-between items-start gap-1">
            <div className="flex-1 group overflow-hidden w-[95px]">
              <TruncatedText
                text={selected?.subject}
                className="font-semibold text-base md:text-lg text-gray-800 hover:text-blue-600"
              />

              {selected?.faculty && (
                <TruncatedText
                  text={selected.faculty}
                  className="mt-1 text-sm md:text-base text-gray-600 hover:text-blue-500"
                />
              )}

              {isCoordinator && (
                <div className="absolute top-1 left-2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to modify
                </div>
              )}
            </div>
            {isCoordinator && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
                className="p-0.5 mt-1 rounded-full flex-shrink-0
              transition-all duration-200
              bg-gray-100 text-gray-600
              hover:bg-red-500 hover:text-white hover:rotate-90"
              >
                <X size={16} className="transition-transform duration-200" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full space-y-3">
            {isEditing ? (
              <>
                <div
                  className="p-2 md:p-3 rounded-full
                    transition-all duration-300
                    bg-gray-100 text-gray-600
                    group-hover:bg-blue-500 group-hover:text-white"
                >
                  <Plus
                    size={20}
                    className="transition-all duration-300 group-hover:scale-110"
                  />
                </div>
                <span
                  className="text-sm md:text-base font-medium text-center
                    transition-all duration-300
                    text-gray-600 group-hover:text-blue-600"
                >
                  Click to assign
                </span>
              </>
            ) : (
              <div className="text-gray-500 flex flex-col items-center hover:scale-105 transition-transform">
                <Calendar className="h-5 w-5 md:h-6 md:w-6 mb-2" />
                <span className="text-sm md:text-base">Available</span>
              </div>
            )}
          </div>
        )}
      </div>
    </TableCell>
  )
}

// Mobile Components
const TimeSlotCard: React.FC<TimeSlotCardProps> = ({
  timeSlot,
  selected,
  onSelect,
  onDelete,
  isEditing,
  isCoordinator,
  removeTimeSlot,
  rowIndex,
  IntClassId,
  currentSubject,
  selectedFaculty
}) => {
  const isAssignable =
    currentSubject &&
    (currentSubject === "Break" ||
      currentSubject === "Non Academic" ||
      selectedFaculty)
  const showWarning =
    (isEditing && !currentSubject) ||
    (!selectedFaculty &&
      currentSubject !== "Break" &&
      currentSubject !== "Non Academic")

  const handleCellClick = () => {
    if (isEditing && showWarning) {
      toast.error("Please select both subject and faculty")
      return
    }
    if (isEditing && isAssignable) {
      onSelect()
    }
  }

  return (
    <Card
      className={`mb-2 transition-all duration-200 ${
        selected ? "border-2 border-ColorThree" : "border-lamaSky"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-ColorThree" />
            <span className="text-sm font-medium text-TextTwo">{timeSlot}</span>
          </div>
          {isCoordinator && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeTimeSlot(IntClassId, rowIndex)}
              className="text-red-500 hover:text-red-700 p-1"
            >
              <X />
            </Button>
          )}
        </div>
        {selected && (
          <div className=" flex items-center justify-between">
            <div className="mt-2 flex max-[425px]:flex-col  items-center gap-2 rounded-lg text-center">
              <p className="text-sm font-medium text-white bg-gradient-to-r from-ColorThree to-ColorTwo rounded-full h-full py-1 px-2 max-[425px]:w-full max-[425px]:px-3">
                {selected?.subject}
              </p>
              {selected?.faculty && (
                <p className="text-sm font-medium text-Dark bg-gradient-to-r from-Primary to-ColorOne rounded-full h-full py-1 px-2 max-[425px]:w-full max-[425px]:px-3">
                  {selected?.faculty}
                </p>
              )}
            </div>
            {isCoordinator && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}
        {isEditing && (
          <Button
            onClick={handleCellClick}
            className="w-full mt-2 bg-lamaSky hover:bg-ColorThree text-TextTwo hover:text-white"
            size="sm"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Update Class
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export const DaySchedule: React.FC<DayScheduleProps> = ({
  day,
  IntClassId,
  timeSlots,
  selectedSlots = {}, // Ensure selectedSlots defaults to an empty object
  onCellClick,
  isEditing,
  isCoordinator,
  removeTimeSlot,
  currentSubject,
  selectedFaculty
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const hasClasses = Object.values(selectedSlots).some((classSlots) =>
    Object.keys(classSlots).some((slotKey) => slotKey.startsWith(`${day},`))
  )

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-lamaSkyLight rounded-lg text-TextTwo font-medium"
      >
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-ColorThree" />
          <span>{day}</span>
          {hasClasses && (
            <span className="text-xs bg-ColorThree text-white px-2 py-1 rounded-full">
              Has Classes
            </span>
          )}
        </div>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {isExpanded && (
        <div className="mt-2 pl-4">
          {timeSlots.map((slot) => (
            <TimeSlotCard
              key={slot}
              timeSlot={slot}
              IntClassId={IntClassId}
              isCoordinator={isCoordinator}
              selected={selectedSlots[IntClassId]?.[`${day},${slot}`]} // Get the selected slot details
              onSelect={() => onCellClick(day, slot, IntClassId)}
              onDelete={() => onCellClick(day, slot, IntClassId, true)}
              removeTimeSlot={removeTimeSlot}
              rowIndex={timeSlots.indexOf(slot)}
              isEditing={isEditing}
              currentSubject={currentSubject}
              selectedFaculty={selectedFaculty}
            />
          ))}
        </div>
      )}
    </div>
  )
}
