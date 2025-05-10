"use client"

import React, { useContext, useState, CSSProperties } from "react"
import { Card } from "@/components/ui/card"
import { Download, Upload, Plus, Eye, ArrowLeft } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import toast from "react-hot-toast"

import { UploadthingUploader } from "@/components/(commnon)/UploadthingUploader"
import { FileWithPreview, UploadedFile } from "@/types/globals"
import { useUploadThing } from "@/utils/uploadthing"
import { UserContext } from "@/context/user"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import Link from "next/link"
import { useParams } from "next/navigation"
import { SyllabusSkeleton } from "@/components/(commnon)/Skeleton"

// Fetch syllabi from the server
async function fetchSyllabi(userSubjectIds?: number[]) {
  if (!userSubjectIds || userSubjectIds.length === 0) {
    return []
  }

  const response = await axios.get("/api/subjects/syllabus", {
    params: {
      userSubjectIds: JSON.stringify(userSubjectIds)
    }
  })
  return response.data.syllabus || []
}

async function fetchSubjects(courseId: string) {
  const response = await axios.get(`/api/subjects?courseId=${courseId}`)
  return response.data.subjects || []
}

export default function SyllabusPage() {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [uploading, setUploading] = useState<boolean>(false)
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    null
  )
  const [title, setTitle] = useState<string>("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { user } = useContext(UserContext)

  const { data: subjects } = useQuery({
    queryKey: ["subjects", user?.courseId],
    queryFn: () => fetchSubjects(String(user?.courseId)),
    enabled: !!user?.courseId
  })

  console.log(subjects)

  // collect all the subject who have subject.faculties.id same as user.id
  const userSubjects = subjects?.filter((subject: any) =>
    subject.faculties.some((faculty: any) => faculty.id === user?.id)
  )

  console.log(userSubjects)

  const userSubjectIds = userSubjects?.map((subject: any) => subject.id)

  // Fetch syllabi
  const {
    data: syllabi,
    refetch,
    isLoading
  } = useQuery({
    queryKey: ["syllabi", userSubjectIds],
    queryFn: () => fetchSyllabi(userSubjectIds),
    enabled: !!userSubjectIds && userSubjectIds.length > 0
  })

  console.log("syllabi", syllabi)

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 15) {
      setTitle(e.target.value)
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
      refetch() // Refresh syllabi after upload
      setIsDialogOpen(false)
      setFiles([])
      setSelectedSubjectId(null)
      setTitle("")
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

  const onDrop = (acceptedFiles: File[]) => {
    // Filter to only accept PDF files
    const pdfFiles = acceptedFiles.filter(
      (file) => file.type === "application/pdf"
    )

    // Show toast if any files were rejected
    if (pdfFiles.length < acceptedFiles.length) {
      toast.error("Only PDF files are allowed")
    }

    // If no PDFs were found, return early
    if (pdfFiles.length === 0) return

    const UniqueFiles = pdfFiles.filter((file) => {
      return !files.some((existingFile) => existingFile.name === file.name)
    })
    const filesWithPreviews = UniqueFiles.map(generatePreview)
    setFiles((prevFiles) => [...prevFiles, ...filesWithPreviews])
  }

  const removeFile = (indexToRemove: number) => {
    setFiles((prevFiles) => {
      const newFiles = prevFiles.filter((_, index) => index !== indexToRemove)
      if (prevFiles[indexToRemove].preview) {
        URL.revokeObjectURL(prevFiles[indexToRemove].preview!)
      }
      return newFiles
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
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

      const subjectName = userSubjects?.find(
        (subject: any) => subject.id === Number(selectedSubjectId)
      )?.name

      const response = await axios.patch("/api/subjects/syllabus", {
        title,
        subjectId: selectedSubjectId,
        subjectName,
        uploadedBy: user?.name, // Replace with actual user name
        file: uploadedFileData
      })

      if (response.status === 200) {
        toast.success("Syllabus uploaded successfully")
        refetch() // Refresh syllabi list
        setIsDialogOpen(false)
      } else {
        toast.error("Failed to upload syllabus")
      }
    } catch (error) {
      console.log("Error uploading syllabus:", error)
      toast.error("Error uploading syllabus")
    }
  }

  // PDF Icon component
  const PDFIcon = ({ color }: { color: string }) => (
    <div
      style={{ color }}
      className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/30"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6"
      >
        <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 013.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0121 12.75v3.75c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 01-1.875-1.875v-10.5c0-1.036.84-1.875 1.875-1.875h.375A1.875 1.875 0 007.5 3.375z" />
        <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
      </svg>
    </div>
  )

  // File type icon component - always showing PDF icon since we're restricting to PDFs only
  const FileTypeIcon = ({ color }: { color: string }) => {
    return <PDFIcon color={color} />
  }

  const colorSets = [
    { bg: "#EDF9FD", icon: "#56E1E9", hover: "#DCEFF5" }, // lamaSkyLight + ColorOne
    { bg: "#F1F0FF", icon: "#BB63FF", hover: "#E6E4FA" }, // lamaPurpleLight + ColorTwo
    { bg: "#FEFCE8", icon: "#FAE27C", hover: "#F9F5D6" }, // lamaYellowLight + lamaYellow
    { bg: "#C3EBFA", icon: "#87CEEB", hover: "#B3DBEA" } // lamaSky + Primary
  ]

  const handleViewClick = (url: any) => {
    // Opens the document in a new tab
    window.open(url, "_blank")
  }

  const handleDownloadClick = (url: any) => {
    // Fetch the file then force download as PDF
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        // Create URL for the blob
        const blobUrl = window.URL.createObjectURL(blob)

        // Create link element
        const link = document.createElement("a")

        // Set link properties
        link.href = blobUrl

        // Ensure file downloads with a .pdf extension
        const fileName = url.split("/").pop() || "document"
        link.download = fileName.endsWith(".pdf")
          ? fileName
          : `${fileName.split(".")[0] || "document"}.pdf`

        // Append to body, click and remove
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        // Clean up the URL object
        setTimeout(() => {
          window.URL.revokeObjectURL(blobUrl)
        }, 100)
      })
      .catch((error) => {
        console.error("Download failed:", error)
        toast.error("Failed to download file")
      })
  }
  const { classId } = useParams()

  return (
    <div className="container mx-auto px-4 py-4 max-w-5xl">
      {/* Header Section - Improved responsive layout */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="mb-4">
          <Link
            href={`/classes/my-class/${classId}`}
            className="flex items-center text-TextTwo hover:bg-lamaSkyLight"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back
          </Link>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-Dark">Syllabus</h1>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <ButtonV1
              icon={Plus}
              label="Upload Syllabus"
              className="flex items-center gap-2 shadow-md w-full sm:w-auto"
            />
          </DialogTrigger>

          {/* Responsive Dialog */}
          <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[500px] p-0 overflow-hidden rounded-xl border-0 shadow-xl bg-white mx-auto my-4 sm:my-0 max-h-[90vh] overflow-y-auto">
            {/* Header with gradient background */}
            <DialogHeader className="bg-Primary p-4 sm:p-6 text-white sticky top-0 z-10">
              <DialogTitle className="text-xl sm:text-2xl font-bold">
                Upload Syllabus
              </DialogTitle>
              <p className="text-white/80 mt-1 text-sm sm:text-base">
                Share your syllabus with your students
              </p>
            </DialogHeader>

            {/* Form content */}
            <div className="p-4 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-TextTwo">
                    Subject
                  </Label>
                  <Select onValueChange={setSelectedSubjectId}>
                    <SelectTrigger className="w-full border-gray-200 focus:ring-ColorThree focus:border-ColorThree">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent className="bg-white shadow-lg border-0 max-h-60">
                      {userSubjects?.map((subject: any) => (
                        <SelectItem
                          key={subject.id}
                          value={subject.id.toString()}
                          className="text-TextTwo hover:bg-lamaSkyLight cursor-pointer"
                        >
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-TextTwo">
                    Title
                  </Label>
                  <Input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Enter descriptive title"
                    required
                    className="border-gray-200 focus:ring-ColorThree focus:border-ColorThree"
                  />
                  <p className="text-xs text-gray-500">
                    <strong>Max 15 characters allowed</strong>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-TextTwo">
                    Upload PDF File
                  </Label>
                  <div className="bg-lamaSkyLight border-2 border-dashed border-Primary p-3 sm:p-4 rounded-lg">
                    <UploadthingUploader
                      files={files}
                      uploading={uploading}
                      setUploading={setUploading}
                      onDrop={onDrop}
                      removeFile={removeFile}
                      routeConfig={routeConfig}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    <strong>Only PDF files are allowed</strong>
                  </p>
                </div>

                <div className="pt-2">
                  <ButtonV1
                    type="submit"
                    disabled={
                      !selectedSubjectId || !title || files.length === 0
                    }
                    className="w-full py-2 sm:py-3 bg-ColorTwo disabled:opacity-50 disabled:cursor-not-allowed"
                    icon={Upload}
                    label={uploading ? "Uploading..." : "Upload Syllabus"}
                  />
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cards Grid Section - Enhanced for better responsiveness */}
      {isLoading ? (
        <SyllabusSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {syllabi && syllabi.length > 0 ? (
            syllabi.map((syllabus: any, index: number) => {
              const colorSet = colorSets[index % colorSets.length]

              const cardStyle: CSSProperties & { [key: string]: string } = {
                backgroundColor: colorSet.bg,
                "--hover-bg": colorSet.hover,
                "--icon-color": colorSet.icon,
                "--dark-color": colorSet.icon
              }

              return (
                <Card
                  key={syllabus.id}
                  style={cardStyle}
                  className="group relative p-3 sm:p-4 transition-all duration-300 ease-in-out
            hover:scale-[1.02] hover:shadow-lg overflow-hidden rounded-xl border-0
            hover:bg-[var(--hover-bg)] w-full"
                >
                  {/* Decorative corner accent */}
                  <div
                    className="absolute -top-2 -right-2 w-12 sm:w-16 h-12 sm:h-16 rotate-45 opacity-20"
                    style={{ backgroundColor: colorSet.icon }}
                  ></div>

                  <div className="relative flex flex-row items-start gap-2">
                    <div className="flex-shrink-0 relative z-10">
                      <FileTypeIcon color={colorSet.icon} />
                    </div>
                    <div className="flex-1 min-w-0 relative z-10">
                      <TooltipProvider delayDuration={300}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span
                              className="font-semibold text-gray-800 text-base sm:text-lg truncate max-w-[150px] 
                          cursor-default inline-flex items-center"
                            >
                              <span className="truncate">{syllabus.title}</span>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="bg-white px-2 py-1 rounded-md shadow-md">
                            <p> {syllabus.title}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {/* Updated tags with field names */}
                      <div className="flex flex-col space-y-2 mt-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs sm:text-sm text-gray-600 font-medium">
                            Subject:
                          </span>
                          <TooltipProvider delayDuration={300}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span
                                  className="bg-[var(--hover-bg)] text-black px-2 py-0.5 rounded-md truncate max-w-[150px] 
                          cursor-default text-xs sm:text-sm font-medium inline-flex items-center shadow-sm"
                                >
                                  <span className="truncate">
                                    {syllabus.subjectName || "Unknown Subject"}
                                  </span>
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="bg-white px-2 py-1 rounded-md shadow-md">
                                <p>
                                  {syllabus.subjectName || "Unknown Subject"}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs sm:text-sm text-gray-600 font-medium">
                            Uploaded by:
                          </span>
                          <TooltipProvider delayDuration={300}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span
                                  className="bg-[var(--hover-bg)] text-black px-2 py-0.5 rounded-md truncate max-w-[150px] 
                          cursor-default text-xs sm:text-sm font-medium inline-flex items-center shadow-sm"
                                >
                                  <span className="truncate">
                                    {syllabus.uploadedBy}
                                  </span>
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="bg-white px-2 py-1 rounded-md shadow-md">
                                <p>{syllabus.uploadedBy}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex justify-end gap-2 mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200/50">
                    <TooltipProvider delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-white/70 rounded-lg 
                             transition-all duration-300 text-gray-800 text-xs sm:text-sm font-medium
                             border border-[var(--dark-color)] hover:bg-[var(--dark-color)] hover:text-white"
                            onClick={() => handleViewClick(syllabus.link)}
                            aria-label="View file"
                            style={{ borderColor: colorSet.icon }}
                          >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>View</span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View PDF</p>
                        </TooltipContent>
                      </Tooltip>

                      {/* Download button */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-white/70 rounded-lg 
                             transition-all duration-300 text-gray-800 text-xs sm:text-sm font-medium
                             border border-[var(--dark-color)] hover:bg-[var(--dark-color)] hover:text-white"
                            onClick={(e) => {
                              e.preventDefault()
                              handleDownloadClick(syllabus.link)
                            }}
                            aria-label="Download file"
                            style={{ borderColor: colorSet.icon }}
                          >
                            <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>Download</span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Download as PDF</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </Card>
              )
            })
          ) : (
            <div className="col-span-full">
              <div className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-xl bg-lamaSkyLight border border-dashed border-Primary shadow-sm">
                <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-white mb-3 sm:mb-4 shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <p className="text-center text-gray-800 font-medium text-base sm:text-lg">
                  No syllabus found
                </p>
                <p className="text-center text-gray-500 text-xs sm:text-sm mt-1 max-w-sm">
                  Upload your first syllabus to get started.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
