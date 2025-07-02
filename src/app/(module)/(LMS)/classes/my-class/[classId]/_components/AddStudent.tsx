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
    const matchedStudents = unAssignedStudents?.filter((student) =>
      rollNumbers.includes(student.rollNo.toString())
    )

    if (matchedStudents.length !== 0) {
      const matchedIds = matchedStudents.map((student) => student.id)
      setSelectedStudents((prev) =>
        Array.from(new Set([...prev, ...matchedIds]))
      )
      toast.success("Roll numbers selected!")
    } else {
      toast.error(
        "No unassigned students found with the provided roll numbers."
      )
    }
    setManualRollNos("")
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
    // <Dialog open={true} onOpenChange={onClose}>
    //   <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-white p-0">
    //     <DialogHeader className="p-6 border-b border-gray-100">
    //       <DialogTitle className="text-xl font-bold text-TextTwo">
    //         Add Students
    //       </DialogTitle>
    //     </DialogHeader>

    //     <div className="p-6 space-y-6">
    //       <div className="flex flex-col md:flex-row gap-4">
    //         <div className="flex-1 relative">
    //           <Input
    //             type="text"
    //             placeholder="Enter roll numbers (comma-separated)"
    //             value={manualRollNos}
    //             onChange={(e) => setManualRollNos(e.target.value)}
    //             className="pl-10 border-gray-200 focus:border-ColorThree focus:ring-ColorThree/20"
    //           />
    //           <Search
    //             size={18}
    //             className="absolute left-3 top-3 text-gray-400"
    //           />
    //         </div>
    //         <button
    //           onClick={handleManualRollNos}
    //           disabled={!manualRollNos.trim()}
    //           className="px-6 py-2.5 bg-gradient-to-r from-ColorThree to-ColorTwo text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
    //         >
    //           <Plus size={18} />
    //           Select Roll Numbers
    //         </button>
    //       </div>

    //       <div className="relative">
    //         <Input
    //           type="text"
    //           placeholder="Search students..."
    //           value={searchQuery}
    //           onChange={(e) => setSearchQuery(e.target.value)}
    //           className="pl-10 border-gray-200 focus:border-ColorThree focus:ring-ColorThree/20"
    //         />
    //         <Search size={18} className="absolute left-3 top-3 text-gray-400" />
    //       </div>

    //       <div className="rounded-lg border border-gray-100 overflow-hidden">
    //         <Table>
    //           <TableHeader>
    //             <TableRow className="bg-gradient-to-r from-ColorThree to-ColorTwo">
    //               <TableHead className="text-white font-semibold">
    //                 Roll No
    //               </TableHead>
    //               <TableHead className="text-white font-semibold">
    //                 Name
    //               </TableHead>
    //               <TableHead className="text-white font-semibold">
    //                 Email
    //               </TableHead>
    //               <TableHead className="text-white font-semibold">
    //                 Year
    //               </TableHead>
    //               <TableHead className="text-white font-semibold">
    //                 Semester
    //               </TableHead>
    //               <TableHead className="text-white font-semibold text-center w-20">
    //                 Select
    //               </TableHead>
    //             </TableRow>
    //           </TableHeader>
    //           <TableBody>
    //             {filteredStudents?.length === 0 ? (
    //               <TableRow>
    //                 <TableCell colSpan={6} className="text-center text-TextTwo">
    //                   No students found
    //                 </TableCell>
    //               </TableRow>
    //             ) : (
    //               filteredStudents?.map((student) => (
    //                 <TableRow
    //                   key={student.id}
    //                   className="hover:bg-lamaSkyLight transition-colors"
    //                 >
    //                   <TableCell className="text-TextTwo">
    //                     {student.rollNo}
    //                   </TableCell>
    //                   <TableCell className="text-TextTwo font-medium">
    //                     {student.user.name}
    //                   </TableCell>
    //                   <TableCell className="text-TextTwo">
    //                     {student.user.email}
    //                   </TableCell>
    //                   <TableCell className="text-TextTwo">
    //                     {student.year}
    //                   </TableCell>
    //                   <TableCell className="text-TextTwo">
    //                     {student.semester}
    //                   </TableCell>
    //                   <TableCell>
    //                     <div className="flex justify-center">
    //                       <Checkbox
    //                         checked={selectedStudents.includes(student.id)}
    //                         onCheckedChange={() =>
    //                           handleCheckboxChange(student.id)
    //                         }
    //                         className="border-gray-300 data-[state=checked]:bg-ColorThree data-[state=checked]:border-ColorThree"
    //                       />
    //                     </div>
    //                   </TableCell>
    //                 </TableRow>
    //               ))
    //             )}
    //           </TableBody>
    //         </Table>
    //       </div>
    //     </div>

    //     <DialogFooter className="p-6 border-t border-gray-100 bg-lamaSkyLight/50">
    //       <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 w-full">
    //         <button
    //           disabled={isSubmitting}
    //           onClick={onClose}
    //           className="px-6 py-2.5 bg-white border border-gray-200 text-TextTwo rounded-lg hover:bg-gray-50 transition-colors font-medium"
    //         >
    //           Cancel
    //         </button>
    //         <button
    //           onClick={handleSubmit}
    //           disabled={isSubmitting || selectedStudents.length === 0}
    //           className="px-6 py-2.5 bg-gradient-to-r from-ColorThree to-ColorTwo text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
    //         >
    //           {isSubmitting && <Loader2 size={18} className="animate-spin" />}
    //           {isSubmitting ? "Adding..." : "Add Selected Students"}
    //         </button>
    //       </div>
    //     </DialogFooter>
    //   </DialogContent>
    // </Dialog>
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:w-[90vw] md:w-[85vw] lg:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden bg-white p-0 mx-2 sm:mx-4">
        <DialogHeader className="p-3 sm:p-4 md:p-6 border-b border-gray-100 flex-shrink-0">
          <DialogTitle className="text-lg sm:text-xl font-bold text-TextTwo">
            Add Students
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
            {/* Manual Roll Number Input Section */}
            <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="Enter roll numbers (comma-separated)"
                  value={manualRollNos}
                  onChange={(e) => setManualRollNos(e.target.value)}
                  className="pl-8 sm:pl-10 pr-3 py-2 sm:py-2.5 border-gray-200 focus:border-ColorThree focus:ring-ColorThree/20 text-sm sm:text-base w-full"
                />
                <Search
                  size={16}
                  className="absolute left-2.5 sm:left-3 top-2.5 sm:top-3 text-gray-400 sm:w-[18px] sm:h-[18px]"
                />
              </div>
              <button
                onClick={handleManualRollNos}
                disabled={!manualRollNos.trim()}
                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-ColorThree to-ColorTwo text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base min-h-[40px] sm:min-h-[44px]"
              >
                <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="hidden sm:inline">Select Roll Numbers</span>
                <span className="sm:hidden">Select</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 sm:pl-10 pr-3 py-2 sm:py-2.5 border-gray-200 focus:border-ColorThree focus:ring-ColorThree/20 text-sm sm:text-base w-full"
              />
              <Search
                size={16}
                className="absolute left-2.5 sm:left-3 top-2.5 sm:top-3 text-gray-400 sm:w-[18px] sm:h-[18px]"
              />
            </div>

            {/* Students Table */}
            <div className="rounded-lg border border-gray-100 overflow-hidden">
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-ColorThree to-ColorTwo">
                      <TableHead className="text-white font-semibold text-sm lg:text-base">
                        Roll No
                      </TableHead>
                      <TableHead className="text-white font-semibold text-sm lg:text-base">
                        Name
                      </TableHead>
                      <TableHead className="text-white font-semibold text-sm lg:text-base">
                        Email
                      </TableHead>
                      <TableHead className="text-white font-semibold text-sm lg:text-base">
                        Year
                      </TableHead>
                      <TableHead className="text-white font-semibold text-sm lg:text-base">
                        Semester
                      </TableHead>
                      <TableHead className="text-white font-semibold text-center w-16 lg:w-20 text-sm lg:text-base">
                        Select
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents?.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center text-TextTwo py-8 text-sm lg:text-base"
                        >
                          No students found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStudents?.map((student) => (
                        <TableRow
                          key={student.id}
                          className="hover:bg-lamaSkyLight transition-colors"
                        >
                          <TableCell className="text-TextTwo text-sm lg:text-base">
                            {student.rollNo}
                          </TableCell>
                          <TableCell className="text-TextTwo font-medium text-sm lg:text-base">
                            {student.user.name}
                          </TableCell>
                          <TableCell className="text-TextTwo text-sm lg:text-base">
                            {student.user.email}
                          </TableCell>
                          <TableCell className="text-TextTwo text-sm lg:text-base">
                            {student.year}
                          </TableCell>
                          <TableCell className="text-TextTwo text-sm lg:text-base">
                            {student.semester}
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center">
                              <Checkbox
                                checked={selectedStudents.includes(student.id)}
                                onCheckedChange={() =>
                                  handleCheckboxChange(student.id)
                                }
                                className="border-gray-300 data-[state=checked]:bg-ColorThree data-[state=checked]:border-ColorThree w-4 h-4 lg:w-5 lg:h-5"
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden">
                {filteredStudents?.length === 0 ? (
                  <div className="text-center text-TextTwo py-8 px-4 text-sm">
                    No students found
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredStudents?.map((student) => (
                      <div
                        key={student.id}
                        className="p-4 hover:bg-lamaSkyLight transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {student.rollNo}
                              </span>
                              <span className="text-xs text-gray-500">
                                Year {student.year} - Sem {student.semester}
                              </span>
                            </div>
                            <h4 className="font-medium text-TextTwo text-sm mb-1 truncate">
                              {student.user.name}
                            </h4>
                            <p className="text-xs text-gray-600 truncate">
                              {student.user.email}
                            </p>
                          </div>
                          <div className="flex-shrink-0 pt-1">
                            <Checkbox
                              checked={selectedStudents.includes(student.id)}
                              onCheckedChange={() =>
                                handleCheckboxChange(student.id)
                              }
                              className="border-gray-300 data-[state=checked]:bg-ColorThree data-[state=checked]:border-ColorThree w-5 h-5"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-3 flex-shrink-0">
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 w-full">
            <button
              disabled={isSubmitting}
              onClick={onClose}
              className="px-4 sm:px-6 py-2 sm:py-2.5 bg-white border border-gray-200 text-TextTwo rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base min-h-[40px] sm:min-h-[44px]"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || selectedStudents.length === 0}
              className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-ColorThree to-ColorTwo text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base min-h-[40px] sm:min-h-[44px]"
            >
              {isSubmitting && (
                <Loader2
                  size={16}
                  className="animate-spin sm:w-[18px] sm:h-[18px]"
                />
              )}
              <span className="hidden sm:inline">
                {isSubmitting ? "Adding..." : "Add Selected Students"}
              </span>
              <span className="sm:hidden">
                {isSubmitting ? "Adding..." : "Add Students"}
              </span>
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
