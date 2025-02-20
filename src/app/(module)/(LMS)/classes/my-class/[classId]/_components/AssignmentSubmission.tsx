import { ArrowLeft, Calendar, Edit, FileText, Tag, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Prisma } from "@prisma/client"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { getTagColor } from "./AssignmentTable"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
import AssignmentForm from "./AssignmentForm"
import { useContext } from "react"
import { UserContext } from "@/context/user"

// Dummy submissions data
const submissions = [
  {
    id: 1,
    studentId: "std1",
    studentName: "John Doe",
    createdAt: "2025-01-18T10:30:00Z",
    updatedAt: "2025-01-18T10:30:00Z"
  },
  {
    id: 2,
    studentId: "std2",
    studentName: "Jane Smith",
    createdAt: "2025-01-19T14:20:00Z",
    updatedAt: "2025-01-19T14:20:00Z"
  },
  {
    id: 3,
    studentId: "std3",
    studentName: "Mike Wilson",
    createdAt: "2025-01-20T09:15:00Z",
    updatedAt: "2025-01-20T09:15:00Z"
  }
]

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })
}

interface AssignmentSubmissionsProps {
  assignment: Prisma.AssignmentGetPayload<{ include: { submissions: true } }>
  classId: string
  subjectId: string
}

export function AssignmentSubmissions({
  assignment,
  classId,
  subjectId
}: AssignmentSubmissionsProps) {
  const router = useRouter()
  const { user } = useContext(UserContext)
  return (
    <div className="min-h-screen bg-lamaSkyLight p-6">
      {/* Back Button */}
      <button
        className="flex items-center gap-2 mb-6 text-TextTwo hover:text-ColorThree transition-colors"
        onClick={() =>
          router.push(`/classes/my-class/${classId}/assignments/${subjectId}`)
        }
      >
        <ArrowLeft size={20} />
        <span>Back to Assignments</span>
      </button>

      {/* Assignment Details Card */}
      <Card className="mb-6 sm:mb-8 border-none shadow-lg bg-white">
        <CardHeader className="border-b border-gray-100 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg sm:text-2xl font-bold text-TextTwo break-words">
              {assignment.title}
            </CardTitle>
            <Dialog>
              {/* dialog title is needed for screen readers but no need to show */}
              <DialogTitle className="hidden">Edit Assignment</DialogTitle>
              <DialogTrigger asChild>
                <ButtonV1
                  label="Edit"
                  varient="outline"
                  icon={Edit}
                  className="flex items-center gap-2"
                />
              </DialogTrigger>
              <DialogContent className="max-w-[80vw] max-h-[80vh] overflow-auto absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-lamaSkyLight">
                <AssignmentForm
                  courseId={Number(user?.courseId)}
                  userId={String(user?.id)}
                  classId={String(classId)}
                  subjectId={String(subjectId)}
                  universityId={Number(user?.universityId)}
                  departmentId={Number(user?.departmentId)}
                  userName={String(user?.name)}
                  assignment={assignment!}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <Calendar className="text-ColorThree" />
              <div>
                <p className="text-sm text-gray-500">Timeline</p>
                <p className="text-TextTwo">
                  {formatDate(assignment.startDate)} -{" "}
                  {formatDate(assignment.deadline)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="text-ColorThree" />
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="text-TextTwo">{assignment.assignmentType}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="text-ColorThree" />
              <div>
                <p className="text-sm text-gray-500">Author</p>
                <p className="text-TextTwo">{assignment.AuthorName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Tag className="text-ColorThree" />
              <div>
                <p className="text-sm text-gray-500">Tags</p>
                <div className="flex gap-2">
                  {assignment.tag.map((tag, index) => {
                    const tagColor = getTagColor(tag)
                    return (
                      <span
                        key={index}
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium transition-colors",
                          tagColor.bg,
                          tagColor.text
                        )}
                      >
                        {tag}
                      </span>
                    )
                  })}
                </div>
              </div>
            </div>
            {/* Attachment Preview */}
            {assignment.attachmentUrl && (
              <div className="flex items-center gap-3">
                <FileText className="text-ColorThree" />
                <div>
                  <p className="text-sm text-gray-500">Attachment</p>
                  <div>
                    {assignment.attachmentUrl.match(
                      /\.(jpg|jpeg|png|gif)$/i
                    ) ? (
                      <img
                        src={assignment.attachmentUrl}
                        alt="Attachment Preview"
                        className="max-w-full h-auto rounded-lg shadow-md"
                      />
                    ) : (
                      <a
                        href={assignment.attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-Primary hover:underline"
                      >
                        View Attachment
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      {/* Submissions Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-TextTwo">
          Submissions ({submissions.length})
        </h2>
        <div className="grid gap-4">
          {submissions.map((submission) => (
            <Card
              key={submission.id}
              className="border-none shadow-sm hover:shadow-md transition-shadow duration-200 bg-white"
            >
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-Primary flex items-center justify-center text-white">
                    {submission.studentName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium text-TextTwo">
                      {submission.studentName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Submitted on {formatDate(submission.createdAt)}
                    </p>
                  </div>
                </div>
                <button className="px-4 py-2 rounded-lg bg-Primary text-white hover:bg-ColorThree transition-colors">
                  View Submission
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
