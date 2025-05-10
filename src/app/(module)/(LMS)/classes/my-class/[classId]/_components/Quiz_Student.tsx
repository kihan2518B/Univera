import React, { useContext, useState, useMemo } from "react"
import { useParams } from "next/navigation"
import { UserContext } from "@/context/user"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Quiz } from "@prisma/client"

async function fetchQuizzes(classId: string) {
  const response = await axios.get(`/api/classes/my-class/${classId}/quizzes`)
  return response?.data.quizzes || []
}

export default function Student() {
  const { classId } = useParams()
  const { user } = useContext(UserContext)
  const { data: quizzes = [] as Quiz[], isLoading } = useQuery({
    queryKey: ["quizzes", classId],
    queryFn: () => fetchQuizzes(String(classId)),
    enabled: !!user && !!classId
  })
  const router = useRouter()

  // State for active tab
  const [activeTab, setActiveTab] = useState("today")

  // Format the time range for display
  const formatTimeRange = (from: string | null, to: string | null) => {
    if (!from || !to) return "Not specified"
    return `${from} - ${to}`
  }

  // Filter quizzes based on active tab and visibility
  const filteredQuizzes = useMemo(() => {
    if (!quizzes.length) {
      return []
    }

    const today = new Date().toISOString().split("T")[0] // Format: YYYY-MM-DD

    return quizzes.filter((quiz: Quiz) => {
      // Filter out draft and private quizzes
      if (quiz.status === "draft" || quiz.visibility === "private") {
        return false
      }

      const quizDate = quiz.date || null

      if (activeTab === "today") {
        return quizDate === today
      } else if (activeTab === "past") {
        return quizDate && quizDate < today
      } else if (activeTab === "upcoming") {
        return quizDate && quizDate > today
      }
      return true // "all" tab shows everything (except drafts/private)
    })
  }, [quizzes, activeTab])

  // Tab button styling helper
  const getTabStyle = (tab: string) => {
    return `px-4 py-2 text-sm font-medium rounded-t-lg ${
      activeTab === tab
        ? "bg-white text-[#5B58EB] border-b-2 border-[#5B58EB]"
        : "bg-[#EDF9FD] text-[#112C71] hover:bg-[#C3EBFA] hover:text-[#0A2353]"
    }`
  }

  // Get status label and color
  const getStatusInfo = (quiz: Quiz) => {
    const today = new Date().toISOString().split("T")[0]
    const quizDate = quiz.date || null
    const now = new Date()
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

    if (!quizDate) {
      return { label: "Unscheduled", color: "bg-gray-400" }
    } else if (quizDate === today) {
      if (quiz.from && quiz.from > currentTime) {
        return { label: "Today (Locked)", color: "bg-yellow-500" }
      }
      return { label: "Today", color: "bg-green-500" }
    } else if (quizDate < today) {
      return { label: "Past", color: "bg-gray-500" }
    } else {
      return { label: "Upcoming", color: "bg-blue-500" }
    }
  }

  // Check if quiz is currently locked
  const isQuizLocked = (quiz: Quiz) => {
    const today = new Date().toISOString().split("T")[0]
    const quizDate = quiz.date || null
    const now = new Date()
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

    // Lock quiz if it's in the future or if it's today but before the "from" time
    return (
      (quizDate && quizDate > today) ||
      (quizDate === today && quiz.from && quiz.from > currentTime) ||
      (quizDate === today && quiz.to && quiz.to < currentTime)
    )
  }

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not scheduled"

    const date = new Date(dateString)
    // Check if the date is valid
    if (isNaN(date.getTime())) return dateString

    return date.toLocaleDateString()
  }

  // Handle back button click
  const handleBackClick = () => {
    router.push(`/classes/my-class/${classId}`)
  }

  return (
    <div className="p-3 md:p-4 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-start md:items-center mb-3">
        <div className="flex items-center">
          <button
            onClick={handleBackClick}
            className="mr-3 p-1 rounded-full hover:bg-gray-200"
            aria-label="Go back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-[#112C71]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-[#112C71]">
            Quizzes
          </h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto space-x-1 mb-4 bg-[#EDF9FD] p-1 rounded-lg shadow-sm">
        <button
          onClick={() => setActiveTab("today")}
          className={getTabStyle("today")}
        >
          Today&apos;s Quizzes
        </button>
        <button
          onClick={() => setActiveTab("upcoming")}
          className={getTabStyle("upcoming")}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab("past")}
          className={getTabStyle("past")}
        >
          Past
        </button>
        <button
          onClick={() => setActiveTab("all")}
          className={getTabStyle("all")}
        >
          All Quizzes
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5B58EB]"></div>
        </div>
      ) : (
        <>
          {/* Desktop Table View - only visible on md screens and above */}
          <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-[#C3EBFA]">
              <thead className="bg-[#87CEEB]">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-[#0A2353] uppercase tracking-wider"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-[#0A2353] uppercase tracking-wider"
                  >
                    Created By
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-[#0A2353] uppercase tracking-wider"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-[#0A2353] uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-[#0A2353] uppercase tracking-wider"
                  >
                    Time
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-[#0A2353] uppercase tracking-wider"
                  >
                    Duration
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-[#0A2353] uppercase tracking-wider"
                  >
                    Questions
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-[#0A2353] uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-[#0A2353] uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#F1F0FF]">
                {filteredQuizzes.length > 0 ? (
                  filteredQuizzes.map((quiz: Quiz, index: number) => {
                    const locked = isQuizLocked(quiz)
                    return (
                      <tr
                        key={quiz.id}
                        className={
                          index % 2 === 0 ? "bg-[#FEFCE8]" : "bg-white"
                        }
                      >
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-[#112C71]">
                          {quiz.title}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-[#0A2353]">
                          {quiz.createdByName}
                        </td>
                        <td className="px-4 py-4 text-sm text-[#0A2353] max-w-xs truncate">
                          {quiz.description}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-[#0A2353]">
                          {formatDate(quiz.date)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-[#0A2353]">
                          {formatTimeRange(quiz.from, quiz.to)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-[#0A2353]">
                          {quiz.duration} min
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-[#0A2353]">
                          {quiz.numberOfQuestions}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-[#0A2353]">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusInfo(
                              quiz
                            )
                              .color.replace("bg-", "bg-")
                              .replace("500", "100")} ${getStatusInfo(
                              quiz
                            ).color.replace("bg-", "text-")}`}
                          >
                            {getStatusInfo(quiz).label}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          {locked ? (
                            <div className="flex-1 py-2 px-3 bg-gray-100 text-gray-500 rounded-md text-sm font-medium flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                              </svg>
                              Locked
                            </div>
                          ) : (
                            <button
                              onClick={() =>
                                router.push(
                                  `/classes/my-class/${classId}/quizzes/${quiz.id}`
                                )
                              }
                              className="flex-1 py-2 px-3 bg-[#EDF9FD] text-[#5B58EB] rounded-md text-sm font-medium hover:bg-[#C3EBFA] transition-colors flex items-center justify-center"
                            >
                              View Quiz
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-gray-500">
                      No {activeTab === "all" ? "" : activeTab} quizzes
                      available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View - optimized for mobile experience */}
          <div className="block md:hidden space-y-4">
            {filteredQuizzes.length > 0 ? (
              filteredQuizzes.map((quiz: Quiz) => {
                const statusInfo = getStatusInfo(quiz)
                const locked = isQuizLocked(quiz)
                return (
                  <div
                    key={quiz.id}
                    className="bg-white rounded-lg shadow-md p-3 border-l-4 border-[#5B58EB]"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-[#112C71] text-base">
                        {quiz.title}
                      </h3>
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.color
                          .replace("bg-", "bg-")
                          .replace("500", "100")} ${statusInfo.color.replace(
                          "bg-",
                          "text-"
                        )}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {quiz.description}
                    </p>

                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-[#0A2353] mb-3">
                      <div className="flex items-center">
                        <span className="font-medium mr-1">Created by:</span>
                        <span className="truncate">{quiz.createdByName}</span>
                      </div>
                      <div>
                        <span className="font-medium mr-1">Date:</span>
                        {formatDate(quiz.date)}
                      </div>
                      <div>
                        <span className="font-medium mr-1">Time:</span>
                        {formatTimeRange(quiz.from, quiz.to)}
                      </div>
                      <div>
                        <span className="font-medium mr-1">Duration:</span>
                        {quiz.duration} min
                      </div>
                      <div>
                        <span className="font-medium mr-1">Questions:</span>
                        {quiz.numberOfQuestions}
                      </div>
                      <div>
                        <span className="font-medium mr-1">Total Marks:</span>
                        {quiz.totalMarks || "N/A"}
                      </div>
                    </div>

                    {/* Status indicator */}
                    <div className="flex items-center mb-3">
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${statusInfo.color}`}
                      ></div>
                      <span className="text-xs font-medium">
                        {statusInfo.label}
                      </span>

                      {quiz.documentUrl && (
                        <div className="ml-auto">
                          <a
                            href={quiz.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 flex items-center"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 mr-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Resources
                          </a>
                        </div>
                      )}
                    </div>

                    {quiz.tags && quiz.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {quiz.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-[#F1F0FF] text-[#5B58EB] px-2 py-0.5 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {locked ? (
                      <button
                        className="w-full py-2.5 rounded-md text-sm font-medium flex items-center justify-center bg-gray-100 text-gray-500"
                        disabled
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                        Locked Until{" "}
                        {quiz.date === new Date().toISOString().split("T")[0]
                          ? quiz.from
                          : formatDate(quiz.date)}
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          router.push(
                            `/classes/my-class/${classId}/quizzes/${quiz.id}`
                          )
                        }
                        className="w-full py-2.5 rounded-md text-sm font-medium flex items-center justify-center bg-[#EDF9FD] text-[#5B58EB] hover:bg-[#C3EBFA] transition-colors"
                      >
                        Take Quiz
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                )
              })
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500 flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-gray-300 mb-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <p>
                  No {activeTab === "all" ? "" : activeTab} quizzes available
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
