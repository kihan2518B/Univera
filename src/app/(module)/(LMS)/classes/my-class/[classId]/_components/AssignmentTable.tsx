import React, { useCallback, useEffect, useState } from "react"
import {
  MoreVertical,
  NotepadText,
  Search,
  Trash2,
  Upload,
  FilePlus
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Prisma } from "@prisma/client"
import { CoursesSkeleton } from "@/components/(commnon)/Skeleton"
import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
import { Input } from "@/components/ui/input"
import Table from "@/app/(module)/list/_components/Table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { UploadthingUploader } from "@/components/(commnon)/UploadthingUploader"
import { FileWithPreview, UploadedFile } from "@/types/globals"
import { useUploadThing } from "@/utils/uploadthing"
import toast from "react-hot-toast"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

async function fetchAssignmentSubmissions(
  classId: string,
  subjectId: string,
  assignmentId: string,
  userId: string
) {
  console.log("subjectId, assignmentId:", subjectId, assignmentId)
  const res = await axios.get(
    `/api/classes/my-class/${classId}/assignments/${subjectId}/${assignmentId}/submission`,
    {
      params: { userId }
    }
  )
  return res.data?.submissions
}

type AssignmentTableProps = {
  assignmentsData: {
    faculties: any
    assignments: Prisma.AssignmentGetPayload<{
      include: { faculty: true; subject: true }
    }>[]
  }
  roles: number[]
  classId: string
  subjectId: string
  assignmentsIsLoading: boolean
  assignmentsIsError: boolean
  userId: string
  deleteAssignment: (id: string) => Promise<void>
}

const columns = [
  {
    header: "Sr. No.",
    accessor: "id"
  },
  {
    header: "Title",
    accessor: "title"
  },
  {
    header: "Author",
    accessor: "AuthorName"
  },
  {
    header: "Type",
    accessor: "assignmentType"
  },
  {
    header: "Tags",
    accessor: "tag"
  },
  {
    header: "Due Date",
    accessor: "deadline"
  },
  {
    header: "Start Date",
    accessor: "startDate"
  }
]

export const getTagColor = (tag: string) => {
  // Create a consistent color mapping based on the tag string
  const colors = [
    { bg: "bg-blue-50", text: "text-blue-700" },
    { bg: "bg-purple-50", text: "text-purple-700" },
    { bg: "bg-pink-50", text: "text-pink-700" },
    { bg: "bg-indigo-50", text: "text-indigo-700" },
    { bg: "bg-teal-50", text: "text-teal-700" },
    { bg: "bg-emerald-50", text: "text-emerald-700" },
    { bg: "bg-cyan-50", text: "text-cyan-700" },
    { bg: "bg-violet-50", text: "text-violet-700" }
  ]

  // Use string hash to consistently map tags to colors
  const hashCode = tag.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0)

  const index = Math.abs(hashCode) % colors.length
  return colors[index]
}

