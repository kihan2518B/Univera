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
                {canSubmitAssignment && (
                  <DropdownMenuItem
                    className="cursor-pointer border-b border-gray-100 focus:bg-gray-100 rounded-sm shadow-sm"
                    onClick={() =>
                      openSubmitDialog(String(item.id), item.title)
                    }
                  >
                    <Upload size={16} />
                    {submissionsData?.attachments?.length > 0
                      ? "Update Submission"
                      : "Submit Assignment"}
                  </DropdownMenuItem>
                )}
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
        <DialogContent className="sm:max-w-[500px] w-[95vw] max-w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader className="border-b border-gray-100 pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold text-TextTwo">
                {submissionsData?.attachments?.length > 0
                  ? "Update your submission"
                  : "Submit Assignment"}
              </DialogTitle>
            </div>
            <p className="text-sm text-gray-600">
              Assignment:{" "}
              <span className="font-medium text-TextTwo">
                {selectedAssignmentTitle}
              </span>
            </p>
            {submissionsData && <p>Status: {submissionsData.status}</p>}
          </DialogHeader>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-TextTwo">Upload Files</h3>
            <p className="text-xs text-gray-500">
              Select files to submit for this assignment
            </p>
            {submissionsData?.attachments?.length > 0 && (
              <div className="p-2 mb-2 bg-amber-50 text-amber-700 rounded border-l-2 border-amber-700 text-sm">
                {canSubmitAssignment
                  ? "You can update your existing submission."
                  : `You assignment is ${submissionsData.status}`}
              </div>
            )}
          </div>

          <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 hover:border-ColorThree transition-colors">
            <UploadthingUploader
              files={files}
              uploading={uploading}
              setUploading={setUploading}
              onDrop={onDrop}
              removeFile={removeFile}
              routeConfig={routeConfig}
            />
          </div>
          <DialogFooter className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={closeSubmitDialog}
              className="w-full sm:w-auto order-2 sm:order-1"
              disabled={isSubmitting || uploading}
            >
              Cancel
            </Button>
            {canSubmitAssignment && (
              <Button
                onClick={handleSubmitAssignment}
                disabled={files.length === 0 || isSubmitting || uploading}
                className="w-full sm:w-auto order-1 sm:order-2 bg-ColorThree hover:bg-ColorTwo text-white"
              >
                {isSubmitting || uploading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {uploading ? "Uploading..." : "Submitting..."}
                  </div>
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
