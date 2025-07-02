import React, { useState, useEffect, useCallback, useRef } from "react"
import {
  Clock,
  Play,
  Send,
  AlertCircle,
  CheckCircle,
  ArrowLeft
} from "lucide-react"
import { Quiz } from "@/types/globals"
import toast from "react-hot-toast"
import axios from "axios"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { QuizReviewSkeleton } from "@/components/(commnon)/Skeleton"

const fetchSUbmissionData = async (
  classId: string,
  quizId: string,
  studentId: string
) => {
  const response = await axios.get(
    `/api/classes/my-class/${classId}/quizzes/submission?quizId=${quizId}&studentId=${studentId}&route=personal`
  )
  return response.data || []
}

function enterFullscreen() {
  const elem = document.documentElement
  if (elem.requestFullscreen) elem.requestFullscreen()
  else if ((elem as any).webkitRequestFullscreen)
    (elem as any).webkitRequestFullscreen()
  else if ((elem as any).msRequestFullscreen)
    (elem as any).msRequestFullscreen()
}

function exitFullscreen() {
  try {
    if (document.hidden) return
    if (document.fullscreenElement) {
      if (document.exitFullscreen) document.exitFullscreen()
      else if ((document as any).webkitExitFullscreen)
        (document as any).webkitExitFullscreen()
      else if ((document as any).msExitFullscreen)
        (document as any).msExitFullscreen()
    }
  } catch (err) {
    console.warn("Error exiting fullscreen:", err)
  }
}

