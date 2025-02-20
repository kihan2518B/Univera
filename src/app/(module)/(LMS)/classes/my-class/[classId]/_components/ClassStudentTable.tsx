import { Trash2, Search } from "lucide-react"
import { StudentsWithRelation } from "../students/page"
import axios from "axios"
import toast from "react-hot-toast"
import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

type ClassStudentsTableProps = {
  students: StudentsWithRelation[]
  classId: string
  onDeleteSuccess: () => void
}

export const ClassStudentTable = ({
  students,
  classId,
  onDeleteSuccess
}: ClassStudentsTableProps) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const AssignedStudents = students.filter(
    (student) => student.classId === Number(classId)
  )

  const filteredStudents = AssignedStudents.filter(
    (student) =>
      student.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNo.toString().includes(searchQuery) ||
      student.prn.toString().includes(searchQuery)
  )

  const handleConfirmDelete = async () => {
    if (!studentToDelete) return

    setIsDeleting(true)
    try {
      await axios.patch(
        `/api/classes/my-class/${classId}/students`,
        {
          studentId: studentToDelete
        },
        {
          params: {
            removeStudent: true
          }
        }
      )
      toast.success("Student removed successfully!")
      onDeleteSuccess()
    } catch (error) {
      console.log(error)
      toast.error("Failed to remove student.")
    } finally {
      setIsDeleting(false)
      setStudentToDelete(null)
    }
  }

  if (AssignedStudents.length === 0) {
    return (
      <div className="text-center py-12 bg-lamaSkyLight rounded-lg border border-lamaSky">
        <p className="text-TextTwo text-lg">
          No students assigned to this class yet.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by name, email or roll number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white border-gray-200 focus:border-ColorThree focus:ring-ColorThree/20"
        />
      </div>

      <div className="rounded-lg border border-gray-100 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-ColorThree to-ColorTwo">
              <TableHead className="text-white font-semibold">
                Profile
              </TableHead>
              <TableHead className="text-white font-semibold">
                Roll No
              </TableHead>
              <TableHead className="text-white font-semibold">Prn</TableHead>
              <TableHead className="text-white font-semibold">Name</TableHead>
              <TableHead className="text-white font-semibold">Email</TableHead>
              <TableHead className="text-white font-semibold text-center w-20">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow
                key={student.id}
                className="hover:bg-lamaSkyLight transition-colors duration-150"
              >
                <TableCell>
                  <div className="relative h-10 w-10">
                    <img
                      src={
                        student.user.imageUrl ||
                        "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yb21XZWFLSWtueG5RZFFSSWlsaDBZa2JlUEMiLCJyaWQiOiJ1c2VyXzJxdHpNR25LQTJPcTNQS0hQdzM3YXdiMHB5dSIsImluaXRpYWxzIjoiViJ9"
                      }
                      alt={`${student.user.name}'s profile`}
                      className="rounded-full object-cover"
                      width={40}
                      height={40}
                    />
                  </div>
                </TableCell>
                <TableCell className="text-TextTwo">{student.rollNo}</TableCell>
                <TableCell className="text-TextTwo">
                  {student.prn ?? "NA"}
                </TableCell>
                <TableCell className="text-TextTwo font-medium">
                  {student.user.name}
                </TableCell>
                <TableCell className="text-TextTwo">
                  {student.user.email}
                </TableCell>
                <TableCell className="text-center">
                  <button
                    onClick={() => setStudentToDelete(student.id)}
                    className="p-2 hover:bg-red-50 rounded-full transition-colors duration-150 group disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Delete student"
                    disabled={isDeleting}
                  >
                    <Trash2
                      size={18}
                      className="text-red-400 group-hover:text-red-500 transition-colors duration-150"
                    />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={!!studentToDelete}
        onOpenChange={() => setStudentToDelete(null)}
      >
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will remove the student from this class. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <Button
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600 focus:ring-red-500 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? "Removing..." : "Remove Student"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
