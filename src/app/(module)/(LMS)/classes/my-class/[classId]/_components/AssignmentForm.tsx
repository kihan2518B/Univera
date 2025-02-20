import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import toast from "react-hot-toast"
import axios from "axios"
import { useCallback, useState } from "react"
import { useUploadThing } from "@/utils/uploadthing"
import { UploadthingUploader } from "@/components/(commnon)/UploadthingUploader"
import { useRouter } from "next/navigation"
import { Submit } from "@/components/(commnon)/ButtonV1"
import { Prisma } from "@prisma/client"

type body = {
  title: string
  startDate: string
  deadline: string
  attachmentUrl: string
  tag: string
  assignmentType: string
  subjectId: string
  AuthorName: string
  facultyId: string
  courseId: string
  classId: string
  departmentId: string
  universityId: string
}

const assignmentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  startDate: z.string().nonempty("Start date is required."),
  deadline: z.string().nonempty("Deadline is required."),
  tag: z.string().default("ExamOriented"),
  assignmentType: z.string().default("TUTORIAL")
})

type AssignmentFormValues = z.infer<typeof assignmentSchema>
interface FileWithPreview extends File {
  preview?: string
  existing?: boolean
  url?: string
}

interface AssignmentFormProps {
  classId: string
  subjectId: string
  courseId: number
  universityId: number
  departmentId: number
  userId: string
  userName: string
  assignment?: Prisma.AssignmentGetPayload<{
    include: { submissions: true }
  }> | null
}