const QuizSubmission = ({
  quiz,
  studentId
}: {
  quiz: Quiz
  studentId: string
}) => {
  // 1️⃣ Get Params
  const { classId } = useParams()

  // 2️⃣ State
  const [answers, setAnswers] = useState<{ [key: number]: number }>({})
  const [quizStarted, setQuizStarted] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [quizStatus, setQuizStatus] = useState("not-started")
  const [submittedAnswers, setSubmittedAnswers] = useState<{
    [key: number]: number
  }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [totalMarks, setTotalMarks] = useState(0)
  const [isResumable, setIsResumable] = useState(false)

  const hasAutoSubmitted = useRef(false)
  const answersRef = useRef<{ [key: number]: number }>({})

  // 3️⃣ Fetch submission data
  const { data: submissionData, isLoading: isLoadingSubmission } = useQuery({
    queryKey: ["submission", quiz.id, studentId],
    queryFn: () =>
      fetchSUbmissionData(
        classId as string,
        String(quiz.id),
        studentId as string
      ),
    enabled: !!classId && !!quiz.id && !!studentId
  })

  // 4️⃣ Accessibility
  const getQuizAccessibility = () => {
    const now = new Date()
    const today = now.toISOString().split("T")[0]
    const currentTimeString = now.toTimeString().slice(0, 5)

    if (quiz.date !== today) {
      return {
        accessible: false,
        reason: quiz.date > today ? "Quiz not yet available" : "Quiz has ended",
        showStartButton: false,
        status: quiz.date < today ? "expired" : "not-started"
      }
    }

    if (!quiz.from && !quiz.to) {
      return {
        accessible: true,
        reason: "Click start to begin quiz",
        showStartButton: !quizStarted,
        status: "ready"
      }
    }

    if (quiz.from && !quiz.to) {
      if (currentTimeString >= quiz.from && currentTimeString <= "23:59") {
        return {
          accessible: true,
          reason: "Quiz available until 23:59",
          showStartButton: !quizStarted,
          status: "active-window"
        }
      } else if (currentTimeString < quiz.from) {
        return {
          accessible: false,
          reason: `Quiz starts at ${quiz.from}`,
          showStartButton: false,
          status: "not-started"
        }
      } else {
        return {
          accessible: false,
          reason: "Quiz time has ended",
          showStartButton: false,
          status: "expired"
        }
      }
    }

    if (quiz.from && quiz.to) {
      if (currentTimeString >= quiz.from && currentTimeString <= quiz.to) {
        return {
          accessible: true,
          reason: `Quiz available from ${quiz.from} to ${quiz.to}`,
          showStartButton: !quizStarted,
          status: "active-window"
        }
      } else if (currentTimeString < quiz.from) {
        return {
          accessible: false,
          reason: `Quiz starts at ${quiz.from}`,
          showStartButton: false,
          status: "not-started"
        }
      } else {
        return {
          accessible: false,
          reason: "Quiz time has ended",
          showStartButton: false,
          status: "expired"
        }
      }
    }

    return {
      accessible: false,
      reason: "Quiz not available",
      showStartButton: false,
      status: "not-available"
    }
  }

  const accessibility = getQuizAccessibility()

  // 5️⃣ Callbacks
  const handleAutoSubmit = useCallback(() => {
    if (quizStatus === "submitted" || quizStatus === "time-up") return
    setQuizStatus("time-up")
    submitQuiz(true)
  }, [quizStatus])

  // 6️⃣ Effects

  // Sync answers ref
  useEffect(() => {
    answersRef.current = answers
  }, [answers])

  // Check expired on mount
  useEffect(() => {
    const storedEnd = localStorage.getItem(`quiz_${quiz.id}_endTime`)
    if (storedEnd) {
      const endTimestamp = parseInt(storedEnd)
      const diffSeconds = Math.floor((endTimestamp - Date.now()) / 1000)
      if (diffSeconds <= 0) {
        if (!hasAutoSubmitted.current) {
          hasAutoSubmitted.current = true
          handleAutoSubmit()
        }
      }
    }
  }, [])

  // Cheating detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && quizStatus === "active") {
        handleAutoSubmit()
      }
    }
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && quizStatus === "active") {
        handleAutoSubmit()
      }
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (quizStatus === "active") {
        e.preventDefault()
        e.returnValue = ""
      }
    }

    const disableAllKeys = (e: KeyboardEvent) => {
      e.preventDefault()
      e.stopPropagation()
      return false
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    window.addEventListener("beforeunload", handleBeforeUnload)
    window.addEventListener("keydown", disableAllKeys)
    window.addEventListener("keypress", disableAllKeys)
    window.addEventListener("keyup", disableAllKeys)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      window.removeEventListener("beforeunload", handleBeforeUnload)
      window.removeEventListener("keydown", disableAllKeys)
      window.removeEventListener("keypress", disableAllKeys)
      window.removeEventListener("keyup", disableAllKeys)
    }
  }, [quizStatus, handleAutoSubmit])

  // Countdown timer
  useEffect(() => {
    let timer: any
    if (quizStarted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            if (!hasAutoSubmitted.current) {
              hasAutoSubmitted.current = true
              handleAutoSubmit()
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [quizStarted, timeRemaining, handleAutoSubmit])

  // Process submission data
  useEffect(() => {
    if (submissionData) {
      setQuizStatus("submitted")
      const parsedAnswers: { [key: number]: number } = {}
      submissionData?.answers?.forEach((answer: string, index: number) => {
        const answerValue = parseInt(answer)
        if (answerValue !== -1 && quiz.questions[index]) {
          parsedAnswers[quiz.questions[index].id] = answerValue
        }
      })
      setSubmittedAnswers(parsedAnswers)
      setTotalMarks(submissionData.marks)
    }
  }, [submissionData, quiz.questions])

  // Restore resumable
  useEffect(() => {
    const storedEndTime = localStorage.getItem(`quiz_${quiz.id}_endTime`)
    if (storedEndTime) {
      setIsResumable(true)
    }
  }, [quiz.id])

  // Expired accessibility
  useEffect(() => {
    if (accessibility.status === "expired" && quizStatus === "not-started") {
      setQuizStatus("expired")
    }
  }, [accessibility.status, quizStatus])

  // 7️⃣ Handlers
  const handleStartQuiz = () => {
    enterFullscreen()
    let endTime
    if (quiz.from) {
      const [hours, minutes] = quiz.from.split(":").map(Number)
      const startTime = new Date()
      startTime.setHours(hours, minutes, 0, 0)
      endTime = new Date(
        startTime.getTime() + parseInt(quiz.duration) * 60 * 1000
      )
    } else {
      const now = new Date()
      endTime = new Date(now.getTime() + parseInt(quiz.duration) * 60 * 1000)
    }
    const endTimestamp = endTime.getTime()
    localStorage.setItem(`quiz_${quiz.id}_endTime`, endTimestamp.toString())
    const diffSeconds = Math.max(
      0,
      Math.floor((endTimestamp - Date.now()) / 1000)
    )
    setTimeRemaining(diffSeconds)
    setQuizStarted(true)
    setQuizStatus("active")
    setIsResumable(false)
  }

  const handleResumeQuiz = () => {
    enterFullscreen()
    const storedEnd = localStorage.getItem(`quiz_${quiz.id}_endTime`)
    if (!storedEnd) return
    const endTimestamp = parseInt(storedEnd)
    const diffSeconds = Math.max(
      0,
      Math.floor((endTimestamp - Date.now()) / 1000)
    )
    if (diffSeconds <= 0) {
      handleAutoSubmit()
      return
    }
    setTimeRemaining(diffSeconds)
    setQuizStarted(true)
    setQuizStatus("active")
    setIsResumable(false)
  }

  const handleAnswerSelect = (questionId: number, optionIndex: number) => {
    if (!accessibility.accessible && !quizStarted) return
    if (quizStatus !== "active") return
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }))
  }

  const handleSubmit = () => {
    submitQuiz(false)
  }

  const submitQuiz = async (isAutoSubmit = false) => {
    setIsSubmitting(true)
    try {
      let marks = 0
      const answersArray = quiz.questions.map((question) => {
        const answer = answersRef.current[question.id]
        if (answer !== undefined) {
          if (answer === question.correctAnswer) {
            marks += question.marks
          }
          return answer
        } else {
          return -1
        }
      })
      const res = await axios.post(
        `/api/classes/my-class/${classId}/quizzes/submission`,
        {
          studentId,
          quizId: quiz.id,
          answers: answersArray,
          status: isAutoSubmit ? "auto-submitted" : "submitted",
          marks
        }
      )
      if (res.status >= 200 && res.status < 300) {
        toast.success(res.data.message || "Quiz submitted successfully")
        setSubmittedAnswers({ ...answers })
        setQuizStatus("submitted")
        localStorage.removeItem(`quiz_${quiz.id}_endTime`)
      }
      setTotalMarks(marks)
    } catch (error) {
      console.log(error)
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Something went wrong")
      } else {
        toast.error("An unexpected error occurred")
      }
    } finally {
      setIsSubmitting(false)
      exitFullscreen()
    }
  }

  // 8️⃣ Helpers
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const shouldShowQuestions = () =>
    ["active", "submitted", "time-up", "expired"].includes(quizStatus)

  const getOptionStyling = (question: any, optionIndex: number) => {
    const isCorrect = question.correctAnswer === optionIndex
    const isSelected =
      submittedAnswers[question.id] === optionIndex ||
      answers[question.id] === optionIndex
    if (quizStatus === "submitted" || quizStatus === "time-up") {
      if (isCorrect && isSelected)
        return "bg-green-100 border-green-500 border-2"
      if (isCorrect) return "bg-green-50 border-green-400 border-2"
      if (isSelected) return "bg-red-100 border-red-400 border-2"
      return "bg-gray-50 border-gray-200 cursor-not-allowed opacity-75"
    }
    if (quizStatus === "expired") {
      if (isCorrect) return "bg-green-50 border-green-400 border-2"
      return "bg-gray-50 border-gray-200 cursor-not-allowed opacity-75"
    }
    if (quizStatus === "active") {
      if (isSelected) return "bg-blue-100 border-blue-500 shadow-md"
      return "bg-gray-50 border-gray-200 hover:bg-blue-50 hover:border-blue-300"
    }
    return "bg-gray-50 border-gray-200 cursor-not-allowed opacity-50"
  }

  const answeredCount =
    Object.keys(answers).length ||
    (submissionData?.answers
      ? submissionData.answers.filter((a: string) => a !== "-1").length
      : 0)

  // 9️⃣ Loading state
  if (isLoadingSubmission) return <QuizReviewSkeleton />

  return (
    <div
      className="min-h-screen select-none"
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onPaste={(e) => e.preventDefault()}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="mx-2 w-fit">
        <Link
          href={`/classes/my-class/${classId}/quizzes`}
          className="flex items-center gap-2 border border-gray-300 bg-white text-gray-700 font-semibold rounded-lg px-3 py-1 hover:bg-gray-100 hover:shadow transition duration-200 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="truncate">Back</span>
        </Link>
      </div>
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {quiz.title}
              </h1>
              <p className="text-gray-600 mb-4 md:mb-0">
                Created by {quiz.createdByName} • {quiz.numberOfQuestions}{" "}
                Questions • {quiz.totalMarks} Marks
              </p>
              {/* Show marks if submitted */}
              {submissionData && (
                <div className="mt-2">
                  <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                    Your Score: {submissionData.marks}/{quiz.totalMarks} marks
                  </span>
                </div>
              )}
            </div>

            {/* Timer/Status Display */}
            <div className="flex items-center gap-4">
              {quizStarted && quizStatus === "active" && (
                <div className="flex items-center gap-2 bg-yellow-100 border border-yellow-300 rounded-lg px-4 py-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <span className="font-mono text-lg font-semibold text-gray-900">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              )}

              {quizStatus === "time-up" && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-300 rounded-lg px-4 py-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-700 font-semibold">Time Up!</span>
                </div>
              )}

              {quizStatus === "submitted" && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-300 rounded-lg px-4 py-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-green-700 font-semibold">
                    {submissionData?.status === "auto-submitted"
                      ? "Auto-Submitted"
                      : "Submitted"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Accessibility Status */}
          {!accessibility.accessible && quizStatus === "not-started" && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-700 font-semibold">
                  {accessibility.reason}
                </span>
              </div>
            </div>
          )}

          {accessibility.accessible &&
            accessibility.showStartButton &&
            quizStatus === "not-started" && (
              <div className="mt-4 space-y-4">
                {/* Security Warning Section */}
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-amber-600 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-amber-800 mb-2">
                        Important Quiz Security Guidelines
                      </h3>
                      <div className="text-sm text-amber-700 space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <p className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
                              <span className="leading-relaxed">
                                <strong>Fullscreen Mode:</strong> Quiz will
                                automatically enter fullscreen. Exiting
                                fullscreen will submit your quiz immediately.
                              </span>
                            </p>
                            <p className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
                              <span className="leading-relaxed">
                                <strong>Tab Switching:</strong> Changing tabs or
                                switching to other applications will auto-submit
                                your quiz.
                              </span>
                            </p>
                            <p className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
                              <span className="leading-relaxed">
                                <strong>Timer:</strong> You have {quiz.duration}{" "}
                                minutes. Timer counts down every second and
                                continues even after page refresh.
                              </span>
                            </p>
                          </div>
                          <div className="space-y-2">
                            <p className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
                              <span className="leading-relaxed">
                                <strong>Keyboard Disabled:</strong> All keyboard
                                shortcuts and keys will be disabled during the
                                quiz.
                              </span>
                            </p>
                            <p className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
                              <span className="leading-relaxed">
                                <strong>Page Refresh:</strong> Refreshing the
                                page will not reset the timer, but all your
                                selected answers will be lost.
                              </span>
                            </p>
                            <p className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
                              <span className="leading-relaxed">
                                <strong>Auto-Submit:</strong> Quiz will
                                automatically submit when time expires, even if
                                you have not manually submitted.
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-amber-100 rounded-md border border-amber-300">
                          <p className="text-amber-800 font-medium text-center text-sm sm:text-base">
                            ⚠️ Once started, ensure stable internet connection
                            and avoid any actions that might trigger
                            auto-submission
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quiz Start Section */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 font-semibold text-base sm:text-lg">
                        Ready to start?
                      </p>
                      <p className="text-gray-600 text-sm sm:text-base mt-1">
                        You will have {quiz.duration} minutes to complete this
                        quiz
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs sm:text-sm text-blue-700">
                        <span className="inline-flex items-center gap-1 bg-blue-100 px-2 py-1 rounded">
                          <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {quiz.duration} min timer
                        </span>
                        <span className="inline-flex items-center gap-1 bg-blue-100 px-2 py-1 rounded">
                          <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Fullscreen mode
                        </span>
                        <span className="inline-flex items-center gap-1 bg-blue-100 px-2 py-1 rounded">
                          <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Secure mode
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                      {!quizStarted && !isResumable && (
                        <button
                          onClick={handleStartQuiz}
                          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 w-full sm:w-auto"
                        >
                          <Play className="w-5 h-5" />
                          Start Quiz
                        </button>
                      )}

                      {!quizStarted && isResumable && (
                        <button
                          onClick={handleResumeQuiz}
                          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 w-full sm:w-auto"
                        >
                          <Play className="w-5 h-5" />
                          Resume Quiz
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

          {/* Quiz Status Messages */}
          {quizStatus === "expired" && (
            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                <span className="text-orange-700 font-semibold">
                  Quiz time has ended. Here are the correct answers:
                </span>
              </div>
            </div>
          )}

          {quizStatus === "submitted" && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-green-700 font-semibold">
                  Quiz submitted successfully! Review your answers below:
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {shouldShowQuestions() &&
          quizStatus !== "expired" &&
          quizStatus !== "submitted" && (
            <div className="bg-white rounded-xl shadow-lg border border-blue-200 p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-900">
                  Progress: {answeredCount}/{quiz.numberOfQuestions}
                </span>
                <span className="text-sm text-gray-600">
                  {Math.round((answeredCount / quiz.numberOfQuestions) * 100)}%
                  Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(answeredCount / quiz.numberOfQuestions) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          )}

        {/* Questions - Only show when appropriate */}
        {!shouldShowQuestions() && (
          <div className="bg-white rounded-xl shadow-lg border border-blue-200 p-4 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Quiz Not Visible
              </h3>
              <p className="text-gray-600 max-w-lg">
                {accessibility.reason}. Questions will be visible when the quiz
                starts.
              </p>
            </div>
          </div>
        )}

        {shouldShowQuestions() && (
          <div className="space-y-6">
            {quiz.questions.map((question, index) => (
              <div
                key={question.id}
                className="bg-white rounded-xl shadow-lg border border-blue-200 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 border-b border-blue-200">
                  <div className="flex items-start gap-3">
                    <span className="bg-blue-600 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {question.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {question.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                          {question.marks}{" "}
                          {question.marks === 1 ? "Mark" : "Marks"}
                        </span>
                        {/* Answer status indicators */}
                        {(quizStatus === "submitted" ||
                          quizStatus === "time-up") && (
                          <div className="flex items-center gap-2">
                            {submittedAnswers[question.id] ===
                            question.correctAnswer ? (
                              <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                                ✓ Correct
                              </span>
                            ) : submittedAnswers[question.id] !== undefined ? (
                              <span className="inline-block bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded">
                                ✗ Incorrect
                              </span>
                            ) : (
                              <span className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-1 rounded">
                                Not Answered
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="grid gap-3">
                    {question.options.map((option, optionIndex) => {
                      const isCorrect = question.correctAnswer === optionIndex
                      const isSelected =
                        submittedAnswers[question.id] === optionIndex ||
                        answers[question.id] === optionIndex

                      return (
                        <label
                          key={optionIndex}
                          className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                            quizStatus === "active"
                              ? "cursor-pointer"
                              : "cursor-not-allowed"
                          } ${getOptionStyling(question, optionIndex)}`}
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={optionIndex}
                            checked={answers[question.id] === optionIndex}
                            onChange={() =>
                              handleAnswerSelect(question.id, optionIndex)
                            }
                            disabled={quizStatus !== "active"}
                            className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                          />
                          <span
                            className={`flex-1 ${
                              isSelected &&
                              (quizStatus === "submitted" ||
                                quizStatus === "time-up")
                                ? isCorrect
                                  ? "font-semibold text-green-700"
                                  : "font-semibold text-red-700"
                                : isCorrect &&
                                    (quizStatus === "expired" ||
                                      quizStatus === "submitted" ||
                                      quizStatus === "time-up")
                                  ? "font-semibold text-green-700"
                                  : isSelected && quizStatus === "active"
                                    ? "font-semibold text-blue-600"
                                    : "text-gray-700"
                            }`}
                          >
                            {option}
                            {/* Add indicators for review modes */}
                            {(quizStatus === "submitted" ||
                              quizStatus === "time-up" ||
                              quizStatus === "expired") &&
                              isCorrect && (
                                <span className="ml-2 text-green-600 font-bold">
                                  ✓
                                </span>
                              )}
                            {(quizStatus === "submitted" ||
                              quizStatus === "time-up") &&
                              isSelected &&
                              !isCorrect && (
                                <span className="ml-2 text-red-600 font-bold">
                                  ✗
                                </span>
                              )}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Submit Button - Only show if not already submitted */}
        {shouldShowQuestions() &&
          quizStatus === "active" &&
          !submissionData && (
            <div className="mt-8 bg-white rounded-xl shadow-lg border border-blue-200 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-gray-900 font-semibold">
                    {answeredCount === quiz.numberOfQuestions
                      ? "All questions answered!"
                      : `${quiz.numberOfQuestions - answeredCount} questions remaining`}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Make sure to review your answers before submitting
                  </p>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={answeredCount === 0 || isSubmitting}
                  className="flex items-center gap-2 bg-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg"
                >
                  <Send className="w-5 h-5" />
                  {isSubmitting ? "Submitting..." : "Submit Quiz"}
                </button>
              </div>
            </div>
          )}

        {/* Submission Confirmation */}
        {quizStatus === "submitted" && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-green-800 mb-2">
                Quiz Submitted Successfully!
              </h3>
              <p className="text-green-700 mb-4">
                Your answers have been recorded. Results are shown above.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white rounded-lg p-3">
                  <p className="text-gray-600">Questions Answered</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {answeredCount}/{quiz.numberOfQuestions}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-gray-600">Score</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {totalMarks}/{quiz.totalMarks}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-gray-600">Percentage</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {Math.round((totalMarks / quiz.totalMarks) * 100)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuizSubmission
