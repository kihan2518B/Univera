import React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface SlotDialogProps {
  isDialogOpen: boolean
  setIsDialogOpen: (isOpen: boolean) => void
  selectedSlot: any
  selectedTime: string | null
  subjects: any[] | undefined
  selectedFaculty: string | null
  currentSubject: string
  matchedFaculty: any[] | undefined
  timeSlots: string[]
  tags: string[]
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  handleSubjectSelectChange: (value: string) => void
  handleFacultySelectChange: (value: string) => void
}

const SlotDialog: React.FC<SlotDialogProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  selectedSlot,
  selectedTime,
  subjects,
  selectedFaculty,
  currentSubject,
  matchedFaculty,
  timeSlots,
  tags,
  handleSubmit,
  handleSubjectSelectChange,
  handleFacultySelectChange
}) => {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="w-[95vw] max-w-lg mx-auto p-4 sm:p-6 rounded-xl border-2 shadow-lg bg-lamaSkyLight border-Primary overflow-y-auto max-h-[90vh]">
        <DialogHeader className="mb-4 sm:mb-6">
          <DialogTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-center text-Dark">
            Schedule Time Slot
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Subject and Faculty Selection Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-TextTwo">
                Subject
              </Label>
              <Select
                onValueChange={handleSubjectSelectChange}
                defaultValue={selectedSlot?.subject || "Non Academic"}
              >
                <SelectTrigger className="w-full h-10 transition-all duration-200 hover:border-opacity-100 bg-white border-Primary border-2">
                  <SelectValue placeholder="Select subject">
                    <span className="text-sm text-Dark">
                      {currentSubject || "Select a class"}
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="w-full max-h-[40vh] bg-lamaSkyLight">
                  {subjects?.map((subject: any) => (
                    <SelectItem
                      key={subject.id}
                      value={subject.name}
                      className="cursor-pointer transition-colors hover:bg-opacity-80"
                    >
                      {subject.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="Break" className="cursor-pointer">
                    Break
                  </SelectItem>
                  <SelectItem value="Non Academic" className="cursor-pointer">
                    Non Academic
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-TextTwo">
                Available Faculty
              </Label>
              <Select
                onValueChange={handleFacultySelectChange}
                defaultValue={selectedSlot?.faculty || ""}
                disabled={!matchedFaculty || matchedFaculty.length === 0}
              >
                <SelectTrigger className="w-full h-10 transition-all duration-200 hover:border-opacity-100 bg-white border-Primary border-2">
                  <SelectValue placeholder="Select faculty">
                    <span className="text-sm text-Dark">
                      {selectedFaculty
                        ? selectedFaculty
                        : (matchedFaculty ?? []).length > 0
                          ? "Select Faculty"
                          : "No faculty available"}
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="w-full max-h-[40vh] bg-lamaSkyLight">
                  {matchedFaculty?.map((faculty: any) => (
                    <SelectItem
                      key={faculty.user.id}
                      value={faculty.user.name}
                      className="cursor-pointer transition-colors hover:bg-opacity-80"
                    >
                      {faculty.user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Time Selection Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-TextTwo">
                Start Time
              </Label>
              <Input
                value={selectedTime || ""}
                readOnly
                name="startTime"
                className="w-full h-10 transition-all duration-200 bg-lamaPurpleLight border-Primary border-2"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-TextTwo">
                End Time
              </Label>
              <Select name="endTime" defaultValue={selectedSlot?.endTime || ""}>
                <SelectTrigger className="w-full h-10 transition-all duration-200 hover:border-opacity-100 bg-white border-Primary border-2">
                  <SelectValue placeholder="Select end time" />
                </SelectTrigger>
                <SelectContent className="w-full max-h-[40vh] bg-lamaSkyLight">
                  {timeSlots
                    .slice(
                      timeSlots.findIndex((slot) => slot === selectedTime) + 1
                    )
                    .map((slot) => (
                      <SelectItem
                        key={slot}
                        value={slot}
                        className="cursor-pointer transition-colors hover:bg-opacity-80"
                      >
                        {slot}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tag Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-TextTwo">Tag</Label>
            <Select name="tag" defaultValue={selectedSlot?.tag || ""}>
              <SelectTrigger className="w-full h-10 transition-all duration-200 hover:border-opacity-100 bg-white border-Primary border-2">
                <SelectValue placeholder="Select tag" />
              </SelectTrigger>
              <SelectContent className="w-full max-h-[40vh] bg-lamaSkyLight">
                {tags.map((tag) => (
                  <SelectItem
                    key={tag}
                    value={tag}
                    className="cursor-pointer transition-colors hover:bg-opacity-80"
                  >
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location Input */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-TextTwo">
              Location
            </Label>
            <Input
              placeholder="Enter location"
              name="location"
              defaultValue={selectedSlot?.location || ""}
              className="w-full h-10 transition-all duration-200 bg-white border-Primary border-2"
            />
          </div>

          {/* Remarks Textarea */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-TextTwo">
              Remarks
            </Label>
            <Textarea
              placeholder="Additional notes..."
              name="remarks"
              defaultValue={selectedSlot?.remarks || ""}
              className="w-full min-h-[80px] sm:min-h-[100px] transition-all duration-200 bg-white border-Primary border-2 text-Dark resize-y"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full py-2 sm:py-3 mt-2 sm:mt-4 font-semibold text-sm sm:text-base transition-all duration-200 bg-Primary text-Dark hover:opacity-90 rounded-lg"
          >
            Save Schedule
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default SlotDialog
