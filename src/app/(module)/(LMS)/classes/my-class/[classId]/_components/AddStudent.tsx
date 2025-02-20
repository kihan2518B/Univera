import { useState } from "react"
import { StudentsWithRelation } from "../students/page"
import axios from "axios"
import toast from "react-hot-toast"
import { Plus, Search, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

type AddStudentsDialogProps = {
  classId: string
  onClose: () => void
  onAddSuccess: () => void
  students: StudentsWithRelation[]
}

export const AddStudentsDialog = ({
  classId,
  onClose,
  onAddSuccess,
  students
}: AddStudentsDialogProps) => {
  const unAssignedStudents = students?.filter((student) => !student.classId)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [manualRollNos, setManualRollNos] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredStudents = unAssignedStudents?.filter(
    (student) =>
      student.rollNo.toString().includes(searchQuery) ||
      student.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCheckboxChange = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    )
  }

  const handleManualRollNos = () => {
    const rollNumbers = manualRollNos.split(",").map((roll) => roll.trim())
    const matchedStudents = students?.filter((student) =>
      rollNumbers.includes(student.rollNo.toString())
    )

    if (matchedStudents) {
      const matchedIds = matchedStudents.map((student) => student.id)
      setSelectedStudents((prev) =>
        Array.from(new Set([...prev, ...matchedIds]))
      )
      setManualRollNos("")
    }
    toast.success("Roll numbers selected!")
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await axios.patch(`/api/classes/my-class/${classId}/students`, {
        classId,
        roleNumbers: selectedStudents
      })
      toast.success("Students added successfully!")
      onAddSuccess()
      onClose()
    } catch (error) {
      console.log(error)
      toast.error("Failed to add students.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-white p-0">
        <DialogHeader className="p-6 border-b border-gray-100">
          <DialogTitle className="text-xl font-bold text-TextTwo">
            Add Students
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Enter roll numbers (comma-separated)"
                value={manualRollNos}
                onChange={(e) => setManualRollNos(e.target.value)}
                className="pl-10 border-gray-200 focus:border-ColorThree focus:ring-ColorThree/20"
              />
              <Search
                size={18}
                className="absolute left-3 top-3 text-gray-400"
              />
            </div>
            <button
              onClick={handleManualRollNos}
              className="px-6 py-2.5 bg-gradient-to-r from-ColorThree to-ColorTwo text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Plus size={18} />
              Select Roll Numbers
            </button>
          </div>

          <div className="relative">
            <Input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-200 focus:border-ColorThree focus:ring-ColorThree/20"
            />
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
          </div>

          <div className="rounded-lg border border-gray-100 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-ColorThree to-ColorTwo">
                  <TableHead className="text-white font-semibold">
                    Roll No
                  </TableHead>
                  <TableHead className="text-white font-semibold">
                    Name
                  </TableHead>
                  <TableHead className="text-white font-semibold">
                    Email
                  </TableHead>
                  <TableHead className="text-white font-semibold">
                    Year
                  </TableHead>
                  <TableHead className="text-white font-semibold">
                    Semester
                  </TableHead>
                  <TableHead className="text-white font-semibold text-center w-20">
                    Select
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents?.map((student) => (
                  <TableRow
                    key={student.id}
                    className="hover:bg-lamaSkyLight transition-colors"
                  >
                    <TableCell className="text-TextTwo">
                      {student.rollNo}
                    </TableCell>
                    <TableCell className="text-TextTwo font-medium">
                      {student.user.name}
                    </TableCell>
                    <TableCell className="text-TextTwo">
                      {student.user.email}
                    </TableCell>
                    <TableCell className="text-TextTwo">
                      {student.year}
                    </TableCell>
                    <TableCell className="text-TextTwo">
                      {student.semester}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <Checkbox
                          checked={selectedStudents.includes(student.id)}
                          onCheckedChange={() =>
                            handleCheckboxChange(student.id)
                          }
                          className="border-gray-300 data-[state=checked]:bg-ColorThree data-[state=checked]:border-ColorThree"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <DialogFooter className="p-6 border-t border-gray-100 bg-lamaSkyLight/50">
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 w-full">
            <button
              disabled={isSubmitting}
              onClick={onClose}
              className="px-6 py-2.5 bg-white border border-gray-200 text-TextTwo rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-gradient-to-r from-ColorThree to-ColorTwo text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 size={18} className="animate-spin" />}
              {isSubmitting ? "Adding..." : "Add Selected Students"}
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
