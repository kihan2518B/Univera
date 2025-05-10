import React, { useContext, useState } from "react"
import CreateQuiz from "../_components/CreateQuiz"
import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
import { useParams } from "next/navigation"
import { UserContext } from "@/context/user"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { FacultyQuizzesSkeleton } from "@/components/(commnon)/Skeleton"

async function fetchQuizzes(classId: string) {
  const response = await axios.get(`/api/classes/my-class/${classId}/quizzes`)
  return response?.data.quizzes || []
}

export default function Faculty() {
  const { classId } = useParams()
  const { user } = useContext(UserContext)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const {
    data: quizzes = [],
    refetch,
    isLoading
  } = useQuery({
    queryKey: ["quizzes"],
    queryFn: () => fetchQuizzes(String(classId)),
    enabled: !!user
  })
  const router = useRouter()

  const handleBack = () => {
    router.push(`/classes/my-class/${classId}`)
  }

  const openDialog = () => {
    setIsDialogOpen(true)
    // Prevent scrolling on the background when dialog is open
    document.body.style.overflow = "hidden"
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    // Re-enable scrolling
    document.body.style.overflow = "auto"
  }

  return (
    <div className="p-3">
      <div className="mb-4">
        <Button
          onClick={handleBack}
          variant="ghost"
          className="flex items-center text-TextTwo hover:bg-lamaSkyLight"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back
        </Button>
      </div>
      <div className="flex justify-between items-start md:items-center mb-3">
        <h1 className="text-2xl font-bold text-[#112C71] mb-4 md:mb-0">
          Quizzes
        </h1>
        <ButtonV1 label="Create Quiz" onClick={openDialog} />
      </div>

      {isLoading ? (
        <FacultyQuizzesSkeleton />
      ) : (
        <>
          {/* Desktop Table View - only visible on md screens and above */}
          <div className="hidden md:block overflow-x-auto bg-[#EDF9FD] rounded-lg shadow-md">
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
                    Duration (min)
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
                    Total Marks
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
                {quizzes.length > 0 ? (
                  quizzes.map((quiz: any, index: number) => (
                    <tr
                      key={quiz.id}
                      className={index % 2 === 0 ? "bg-[#FEFCE8]" : "bg-white"}
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
                        {quiz.duration}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-[#0A2353]">
                        {quiz.numberOfQuestions}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-[#0A2353]">
                        {quiz.totalMarks}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() =>
                            router.push(
                              `/classes/my-class/${classId}/quizzes/${quiz.id}`
                            )
                          }
                          className="flex-1 py-2 bg-[#EDF9FD] text-[#5B58EB] rounded-md text-sm font-medium"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-gray-500">
                      No quizzes available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View - only visible on smaller screens (below md breakpoint) */}
          <div className="block md:hidden space-y-4">
            {quizzes.length > 0 ? (
              quizzes.map((quiz: any) => (
                <div
                  key={quiz.id}
                  className="bg-white rounded-lg shadow-md p-2.5 border-l-4 border-[#5B58EB]"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-[#112C71]">{quiz.title}</h3>
                    <span className="bg-[#F1F0FF] text-[#5B58EB] px-2 py-1 rounded-full text-xs">
                      {quiz.totalMarks} marks
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {quiz.description}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-[#0A2353] mt-3">
                    <div>
                      <span className="font-medium">Created by:</span>{" "}
                      {quiz.createdByName}
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span>{" "}
                      {quiz.duration} min
                    </div>
                    <div>
                      <span className="font-medium">Questions:</span>{" "}
                      {quiz.numberOfQuestions}
                    </div>
                    <div>
                      <span className="font-medium">Created:</span>{" "}
                      {new Date(quiz.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() =>
                        router.push(
                          `/classes/my-class/${classId}/quizzes/${quiz.id}`
                        )
                      }
                      className="flex-1 py-2 bg-[#EDF9FD] text-[#5B58EB] rounded-md text-sm font-medium"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">
                No quizzes available
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal Dialog for Create Quiz */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div
            className="relative bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CreateQuiz closeDialog={closeDialog} refetchQuizzes={refetch} />
          </div>
        </div>
      )}
    </div>
  )
}
