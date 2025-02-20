"use client"

import React, { useCallback, useContext, useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { UserContext } from "@/context/user"
import { UploadedFile } from "@/types/globals"
import { useRouter, useSearchParams } from "next/navigation"
import toast from "react-hot-toast"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { Checkbox } from "@/components/ui/checkbox"
import { useUploadThing } from "@/utils/uploadthing"
import { UploadthingUploader } from "@/components/(commnon)/UploadthingUploader"
import { AnnouncementFormSkeleton } from "@/components/(commnon)/Skeleton"

interface FileWithPreview extends File {
  preview?: string
  existing?: boolean
  url?: string
}

async function fetchSubjects(courseId: string) {
  const response = await axios.get(`/api/subjects?courseId=${courseId}`)
  return response.data.subjects
}

export default function CreateAnnouncement() {
  const searchParams = useSearchParams()
  const announcementId = searchParams.get("announcementId")
  const classId = searchParams.get("classId")
  const { user } = useContext(UserContext)
  const [title, setTitle] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [category, setCategory] = useState<string>("general")
  const [uploading, setUploading] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const roles = user?.roles?.map((role: any) => role.id) || []

  const { data: subjects, isLoading: subjectsLoading } = useQuery({
    queryKey: ["subjects", user?.courseId, classId, roles],
    queryFn: () => fetchSubjects(String(user?.courseId)),
    enabled:
      (!!user?.courseId && !!classId && roles.includes(4)) || !!announcementId
  })

  useEffect(() => {
    const fetchAnnouncementDetails = async () => {
      if (!announcementId) return

      setIsLoading(true)
      try {
        const response = await fetch(
          `/api/announcements?route=findOne&&announcementId=${announcementId}`
        )
        if (!response.ok) {
          throw new Error("Failed to fetch the announcements")
        }

        const data = await response.json()
        setTitle(data.title)
        setDescription(data.description)
        setCategory(data.category)

        const subjects = Array.isArray(data.subjectName)
          ? data.subjectName
          : typeof data.subjectName === "string"
            ? [data.subjectName] // Handle single string as array
            : []

        setSelectedSubjects(subjects)

        // Handle existing attachments
        if (data.attachments?.length > 0) {
          const existingFiles = data.attachments.map((attachment: any) => ({
            name: attachment.fileName,
            url: attachment.url,
            preview: attachment.url,
            existing: true
          }))
          setFiles(existingFiles)
        }
      } catch (error) {
        if (error) toast.error("Failed to fetch the announcements")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnnouncementDetails()
  }, [announcementId])

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

  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview)
        }
      })
    }
  }, [files])

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
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

      const formData = {
        title,
        description,
        departmentId: user?.departmentId,
        universityId: user?.universityId,
        announcerId: user?.id,
        category,
        classId: classId || announcementId ? Number(classId) : null,
        subjectName: classId || announcementId ? selectedSubjects : [],
        announcerName: user?.name,
        attachments: [...existingFiles, ...uploadedFileData]
      }

      const response = await fetch(
        `/api/announcements${announcementId ? `?id=${announcementId}` : ""}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        }
      )

      if (response.ok) {
        setTitle("")
        setDescription("")
        setFiles([])
        setCategory("")
        setSelectedSubjects([])
        if (classId) {
          router.push(
            `/classes/my-class/${classId}/classAnnouncement?tab=${category}`
          )
        } else {
          router.push(`/announcements?tab=${category}`)
        }
      } else {
        console.log("Failed to create the announcement.")
      }
    } catch (error) {
      console.log("Error creating announcement:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || subjectsLoading) return <AnnouncementFormSkeleton />

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="sm:text-2xl md:text-3xl text-center font-bold mb-6 text-TextTwo">
          {announcementId ? "Edit" : "Create"} Announcement
        </h1>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-TextTwo mb-1"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-Secondary focus:outline-none focus:ring-2 focus:ring-ColorThree transition-all duration-200"
              required
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-semibold text-TextTwo mb-1"
            >
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-Secondary focus:outline-none focus:ring-2 focus:ring-ColorThree transition-all duration-200 bg-white appearance-none cursor-pointer"
              required
            >
              <option
                value="general"
                className="px-4 py-2 hover:bg-lamaSkyLight text-TextTwo"
              >
                General
              </option>
              <option
                value="event"
                className="px-4 py-2 hover:bg-lamaSkyLight text-TextTwo"
              >
                Event
              </option>
              <option
                value="private"
                className="px-4 py-2 hover:bg-lamaSkyLight text-TextTwo"
              >
                Private
              </option>
            </select>
            {/* Custom arrow icon */}
            <div className="relative">
              <div className="absolute inset-y-0 right-0 -mt-9 mr-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-TextTwo mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-Secondary focus:outline-none focus:ring-2 focus:ring-ColorThree transition-all duration-200"
              rows={4}
            />
          </div>

          {roles.includes(4) && !subjectsLoading && subjects && classId && (
            <div>
              <label className="block text-sm font-semibold text-TextTwo mb-3">
                Select Subjects
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {subjects.map((subject: any) => (
                  <div key={subject.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`subject-${subject.id}`}
                      checked={selectedSubjects.includes(subject.name)}
                      onCheckedChange={(checked) => {
                        setSelectedSubjects((prev) =>
                          checked
                            ? [...prev, subject.name]
                            : prev?.filter((name) => name !== subject.name)
                        )
                      }}
                    />
                    <label
                      htmlFor={`subject-${subject.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {subject.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-lamaSkyLight rounded-lg p-4">
            <UploadthingUploader
              files={files}
              uploading={uploading}
              setUploading={setUploading}
              onDrop={onDrop}
              removeFile={removeFile}
              routeConfig={routeConfig}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || uploading}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200
              ${
                isSubmitting || uploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-ColorThree to-ColorTwo hover:opacity-90"
              }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin mr-2" size={20} />
                Submitting...
              </span>
            ) : (
              "Submit Announcement"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
