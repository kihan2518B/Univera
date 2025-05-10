"use client"
import React from "react"
import { useContext, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { UserContext } from "@/context/user"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"

interface Subject {
  id: string
  name: string
}

const getSubjects = async (userId: string) => {
  const res = await axios.get("/api/subjects", {
    params: { userId }
  })

  return res.data.subjects
}

export default function CreateQuiz({
  closeDialog,
  refetchQuizzes
}: {
  closeDialog: () => void
  refetchQuizzes: () => void
}) {
  const { user } = useContext(UserContext)
  const { classId } = useParams<{ classId: string }>()
  const router = useRouter()
  // Format today's date as YYYY-MM-DD for default value and min attribute
  const today = new Date().toISOString().split("T")[0]

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    tags: "",
    classId: classId || "",
    subjectId: "",
    date: today, // Add date field with today as default
    enableTimeCustomization: false,
    fromTime: "08:00",
    toTime: ""
  })

  const { data: subjects, isLoading: subjectsLoading } = useQuery({
    queryKey: ["subjects"],
    queryFn: () => getSubjects(user?.id as string),
    enabled: !!user?.id
  })

  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  // Handles text input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined

    // Special handling for date field to prevent dates before today
    if (name === "date" && value < today) {
      // If selected date is before today, keep using today's date
      setFormData({ ...formData, [name]: today })
      return
    }

    // For checkbox inputs, use the checked property
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked })
      return
    }

    setFormData({ ...formData, [name]: value })
  }

  // Handles file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setFile(e.target.files[0])
  }

  const encodeFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  // Handles form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      alert("Please upload a document")
      return
    }

    // Additional validation to ensure selected date is not before today
    if (new Date(formData.date) < new Date(today)) {
      alert("Quiz date cannot be set to a date in the past")
      return
    }

    // Validation for time customization
    if (formData.enableTimeCustomization && !formData.fromTime) {
      alert("From Time is required when time customization is enabled")
      return
    }

    const EncodeFileASBase64 = await encodeFileAsBase64(file)
    const submitedFile = {
      name: file.name,
      type: file.type,
      data: EncodeFileASBase64
    }

    setLoading(true)
    try {
      // Create payload with time customization if enabled
      const payload = {
        ...formData,
        file: submitedFile,
        universityId: `${user?.universityId}`,
        departmentId: `${user?.departmentId}`,
        date: new Date(formData.date).toISOString(), // Format date as ISO string for backend
        tags: formData.tags.split(",").map((tag) => tag.trim()), // Convert tags into an array
        // Include time customization data only if enabled
        ...(formData.enableTimeCustomization && {
          fromTime: formData.fromTime,
          toTime: formData.toTime || null // Send null if toTime is empty
        })
      }

      const res = await axios.post(
        `/api/classes/my-class/${classId}/quizzes`,
        payload
      )
      const result = res.data
      if (res.status == 201) {
        closeDialog()
        toast.success("Quiz Created")
        router.push(`/classes/my-class/${classId}/quizzes/${result.quiz.id}`)
        refetchQuizzes()
        setFormData({
          title: "",
          description: "",
          duration: "",
          tags: "",
          classId: classId || "",
          subjectId: "",
          date: today,
          enableTimeCustomization: false,
          fromTime: "08:00",
          toTime: ""
        })
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Something went wrong")
      } else {
        toast.error("An unexpected error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full bg-[#EDF9FD] rounded-lg overflow-hidden shadow-lg">
      <div className="bg-[#87CEEB] p-2">
        <h1 className="text-2xl font-bold text-[#112C71] text-center">
          Create a New Quiz
        </h1>
        <button
          onClick={closeDialog}
          className="text-[#112C71] hover:text-[#BB63FF] transition-colors absolute right-3 top-3"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <p className="text-[#0A2353] text-center mt-2">
          Fill in the details below to generate a quiz for your class
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold text-[#112C71] mb-4 flex items-center">
                <span className="bg-[#5B58EB] text-white w-6 h-6 rounded-full inline-flex items-center justify-center mr-2">
                  1
                </span>
                Basic Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#0A2353] mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border border-[#C3EBFA] rounded-lg p-3 focus:ring-2 focus:ring-[#5B58EB] focus:border-transparent"
                    required
                    placeholder="Enter quiz title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0A2353] mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border border-[#C3EBFA] rounded-lg p-3 focus:ring-2 focus:ring-[#5B58EB] focus:border-transparent"
                    rows={3}
                    placeholder="Enter a brief quiz description"
                  />
                </div>

                {/* Date Field with min attribute to prevent past dates */}
                <div>
                  <label className="block text-sm font-medium text-[#0A2353] mb-1">
                    Quiz Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={today} // This prevents selecting dates before today in the date picker
                    className="w-full border border-[#C3EBFA] rounded-lg p-3 focus:ring-2 focus:ring-[#5B58EB] focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    You can only select today or future dates
                  </p>
                </div>

                {/* Time Customization Checkbox */}
                <div className="pt-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="enableTimeCustomization"
                      name="enableTimeCustomization"
                      checked={formData.enableTimeCustomization}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#5B58EB] focus:ring-[#5B58EB] border-[#C3EBFA] rounded"
                    />
                    <label
                      htmlFor="enableTimeCustomization"
                      className="ml-2 block text-sm font-medium text-[#0A2353]"
                    >
                      Enable time customization
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 ml-6">
                    Set specific times when students can access the quiz
                  </p>
                </div>

                {/* Time Fields (shown only when checkbox is checked) */}
                {formData.enableTimeCustomization && (
                  <div className="space-y-4 pt-2 pl-2 border-l-2 border-[#C3EBFA]">
                    <div>
                      <label className="block text-sm font-medium text-[#0A2353] mb-1">
                        From Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        name="fromTime"
                        value={formData.fromTime}
                        onChange={handleChange}
                        className="w-full border border-[#C3EBFA] rounded-lg p-3 focus:ring-2 focus:ring-[#5B58EB] focus:border-transparent"
                        required={formData.enableTimeCustomization}
                      />
                      <p className="text-xs text-red-500 mt-1">
                        Quiz will be accessible from this time
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#0A2353] mb-1">
                        To Time{" "}
                        <span className="text-gray-400">(Optional)</span>
                      </label>
                      <input
                        type="time"
                        name="toTime"
                        value={formData.toTime}
                        onChange={handleChange}
                        className="w-full border border-[#C3EBFA] rounded-lg p-3 focus:ring-2 focus:ring-[#5B58EB] focus:border-transparent"
                      />
                      <p className="text-xs text-red-500 mt-1">
                        If set, quiz will be accessible until this time
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold text-[#112C71] mb-4 flex items-center">
                <span className="bg-[#5B58EB] text-white w-6 h-6 rounded-full inline-flex items-center justify-center mr-2">
                  2
                </span>
                Quiz Parameters
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#0A2353] mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full border border-[#C3EBFA] rounded-lg p-3 focus:ring-2 focus:ring-[#5B58EB] focus:border-transparent"
                    required
                    placeholder="e.g., 30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0A2353] mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="w-full border border-[#C3EBFA] rounded-lg p-3 focus:ring-2 focus:ring-[#5B58EB] focus:border-transparent"
                    required
                    placeholder="e.g., Midterm, Chapter 1, Theory"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0A2353] mb-1">
                    Subject
                  </label>
                  <select
                    name="subjectId"
                    value={formData.subjectId}
                    onChange={handleChange}
                    className="w-full border border-[#C3EBFA] rounded-lg p-3 focus:ring-2 focus:ring-[#5B58EB] focus:border-transparent bg-white"
                    required
                  >
                    <option value="">Select a subject</option>
                    {subjectsLoading ? (
                      <option disabled>Loading subjects...</option>
                    ) : (
                      subjects?.map((subject: Subject) => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold text-[#112C71] mb-4 flex items-center">
                <span className="bg-[#5B58EB] text-white w-6 h-6 rounded-full inline-flex items-center justify-center mr-2">
                  3
                </span>
                Content Generation
              </h2>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-[#C3EBFA] rounded-lg p-6 text-center">
                  <div className="mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 mx-auto text-[#5B58EB]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <label className="block text-lg font-medium text-[#0A2353] mb-2">
                    Upload Document (PDF)
                  </label>
                  <p className="text-sm text-gray-500 mb-4">
                    Your quiz will be generated based on this document
                  </p>

                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    required
                  />
                  <label
                    htmlFor="file-upload"
                    className="bg-[#F1F0FF] hover:bg-[#CECDF9] text-[#5B58EB] font-medium py-2 px-4 rounded-lg cursor-pointer transition-all duration-300 inline-block"
                  >
                    {file ? "Change File" : "Select PDF File"}
                  </label>

                  {file && (
                    <div className="mt-4 bg-[#FEFCE8] p-3 rounded-lg text-sm flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-[#BB63FF] mr-2"
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
                      <span className="font-medium text-[#0A2353] truncate">
                        {file.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold text-[#112C71] mb-4 flex items-center">
                <span className="bg-[#5B58EB] text-white w-6 h-6 rounded-full inline-flex items-center justify-center mr-2">
                  4
                </span>
                Review & Generate
              </h2>

              <div className="space-y-4">
                <div className="bg-[#FEFCE8] p-4 rounded-lg">
                  <h3 className="font-medium text-[#0A2353] mb-2">
                    Before submitting:
                  </h3>
                  <ul className="text-sm text-[#0A2353] space-y-2">
                    <li className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-[#BB63FF] mr-2 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Ensure all required fields are filled
                    </li>
                    <li className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-[#BB63FF] mr-2 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Check that your PDF document is properly uploaded
                    </li>
                    <li className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-[#BB63FF] mr-2 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Verify the subject selection is correct
                    </li>
                    <li className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-[#BB63FF] mr-2 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Confirm the quiz date is set to today or a future date
                    </li>
                    {formData.enableTimeCustomization && (
                      <li className="flex items-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-[#BB63FF] mr-2 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Ensure From Time is set for time customization
                      </li>
                    )}
                  </ul>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#5B58EB] to-[#BB63FF] text-white py-4 rounded-lg font-bold text-lg transition-all duration-300 ease-in-out hover:opacity-90 disabled:from-gray-400 disabled:to-gray-500 disabled:opacity-70 shadow-md"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Generating Quiz...
                    </div>
                  ) : (
                    <>Generate Quiz</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
