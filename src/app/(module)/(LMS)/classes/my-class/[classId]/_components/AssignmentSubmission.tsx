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
  FileTextIcon
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
import { useContext } from "react"
import { UserContext } from "@/context/user"
import { Prisma } from "@prisma/client"
import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
import AssignmentForm from "./AssignmentForm"
import { getTagColor } from "./AssignmentTable"
import { Button } from "@/components/ui/button"

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })
}

type AssignmentSubmissionStatus =
  | "PENDING"
  | "SUBMITTED"
  | "APPROVED"
  | "REJECTED"
  | "LATE"

// Define the attachment type
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
}

export function AssignmentSubmissions({
  assignment,
  classId,
  subjectId
}: AssignmentSubmissionsProps) {
  const { user } = useContext(UserContext)
  const handleStatusUpdate = async (
    submissionId: number,
    newStatus: string
  ) => {
    try {
      const res = await axios.patch(
        `/api/classes/my-class/${classId}/assignments/${subjectId}/${assignment.id}/`,
        { status: newStatus },
        {
          params: {
            SubmissionId: submissionId,
            updateAssignmentSubmission: true
          }
        }
      )
      if (res.status == 200) {
        toast.success(res.data.message)
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

  // Status color mapping with purple theme
  const getStatusColor = (status: AssignmentSubmissionStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-50 text-amber-600 border-amber-200"
      case "SUBMITTED":
        return "bg-purple-50 text-purple-600 border-purple-200"
      case "APPROVED":
        return "bg-emerald-50 text-emerald-600 border-emerald-200"
      case "REJECTED":
        return "bg-rose-50 text-rose-600 border-rose-200"
      case "LATE":
        return "bg-orange-50 text-orange-600 border-orange-200"
      default:
        return "bg-slate-50 text-slate-600 border-slate-200"
    }
  }

  // File type icon mapping
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <ImageIcon size={16} className="text-purple-600" />
    } else if (fileType.includes("pdf") || fileType.includes("document")) {
      return <FileTextIcon size={16} className="text-purple-600" />
    } else {
      return <FileIcon size={16} className="text-purple-600" />
    }
  }

  return (
    <div className="min-h-screen p-3 bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* Back Button */}
      <Link
        href={`/classes/my-class/${classId}/assignments/${assignment.subjectId}`}
        className="flex items-center text-purple-700 hover:bg-purple-100 p-2 rounded-lg transition-colors mb-6"
      >
        <ArrowLeft size={18} className="mr-2" />
        Back
      </Link>

      {/* Assignment Details Card */}
      <Card className="mb-6 sm:mb-8 border-none shadow-lg bg-white ring-1 ring-purple-100">
        <CardHeader className="border-b border-purple-100 p-4 sm:p-6 bg-purple-600">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg sm:text-2xl font-bold text-white break-words">
              {assignment.title}
            </CardTitle>
            <Dialog>
              <DialogTitle className="hidden">Edit Assignment</DialogTitle>
              <DialogTrigger asChild>
                <ButtonV1
                  label="Edit"
                  varient="outline"
                  icon={Edit}
                  className="flex items-center gap-2 border-white text-white hover:bg-white hover:text-purple-600"
                />
              </DialogTrigger>
              <DialogContent className="max-w-[80vw] max-h-[80vh] overflow-auto absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-purple-50">
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
              <Calendar className="text-purple-600" />
              <div>
                <p className="text-sm text-slate-500">Timeline</p>
                <p className="text-slate-700 font-medium">
                  {formatDate(assignment.startDate)} -{" "}
                  {formatDate(assignment.deadline)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="text-purple-600" />
              <div>
                <p className="text-sm text-slate-500">Type</p>
                <p className="text-slate-700 font-medium">
                  {assignment.assignmentType}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="text-purple-600" />
              <div>
                <p className="text-sm text-slate-500">Author</p>
                <p className="text-slate-700 font-medium">
                  {assignment.AuthorName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Tag className="text-purple-600" />
              <div>
                <p className="text-sm text-slate-500">Tags</p>
                <div className="flex gap-2 flex-wrap">
                  {assignment.tag.map((tag, index) => {
                    const tagColor = getTagColor(tag)
                    return (
                      <span
                        key={index}
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium transition-colors",
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
              <div className="flex items-center gap-3 md:col-span-2">
                <FileText className="text-purple-600" />
                <div>
                  <p className="text-sm text-slate-500">Attachment</p>
                  <div>
                    {assignment.attachmentUrl.match(
                      /\.(jpg|jpeg|png|gif)$/i
                    ) ? (
                      <img
                        src={assignment.attachmentUrl}
                        alt="Attachment Preview"
                        className="max-w-full h-auto rounded-lg shadow-md border border-purple-200"
                      />
                    ) : (
                      <a
                        href={assignment.attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-800 hover:underline inline-flex items-center gap-2"
                      >
                        View Attachment
                        <ExternalLink size={14} />
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
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-slate-800">Submissions</h2>
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
            {assignment.submissions.length}
          </span>
        </div>
        <div className="grid gap-4">
          {assignment.submissions.map((submission) => (
            <Card
              key={submission.id}
              className="border-none shadow-sm hover:shadow-md transition-all duration-200 bg-white ring-1 ring-purple-100 hover:ring-purple-200"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Student Info and Status */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg">
                      {submission.student.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800">
                        {submission.student.user.name}
                      </h3>
                      <p className="text-sm text-slate-500">
                        Submitted on{" "}
                        {formatDate(
                          new Date(submission.createdAt).toISOString()
                        )}
                      </p>
                      <div className="mt-2">
                        <span
                          className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium border",
                            getStatusColor(
                              submission.status as AssignmentSubmissionStatus
                            )
                          )}
                        >
                          {submission.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Attachments Dropdown */}
                    {submission.attachments &&
                      Array.isArray(submission.attachments) &&
                      submission.attachments.length > 0 && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300"
                            >
                              View Files ({submission.attachments.length})
                              <ChevronDown size={16} className="ml-2" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-64 bg-white border-purple-200"
                          >
                            {(submission.attachments as Attachment[]).map(
                              (attachment, index) => (
                                <DropdownMenuItem key={index} asChild>
                                  <Link
                                    href={attachment.url ?? "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-3 hover:bg-purple-50 cursor-pointer"
                                  >
                                    {getFileIcon(attachment.fileType)}
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-slate-700 truncate">
                                        {attachment.fileName}
                                      </p>
                                      <p className="text-xs text-slate-500">
                                        {attachment.fileType}
                                      </p>
                                    </div>
                                    <ExternalLink
                                      size={14}
                                      className="text-slate-400"
                                    />
                                  </Link>
                                </DropdownMenuItem>
                              )
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}

                    {/* Status Update Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="default"
                          className="bg-indigo-700 text-white shadow-md"
                        >
                          Update Status
                          <ChevronDown size={16} className="ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-white border-purple-200"
                      >
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusUpdate(submission.id, "PENDING")
                          }
                          className="text-amber-600 hover:bg-amber-50"
                        >
                          Mark as Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusUpdate(submission.id, "SUBMITTED")
                          }
                          className="text-purple-600 hover:bg-purple-50"
                        >
                          Mark as Submitted
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusUpdate(submission.id, "APPROVED")
                          }
                          className="text-emerald-600 hover:bg-emerald-50"
                        >
                          Approve Submission
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusUpdate(submission.id, "REJECTED")
                          }
                          className="text-rose-600 hover:bg-rose-50"
                        >
                          Reject Submission
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusUpdate(submission.id, "LATE")
                          }
                          className="text-orange-600 hover:bg-orange-50"
                        >
                          Mark as Late
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