export const getDeadlineStatus = (deadline: string) => {
  const today = new Date()
  const deadlineDate = new Date(deadline)
  const daysUntilDeadline = Math.ceil(
    (deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (daysUntilDeadline < 0) {
    return {
      status: "expired",
      className: "bg-red-50 text-red-700 font-medium"
    }
  } else if (daysUntilDeadline <= 1) {
    return {
      status: "urgent",
      className: "bg-orange-50 text-orange-700 font-medium animate-pulse"
    }
  } else if (daysUntilDeadline <= 3) {
    return {
      status: "approaching",
      className: "bg-yellow-50 text-yellow-700 font-medium"
    }
  } else if (daysUntilDeadline <= 7) {
    return {
      status: "upcoming",
      className: "bg-blue-50 text-blue-700 font-medium"
    }
  }
  return {
    status: "normal",
    className: "bg-green-50 text-green-700 font-medium"
  }
}

const formatDeadline = (deadline: string) => {
  const date = new Date(deadline)
  return {
    date: date.getDate().toString().padStart(2, "0"),
    month: (date.getMonth() + 1).toString().padStart(2, "0"),
    year: date.getFullYear()
  }
}

export const AssignmentTableComponent = ({
  assignmentsData,
  roles,
  classId,
  subjectId,
  deleteAssignment,
  assignmentsIsError,
  assignmentsIsLoading,
  userId
}: AssignmentTableProps) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false)
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>("")
  const [selectedAssignmentTitle, setSelectedAssignmentTitle] =
    useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [uploading, setUploading] = useState<boolean>(false)

  const {
    data: submissionsData,
    isLoading: submissionsIsLoading,
    refetch: refetchSubmissions
  } = useQuery({
    queryKey: ["assignmentSubmissions", selectedAssignmentId],
    queryFn: () =>
      fetchAssignmentSubmissions(
        classId as string,
        subjectId as string,
        selectedAssignmentId,
        userId
      ),
    enabled: !!selectedAssignmentId
  })

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const UniqueFiles = acceptedFiles.filter((file) => {
        return !files.some((existingFile) => existingFile.name === file.name)
      })
      const filesWithPreviews = UniqueFiles.map((file) => generatePreview(file))
      setFiles((prevFiles) => [...prevFiles, ...filesWithPreviews])
    },
    [files]
  )

  const removeFile = (indexToRemove: number) => {
    setFiles((prevFiles) => {
      const newFiles = prevFiles.filter((_, index) => index !== indexToRemove)
      if (prevFiles[indexToRemove].preview) {
        URL.revokeObjectURL(prevFiles[indexToRemove].preview!)
      }
      return newFiles
    })
  }

  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview)
        }
      })
    }
  }, [files])

  const generatePreview = (
    file: File | UploadedFile,
    isExisting: boolean = false
  ): FileWithPreview => {
    if (isExisting) {
      // UploadedFile type guard
      const uploadedFile = file as UploadedFile
      return {
        url: uploadedFile.url,
        name: uploadedFile.fileName,
        preview: uploadedFile.url,
        existing: true
      } as FileWithPreview
    } else {
      const fileWithPreview = file as FileWithPreview
      if (file instanceof File && file.type.startsWith("image/")) {
        fileWithPreview.preview = URL.createObjectURL(file)
      }
      return fileWithPreview
    }
  }

  const { startUpload, routeConfig } = useUploadThing("attachmentsUploader", {
    onClientUploadComplete: () => {
      setUploading(false)
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview)
        }
      })
    },
    onUploadError: () => {
      toast.error("Failed to upload file")
      setUploading(false)
    },
    onUploadBegin: () => {
      setUploading(true)
    }
  })

  const handleSubmitAssignment = async () => {
    if (files.length === 0) {
      toast.error("Please select at least one file to submit")
      return
    }

    setIsSubmitting(true)
    try {
      let uploadedFileData: UploadedFile[] = []

      // Handle new file uploads
      const newFiles = files.filter((file) => !file.existing)

      if (newFiles.length > 0) {
        const uploadedFiles = await startUpload(newFiles)

        if (uploadedFiles) {
          uploadedFileData = uploadedFiles.map((file) => ({
            url: file.url,
            fileType: file.name.split(".").pop()?.toLowerCase() || "",
            fileName: file.name
          }))
        }
      }

      // Keep existing files in the upload data
      const existingFiles = files
        .filter((file) => file.existing)
        .map((file) => ({
          url: file.url,
          fileName: file.name,
          fileType: file.name.split(".").pop()?.toLowerCase() || ""
        }))

      const submissionData = {
        studentId: userId,
        attachments: [...uploadedFileData, ...existingFiles]
      }

      const res = await axios.patch(
        `/api/classes/my-class/${classId}/assignments/${subjectId}/${Number(selectedAssignmentId)}/submission${submissionsData ? `?submissionId=${submissionsData.id}` : ""}`,
        submissionData
      )

      if (res.status >= 200 && res.status < 300) {
        toast.success(res.data.message || `assignment submitted successfully!`)
      }
      closeSubmitDialog()
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Something went wrong")
      } else {
        toast.error("An unexpected error occurred")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const openSubmitDialog = (assignmentId: string, assignmentTitle: string) => {
    setSelectedAssignmentId(assignmentId)
    setSelectedAssignmentTitle(assignmentTitle)
    setIsSubmitDialogOpen(true)

    // IMPORTANT: Delay setting files until query refetches
    refetchSubmissions().then((res) => {
      const submission = res.data
      if (submission?.attachments?.length) {
        const existingFiles = submission.attachments.map(
          (file: FileWithPreview) => generatePreview(file, true)
        )
        setFiles(existingFiles)
      } else {
        setFiles([])
      }
    })
  }

  const closeSubmitDialog = () => {
    setIsSubmitDialogOpen(false)
    setFiles([])
    setSelectedAssignmentId("")
    setSelectedAssignmentTitle("")
  }
  const canSubmitAssignment = submissionsData
    ? submissionsData.status !== "APPROVED"
    : true
  const renderRow = (
    item: Prisma.AssignmentGetPayload<{
      include: { faculty: true; subject: true }
    }>,
    index: number
  ) => {
    const deadlineInfo = getDeadlineStatus(item.deadline)
    const formattedDate = formatDeadline(item.deadline)
    const canCreateAssignment = assignmentsData.faculties
      ?.map((f: any) => f.id)
      .includes(userId)

    if (assignmentsIsError) return <>Error while fetching data</>
    return (
      <tr
        key={item.id}
        className="text-sm hover:bg-lamaSkyLight transition-colors duration-150"
      >
        {/* Keep all existing cells the same until the last cell */}
        <td className="px-4 py-3">{index + 1}</td>
        <td className="px-4 py-3">
          <span className="font-medium text-TextTwo">{item.title}</span>
        </td>
        <td className="px-4 py-3">{item.AuthorName}</td>
        <td className="px-4 py-3">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-lamaPurpleLight text-ColorThree">
            {item.assignmentType}
          </span>
        </td>
        <td className="px-4 py-3">
          <div className="flex flex-wrap gap-1">
            {item.tag.map((tag, index) => {
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
        </td>
        <td className="px-4 py-3">
          <div
            className={cn(
              "px-3 py-1 rounded-full text-sm inline-flex items-center justify-center transition-colors",
              deadlineInfo.className
            )}
          >
            {formattedDate.date}/{formattedDate.month}/{formattedDate.year}
          </div>
        </td>
        <td className="px-4 py-3">
          {new Date(item.startDate).getDate()}/
          {new Date(item.deadline).getMonth() + 1}/
          {new Date(item.deadline).getFullYear()}
        </td>
        {canCreateAssignment ? (
          <td className="px-4 py-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-150">
                <MoreVertical size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuItem
                  className="cursor-pointer border-b border-gray-100 focus:bg-gray-100 rounded-sm shadow-sm"
                  onClick={() => {
                    window.location.href = `/classes/my-class/${classId}/assignments/${subjectId}/${item.id}/submissions`
                  }}
                >
                  <NotepadText />
                  View Submissions
                </DropdownMenuItem>
                {roles.includes(4) && (
                  <DropdownMenuItem
                    className="cursor-pointer shadow-sm text-red-500 focus:text-red-500 focus:bg-red-50border-b border-gray-100 focus:bg-gray-100 rounded-sm"
                    onClick={() => deleteAssignment(String(item.id))}
                  >
                    <Trash2 /> Delete Assignment
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </td>
        ) : roles.includes(7) ? (
          <td className="px-4 py-3">
            <DropdownMenu key={isSubmitDialogOpen ? "open" : "closed"}>
              <DropdownMenuTrigger className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-150">
                <MoreVertical size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuItem
                  className="cursor-pointer border-b border-gray-100 focus:bg-gray-100 rounded-sm shadow-sm"
                  onClick={() => {
                    window.location.href = `${item.attachmentUrl}`
                  }}
                >
                  <NotepadText />
                  View Assignment
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer border-b border-gray-100 focus:bg-gray-100 rounded-sm shadow-sm"
                  onClick={() => openSubmitDialog(String(item.id), item.title)}
                >
                  <Upload size={16} />
                  {submissionsData?.attachments?.length > 0
                    ? "Update Submission"
                    : "Submit Assignment"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </td>
        ) : (
          <td className="px-4 py-3">
            <span className="text-gray-500">-</span>
          </td>
        )}
      </tr>
    )
  }

  if (assignmentsIsLoading || !assignmentsData) {
    return <CoursesSkeleton />
  }

  const filteredData = assignmentsData.assignments?.filter((item: any) => {
    const searchString = searchTerm.toLowerCase()
    return (
      item.title?.toLowerCase().includes(searchString) ||
      item.AuthorName?.toLowerCase().includes(searchString) ||
      item.assignmentType?.toLowerCase().includes(searchString) ||
      item.tag?.some((tag: string) => tag.toLowerCase().includes(searchString))
    )
  })

  const canCreateAssignment = assignmentsData.faculties
    ?.map((f: any) => f.id)
    .includes(userId)
  console.log("submissionsData: ", submissionsData)

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-TextTwo">Assignments</h1>
        <div className="relative w-full max-w-sm">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <Input
            type="text"
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        {canCreateAssignment && (
          <ButtonV1
            className="flex items-center gap-2 bg-ColorThree hover:bg-ColorTwo text-white font-medium rounded-lg px-4 py-2 transition-colors duration-200"
            href={`/classes/my-class/${classId}/assignments/${subjectId}/create`}
            icon={FilePlus}
            label="Create new assignment"
          />
        )}
      </div>

      <div className="rounded-lg border border-gray-100 overflow-hidden">
        <Table
          columns={columns}
          renderRow={(item, index) => renderRow(item, Number(index))}
          data={filteredData || []}
        />
      </div>

      {/* Submit Assignment Dialog */}
      <Dialog
        open={isSubmitDialogOpen && !submissionsIsLoading}
        onOpenChange={setIsSubmitDialogOpen}
      >
        <DialogContent className="sm:max-w-[650px] w-[95vw] max-w-[95vw] sm:w-full max-h-[85vh] overflow-y-auto bg-white">
          <DialogHeader className="border-b border-gray-200 pb-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <DialogTitle className="text-2xl font-semibold text-gray-900 mb-2">
                  {submissionsData?.attachments?.length > 0
                    ? "Update Submission"
                    : "Submit Assignment"}
                </DialogTitle>
                <p className="text-base text-gray-600">
                  Assignment:{" "}
                  <span className="font-semibold text-gray-900">
                    {selectedAssignmentTitle}
                  </span>
                </p>
              </div>

              {/* Status Badge */}
              {submissionsData && (
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-semibold border-2",
                      submissionsData.status === "APPROVED" &&
                        "bg-green-50 text-green-700 border-green-200",
                      submissionsData.status === "REJECTED" &&
                        "bg-red-50 text-red-700 border-red-200",
                      submissionsData.status === "PENDING" &&
                        "bg-amber-50 text-amber-700 border-amber-200",
                      submissionsData.status === "SUBMITTED" &&
                        "bg-blue-50 text-blue-700 border-blue-200",
                      submissionsData.status === "LATE" &&
                        "bg-orange-50 text-orange-700 border-orange-200"
                    )}
                  >
                    {submissionsData.status}
                  </span>
                  <p className="text-xs text-gray-500">Current Status</p>
                </div>
              )}
            </div>
          </DialogHeader>

          <div className="space-y-6 py-2">
            {/* Status-Specific Messages */}
            {submissionsData && (
              <div className="space-y-4">
                {submissionsData.status === "APPROVED" && (
                  <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-green-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">
                          Assignment Approved
                        </h3>
                        <p className="text-sm text-green-700 mt-1">
                          Congratulations! Your submission has been approved.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {submissionsData.status === "REJECTED" && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-red-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          Assignment Needs Revision
                        </h3>
                        <p className="text-sm text-red-700 mt-1">
                          Please review the feedback and resubmit your
                          assignment.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {submissionsData.status === "LATE" && (
                  <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-orange-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-orange-800">
                          Late Submission
                        </h3>
                        <p className="text-sm text-orange-700 mt-1">
                          This assignment was submitted after the deadline.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {(submissionsData.status === "PENDING" ||
                  submissionsData.status === "SUBMITTED") && (
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-blue-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">
                          {submissionsData.status === "PENDING"
                            ? "Review Pending"
                            : "Under Review"}
                        </h3>
                        <p className="text-sm text-blue-700 mt-1">
                          Your submission is being reviewed by the instructor.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Evaluation Section - Show if marks or feedback exist */}
            {submissionsData &&
              (submissionsData?.marks !== null ||
                submissionsData?.feedback) && (
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Evaluation Results
                  </h3>

                  <div className="grid gap-4">
                    {submissionsData && submissionsData?.marks !== null && (
                      <div className="bg-white rounded-lg p-4 border border-purple-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              Your Score
                            </p>
                            <p className="text-xs text-gray-500">
                              Out of 100 points
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-3xl font-bold text-purple-600">
                              {submissionsData.marks}
                            </span>
                            <span className="text-lg text-gray-500 ml-1">
                              /100
                            </span>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${submissionsData.marks}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}

                    {submissionsData?.feedback && (
                      <div className="bg-white rounded-lg p-4 border border-purple-200">
                        <div className="flex items-center gap-2 mb-3">
                          <svg
                            className="w-4 h-4 text-purple-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                            />
                          </svg>
                          <p className="font-medium text-gray-900">
                            Instructor Feedback
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-purple-400">
                          <p className="text-gray-800 leading-relaxed">
                            {submissionsData.feedback}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

            {/* Upload Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Upload Files
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Select files to submit for this assignment
                  </p>
                </div>
                {submissionsData?.attachments?.length > 0 && (
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Current submission</p>
                    <p className="text-sm font-medium text-gray-700">
                      {submissionsData.attachments.length} file(s)
                    </p>
                  </div>
                )}
              </div>

              {submissionsData?.attachments?.length > 0 && (
                <div
                  className={cn(
                    "p-4 rounded-xl border-2 text-sm",
                    submissionsData.status === "PENDING" &&
                      "bg-amber-50 text-amber-800 border-amber-200",
                    submissionsData.status === "SUBMITTED" &&
                      "bg-blue-50 text-blue-800 border-blue-200",
                    submissionsData.status === "APPROVED" &&
                      "bg-green-50 text-green-800 border-green-200",
                    submissionsData.status === "REJECTED" &&
                      "bg-red-50 text-red-800 border-red-200",
                    submissionsData.status === "LATE" &&
                      "bg-orange-50 text-orange-800 border-orange-200"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div className="flex-1">
                      <p className="font-semibold mb-1">
                        {canSubmitAssignment
                          ? "Update Your Submission"
                          : `Assignment ${submissionsData.status}`}
                      </p>
                      {canSubmitAssignment ? (
                        <p className="text-xs opacity-90">
                          Upload new files to update your existing submission.
                          Previous files will be replaced.
                        </p>
                      ) : (
                        <p className="text-xs opacity-90">
                          {submissionsData.status === "APPROVED" &&
                            "Your assignment has been approved. No further action needed."}
                          {submissionsData.status === "REJECTED" &&
                            "Please review the feedback above and resubmit if allowed."}
                          {(submissionsData.status === "SUBMITTED" ||
                            submissionsData.status === "PENDING") &&
                            "Your submission is under review."}
                          {submissionsData.status === "LATE" &&
                            "This submission was marked as late."}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <fieldset disabled={!canSubmitAssignment}>
              {/* Upload Area */}
              <div
                className={`${!canCreateAssignment ? "opacity-50 cursor-not-allowed" : ""} border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-purple-400 hover:bg-purple-50/30 transition-all duration-300`}
              >
                <UploadthingUploader
                  files={files}
                  uploading={uploading}
                  setUploading={setUploading}
                  onDrop={onDrop}
                  removeFile={removeFile}
                  routeConfig={routeConfig}
                />
              </div>
            </fieldset>
          </div>

          <DialogFooter className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={closeSubmitDialog}
              className="w-full sm:w-auto order-2 sm:order-1 border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2"
              disabled={isSubmitting || uploading}
            >
              Cancel
            </Button>
            {canSubmitAssignment && (
              <Button
                onClick={handleSubmitAssignment}
                disabled={files.length === 0 || isSubmitting || uploading}
                className="w-full sm:w-auto order-1 sm:order-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-2 text-base font-semibold"
              >
                {isSubmitting || uploading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {uploading ? "Uploading..." : "Submitting..."}
                  </div>
                ) : submissionsData?.attachments?.length > 0 ? (
                  "Update Submission"
                ) : (
                  "Submit Assignment"
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
