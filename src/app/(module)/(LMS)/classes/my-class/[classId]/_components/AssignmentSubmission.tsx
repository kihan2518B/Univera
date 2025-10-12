import Link from "next/link"
import {
  ArrowLeft,
  Calendar,
  FileText,
  Users,
  Tag,
  Edit,
  ChevronDown,
  ExternalLink,
  FileIcon,
  ImageIcon,
  FileTextIcon,
  CheckCircle,
  XCircle,
  Clock,
  Circle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import axios from "axios"
import toast from "react-hot-toast"
import { useContext, useState } from "react"
import { UserContext } from "@/context/user"
import { Prisma } from "@prisma/client"
import AssignmentForm from "./AssignmentForm"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

// Helper function to format dates
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })
}

// Define types for better type safety
type AssignmentSubmissionStatus =
  | "PENDING"
  | "SUBMITTED"
  | "APPROVED"
  | "REJECTED"
  | "LATE"

type Attachment = {
  fileName: string
  fileType: string
  url: string
}

interface AssignmentSubmissionsProps {
  assignment: Prisma.AssignmentGetPayload<{
    include: {
      submissions: { include: { student: { include: { user: true } } } }
    }
  }>
  classId: string
  subjectId: string
  refetch: () => void
}

interface SubmissionStatusFormProps {
  submission: Prisma.AssignmentSubmissionGetPayload<{
    include: { student: { include: { user: true } } }
  }>
  onUpdate: (
    submissionId: number,
    newStatus: AssignmentSubmissionStatus,
    feedback: string,
    marks?: number
  ) => Promise<void>
  onClose: () => void
}