export default function AssignmentForm({
  userId,
  classId,
  subjectId,
  courseId,
  universityId,
  departmentId,
  userName,
  assignment
}: AssignmentFormProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([])

  const [uploading, setUploading] = useState<boolean>(false)
  const router = useRouter()

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

  const generatePreview = (file: File) => {
    const fileWithPreview = file as File & { preview?: string }
    if (file.type.startsWith("image/")) {
      fileWithPreview.preview = URL.createObjectURL(file)
    }
    return fileWithPreview
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (files.length >= 1) {
        toast.error("Only one document is allowed")
        return
      }
      const UniqueFiles = acceptedFiles.filter((file) => {
        return !files.some((existingFile) => existingFile.name === file.name)
      })
      const filesWithPreviews = UniqueFiles.map(generatePreview)
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

  const form = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: assignment?.title ?? "",
      startDate: assignment?.startDate ?? "",
      deadline: assignment?.deadline ?? "",
      tag: assignment?.tag[0] ?? "ExamOriented",
      assignmentType: assignment?.assignmentType ?? "TUTORIAL"
    }
  })

  const validateData = (data: AssignmentFormValues) => {
    let isValid = true
    const today = new Date().toISOString().split("T")[0] // Get today's date in YYYY-MM-DD format

    if (data.startDate < today) {
      isValid = false
      form.setError("startDate", {
        type: "manual",
        message: "Start date must not be less than today's date."
      })
      return isValid
    }

    if (data.deadline < today) {
      isValid = false
      form.setError("deadline", {
        type: "manual",
        message: "Deadline must not be less than today's date."
      })
      return isValid
    }

    if (data.startDate > data.deadline) {
      isValid = false
      form.setError("deadline", {
        type: "manual",
        message: "Deadline must be greater than start date."
      })
      return isValid
    }

    const startDate = new Date(data.startDate)
    const deadline = new Date(data.deadline)
    const timeDifference = deadline.getTime() - startDate.getTime()
    const dayDifference = timeDifference / (1000 * 3600 * 24)

    if (dayDifference < 1) {
      isValid = false
      form.setError("deadline", {
        type: "manual",
        message:
          "There must be at least a 1-day gap between start date and deadline."
      })
      return isValid
    }

    return isValid
  }

  const onSubmit = async (data: AssignmentFormValues) => {
    const isValid = validateData(data)
    if (!isValid) return
    if (assignment) {
      //Update Assignment
      try {
        const formData = {
          ...data,
          id: assignment.id
        }
        const res = await axios.patch(
          `/api/classes/my-class/${classId}/assignments/${subjectId}/${assignment.id}`,
          formData
        )
        if (res.status === 200) {
          toast.success(res.data.message)
        } else {
          toast.error(res.data.message)
        }
        window.location.reload()
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          toast.error(error.response.data.message || "Something went wrong")
        } else {
          toast.error("An unexpected error occurred")
        }
      }
    } else {
      //Create Assignment
      try {
        if (files.length > 0) {
          const uploadedFiles = await startUpload(files)
          if (uploadedFiles) {
            const uploadedFileData = uploadedFiles.map((file) => ({
              url: file.url,
              fileType: file.name.split(".").pop()?.toLowerCase() || "",
              fileName: file.name
            }))
            const formData: body = {
              ...data,
              attachmentUrl: uploadedFileData[0].url || "",
              AuthorName: userName || "",
              facultyId: userId ?? "",
              subjectId: subjectId as string,
              classId: classId as string,
              courseId: String(courseId) || "",
              departmentId: String(departmentId) || "",
              universityId: String(universityId) || ""
            }
            const res = await axios.post(
              `/api/classes/my-class/${classId}/assignments/${subjectId}/create`,
              formData
            )
            if (res.status === 200) {
              toast.success(res.data.message)
            } else {
              toast.error(res.data.message)
            }
            router.push(`/classes/my-class/${classId}/assignments/${subjectId}`)
          } else {
            toast.error("Please upload a file.")
          }
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          toast.error(error.response.data.message || "Something went wrong")
        } else {
          toast.error("An unexpected error occurred")
        }
      }
    }
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full max-w-7xl px-4 py-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-6 bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg p-4 sm:p-6 md:p-8 w-full"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-ColorThree tracking-tight">
              {assignment ? "Edit" : "Create"} Assignment
            </h2>

            <div className="space-y-4">
              {/* Title Input */}
              <FormField
                control={form.control}
                name="title"
                disabled={!!assignment}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-TextTwo text-sm sm:text-base">
                      Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter title"
                        {...field}
                        className="border-ColorThree focus:border-ColorTwo text-sm sm:text-base p-2 sm:p-3"
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              {/* Dates Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-TextTwo text-sm sm:text-base">
                        Start Date
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="border-ColorThree focus:border-ColorTwo text-sm sm:text-base p-2 sm:p-3"
                        />
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-TextTwo text-sm sm:text-base">
                        Deadline
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="border-ColorThree focus:border-ColorTwo text-sm sm:text-base p-2 sm:p-3"
                        />
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Attachment */}
              {!assignment && (
                <div className="bg-lamaSkyLight rounded-lg p-3 sm:p-4">
                  <FormLabel className="text-TextTwo mb-2 block text-sm sm:text-base">
                    Attachment (Max 1 file)
                  </FormLabel>
                  <UploadthingUploader
                    files={files}
                    uploading={uploading}
                    setUploading={setUploading}
                    onDrop={onDrop}
                    removeFile={removeFile}
                    routeConfig={routeConfig}
                  />
                </div>
              )}

              {/* Tags and Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <FormField
                  control={form.control}
                  disabled={!!assignment}
                  name="tag"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-TextTwo text-sm sm:text-base">
                        Tag
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-ColorThree focus:border-ColorTwo text-sm sm:text-base p-2 sm:p-3">
                            <SelectValue placeholder="Select tag" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white">
                          <SelectItem value="ExamOriented">
                            Exam Oriented
                          </SelectItem>
                          <SelectItem value="IMP">Important</SelectItem>
                          <SelectItem value="NORMAL">Normal</SelectItem>
                          <SelectItem value="OPTIONAL">Optional</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assignmentType"
                  disabled={!!assignment}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-TextTwo text-sm sm:text-base">
                        Assignment Type
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-ColorThree focus:border-ColorTwo text-sm sm:text-base p-2 sm:p-3">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white">
                          <SelectItem value="TUTORIAL">Tutorial</SelectItem>
                          <SelectItem value="EXAM">Exam</SelectItem>
                          <SelectItem value="PROJECT">Project</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Submit
              id="assignment-submit"
              type="submit"
              disabled={form.formState.isSubmitting || !form.formState.isDirty}
              label={`${
                assignment
                  ? `${
                      form.formState.isSubmitting
                        ? "Updating..."
                        : "Update Assignment"
                    }`
                  : `${
                      form.formState.isSubmitting
                        ? "Creating..."
                        : "Create Assignment"
                    }`
              }`}
              className="w-full sm:w-auto bg-ColorThree hover:bg-ColorTwo text-white transition-colors duration-300 text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3"
            />
          </form>
        </Form>
      </div>
    </div>
  )
}