const SubmissionStatusForm = ({
  submission,
  onUpdate,
  onClose
}: SubmissionStatusFormProps) => {
  const [feedback, setFeedback] = useState(submission.feedback || "")
  const [marks, setMarks] = useState<number | undefined>(
    submission.marks || undefined
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<AssignmentSubmissionStatus>(
    submission.status as AssignmentSubmissionStatus
  )

  const statusOptions = [
    { value: "PENDING", label: "Pending", icon: <Circle size={16} /> },
    { value: "SUBMITTED", label: "Submitted", icon: <CheckCircle size={16} /> },
    { value: "APPROVED", label: "Approved", icon: <CheckCircle size={16} /> },
    { value: "REJECTED", label: "Rejected", icon: <XCircle size={16} /> },
    { value: "LATE", label: "Late", icon: <Clock size={16} /> }
  ]

  const validateFields = () => {
    if (status === "APPROVED" && (marks === undefined || marks === null)) {
      toast.error("Please enter marks")
      return false
    }
    if (!feedback) {
      toast.error("Feedback cannot be empty")
      return false
    }
    if (feedback.length > 500) {
      toast.error("Feedback cannot exceed 500 characters")
      return false
    }
    if (marks !== undefined && (marks < 0 || marks > 100)) {
      toast.error("Marks must be between 0 and 100")
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateFields()) {
      return
    }

    setIsSubmitting(true)
    await onUpdate(submission.id, status, feedback, marks)
    setIsSubmitting(false)
    onClose()
  }

  return (
    <div className="p-6 space-y-4 bg-white">
      <div className="space-y-2">
        <Label htmlFor="status" className="text-gray-700 font-medium">
          Update Status
        </Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full flex justify-between items-center"
            >
              <div className="flex items-center gap-2">
                {statusOptions.find((opt) => opt.value === status)?.icon}
                {statusOptions.find((opt) => opt.value === status)?.label}
              </div>
              <ChevronDown size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white">
            {statusOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onSelect={() =>
                  setStatus(option.value as AssignmentSubmissionStatus)
                }
                className="flex items-center gap-2"
              >
                {option.icon}
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="space-y-2">
        <Label htmlFor="feedback" className="text-gray-700 font-medium">
          Feedback
        </Label>
        <Textarea
          id="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Enter your feedback here..."
          className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
        />
      </div>
      {status === "APPROVED" && (
        <div className="space-y-2">
          <Label htmlFor="marks" className="text-gray-700 font-medium">
            Marks
          </Label>
          <Input
            id="marks"
            type="number"
            value={marks ?? ""}
            onChange={(e) => setMarks(Number(e.target.value))}
            placeholder="Enter marks"
            className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
      )}
      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          {isSubmitting ? "Updating..." : "Update"}
        </Button>
      </div>
    </div>
  )
}

const getFileIcon = (fileType: string) => {
  if (fileType.startsWith("image/")) {
    return <ImageIcon size={16} className="text-purple-600" />
  } else if (fileType.includes("pdf") || fileType.includes("document")) {
    return <FileTextIcon size={16} className="text-purple-600" />
  } else {
    return <FileIcon size={16} className="text-purple-600" />
  }
}

const getStatusColor = (status: AssignmentSubmissionStatus) => {
  switch (status) {
    case "PENDING":
      return "bg-amber-100 text-amber-800 border-amber-200"
    case "SUBMITTED":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "APPROVED":
      return "bg-green-100 text-green-800 border-green-200"
    case "REJECTED":
      return "bg-red-100 text-red-800 border-red-200"
    case "LATE":
      return "bg-orange-100 text-orange-800 border-orange-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export function AssignmentSubmissions({
  assignment,
  classId,
  subjectId,
  refetch
}: AssignmentSubmissionsProps) {
  const { user } = useContext(UserContext)
  const [selectedSubmission, setSelectedSubmission] =
    useState<Prisma.AssignmentSubmissionGetPayload<{
      include: { student: { include: { user: true } } }
    }> | null>(null)

  const handleStatusUpdate = async (
    submissionId: number,
    newStatus: AssignmentSubmissionStatus,
    feedback: string,
    marks?: number
  ) => {
    try {
      const payload = {
        status: newStatus,
        feedback,
        marks: marks !== undefined ? marks : null
      }

      const res = await axios.patch(
        `/api/classes/my-class/${classId}/assignments/${subjectId}/${assignment.id}/`,
        payload,
        {
          params: {
            SubmissionId: submissionId,
            updateAssignmentSubmission: true
          }
        }
      )
      if (res.status === 200) {
        toast.success(res.data.message)
        refetch()
        setSelectedSubmission(null) // This closes the dialog
      } else {
        toast.error(res.data.message ?? "Error while updating status")
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data.message ??
            "Something went wrong, try again later"
        )
      } else {
        toast.error("Something went wrong, try again later")
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className=" mx-auto px-4 py-4">
          <Link
            href={`/classes/my-class/${classId}/assignments/${assignment.subjectId}`}
            className="inline-flex items-center text-ColorTwo hover:text-ColorTwo/70 font-medium"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Assignments
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Assignment Details Card */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-100 text-ColorThree">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-xl font-semibold break-words">
                {assignment.title}
              </CardTitle>
              <Dialog>
                <DialogTitle className="hidden">Edit Assignment</DialogTitle>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-white hover:text-white bg-white text-ColorTwo hover:bg-ColorTwo"
                  >
                    <Edit size={16} className="mr-2" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto bg-white">
                  <AssignmentForm
                    courseId={Number(user?.courseId)}
                    userId={String(user?.id)}
                    classId={String(classId)}
                    subjectId={String(subjectId)}
                    universityId={Number(user?.universityId)}
                    departmentId={Number(user?.departmentId)}
                    userName={String(user?.name)}
                    assignment={assignment}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Timeline</p>
                  <p className="text-gray-900 mt-1">
                    {formatDate(assignment.startDate)} -{" "}
                    {formatDate(assignment.deadline)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileText size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Type</p>
                  <p className="text-gray-900 mt-1">
                    {assignment.assignmentType}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Author</p>
                  <p className="text-gray-900 mt-1">{assignment.AuthorName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Tag size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Tags</p>
                  <div className="flex gap-2 flex-wrap mt-1">
                    {assignment.tag.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {assignment.attachmentUrl && (
                <div className="flex items-start gap-3 md:col-span-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FileText size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Attachment
                    </p>
                    <div className="mt-2">
                      {assignment.attachmentUrl.match(
                        /\.(jpg|jpeg|png|gif)$/i
                      ) ? (
                        <img
                          src={assignment.attachmentUrl}
                          alt="Attachment Preview"
                          className="max-w-full h-auto rounded-lg border border-gray-200"
                        />
                      ) : (
                        <a
                          href={assignment.attachmentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                        >
                          View Attachment
                          <ExternalLink size={16} />
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
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold text-gray-900">
              Submissions
            </h2>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
              {assignment.submissions.length}
            </span>
          </div>

          {assignment.submissions.length === 0 ? (
            <Card className="border-gray-200">
              <CardContent className="p-12 text-center">
                <FileText size={48} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No submissions yet
                </h3>
                <p className="text-gray-500">
                  Students haven&apos;t submitted their assignments yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {assignment.submissions.map((submission) => (
                <Card
                  key={submission.id}
                  className="border-gray-200 hover:border-purple-300 transition-colors"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* Student Info */}
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold">
                          {submission.student.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {submission.student.user.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Submitted on{" "}
                            {formatDate(
                              new Date(submission.createdAt).toISOString()
                            )}
                          </p>
                          <div className="mt-2">
                            <span
                              className={cn(
                                "px-3 py-1 rounded-full text-xs font-medium border",
                                getStatusColor(submission.status)
                              )}
                            >
                              {submission.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        {/* View Files */}
                        {(submission.attachments as Attachment[]) &&
                          Array.isArray(submission.attachments) &&
                          submission.attachments.length > 0 && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="border-gray-300 text-gray-700"
                                >
                                  View Files ({submission.attachments.length})
                                  <ChevronDown size={16} className="ml-2" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="w-64 bg-white"
                              >
                                {(submission.attachments as Attachment[]).map(
                                  (attachment, index) => (
                                    <DropdownMenuItem key={index} asChild>
                                      <Link
                                        href={attachment?.url ?? "#"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3"
                                      >
                                        {getFileIcon(attachment?.fileType)}
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium text-gray-700 truncate">
                                            {attachment?.fileName}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            {attachment?.fileType}
                                          </p>
                                        </div>
                                        <ExternalLink
                                          size={14}
                                          className="text-gray-400"
                                        />
                                      </Link>
                                    </DropdownMenuItem>
                                  )
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}

                        {/* Update Status Button (now opens a single dialog) */}
                        <Button
                          onClick={() => setSelectedSubmission(submission)}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          Update Status
                        </Button>
                      </div>
                    </div>

                    {/* Evaluation Section */}
                    {(submission.feedback || submission.marks !== null) && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Evaluation
                        </h4>
                        <div className="space-y-3">
                          {submission.marks !== null && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-700">
                                Marks:
                              </span>
                              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                                {submission.marks}/100
                              </span>
                            </div>
                          )}
                          {submission.feedback && (
                            <div>
                              <p className="font-medium text-gray-700 mb-2">
                                Feedback:
                              </p>
                              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <p className="text-gray-800">
                                  {submission.feedback}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Single, controlled dialog */}
      <Dialog open={!!selectedSubmission}>
        <DialogTitle className="hidden">Update Submission</DialogTitle>
        <DialogContent className="sm:max-w-md bg-white rounded-lg shadow-lg">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Update Submission
          </DialogTitle>
          {selectedSubmission && (
            <SubmissionStatusForm
              submission={selectedSubmission}
              onUpdate={handleStatusUpdate}
              onClose={() => setSelectedSubmission(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
