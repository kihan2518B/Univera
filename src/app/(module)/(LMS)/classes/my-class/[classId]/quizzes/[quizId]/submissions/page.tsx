"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"
import {
  Trophy,
  Users,
  TrendingUp,
  BookOpen,
  Award,
  Calendar,
  Star,
  Medal,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"
import { QuizResultsSkeleton } from "@/components/(commnon)/Skeleton"

const fetchSubmissionData = async (classId: string, quizId: string) => {
  const response = await axios.get(
    `/api/classes/my-class/${classId}/quizzes/submission?route=all&quizId=${quizId}`
  )
  return response.data || []
}

const QuizSubmissionsPage = () => {
  const { classId, quizId } = useParams()
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1200
  )

  const { data: submissions, isLoading } = useQuery({
    queryKey: ["submissions", classId],
    queryFn: () => fetchSubmissionData(classId as string, quizId as string),
    enabled: !!classId
  })

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener("resize", handleResize)

    // Clean up
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (isLoading) return <QuizResultsSkeleton />

  if (!submissions || submissions.length === 0) {
    return (
      <>
        <div className="px-2 py-1 rounded w-fit border border-Dark ml-3">
          <Link
            href={`/classes/my-class/${classId}/quizzes/${quizId}`}
            className="flex items-center text-TextTwo "
          >
            <ArrowLeft size={18} className="mr-2" />
            Back
          </Link>
        </div>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <BookOpen className="w-24 h-24 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              No Submissions Yet
            </h2>
            <p className="text-gray-500">
              Students have not submitted this quiz yet.
            </p>
          </div>
        </div>
      </>
    )
  }

  // Calculate statistics
  const totalMarks = submissions[0]?.quiz?.totalMarks || 0
  const totalSubmissions = submissions.length
  const averageMarks =
    submissions.reduce((sum: number, sub: any) => sum + sub.marks, 0) /
    totalSubmissions
  const highestMarks = Math.max(...submissions.map((sub: any) => sub.marks))
  const passedStudents = submissions.filter(
    (sub: any) => sub.marks / totalMarks >= 0.5
  ).length
  const passRate = (passedStudents / totalSubmissions) * 100

  // Sort submissions by marks (highest first)
  const sortedSubmissions = [...submissions].sort((a, b) => b.marks - a.marks)

  // Prepare chart data
  const marksDistribution = submissions.reduce(
    (acc: Record<string, number>, sub: any) => {
      const percentage = Math.floor((sub.marks / totalMarks) * 100)

      let category = ""

      if (percentage < 40) {
        category = "(<40%)"
      } else if (percentage < 50) {
        category = "(40-49%)"
      } else if (percentage < 65) {
        category = "(50-64%)"
      } else if (percentage < 80) {
        category = "(65-79%)"
      } else if (percentage < 90) {
        category = "(80-89%)"
      } else {
        category = "(90-100%)"
      }

      acc[category] = (acc[category] || 0) + 1

      return acc
    },
    {}
  )

  const CATEGORY_ORDER = [
    "(90-100%)",
    "(80-89%)",
    "(65-79%)",
    "(50-64%)",
    "(40-49%)",
    "(<40%)"
  ]

  const chartData = Object.entries(marksDistribution)
    .map(([range, count]) => ({
      range,
      count,
      percentage: ((Number(count) / totalSubmissions) * 100).toFixed(1)
    }))
    .sort(
      (a, b) =>
        CATEGORY_ORDER.indexOf(a.range) - CATEGORY_ORDER.indexOf(b.range)
    )

  const pieData = [
    { name: "Passed", value: passedStudents, color: "#34D399" },
    {
      name: "Failed",
      value: totalSubmissions - passedStudents,
      color: "#F87171"
    }
  ]

  const formatSubmissionTime = (timestamp: any) => {
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const getGradeColor = (marks: number, total: number) => {
    const percentage = (marks / total) * 100
    if (percentage >= 90) return "from-green-400 to-emerald-500"
    if (percentage >= 80) return "from-blue-400 to-cyan-500"
    if (percentage >= 70) return "from-yellow-400 to-orange-500"
    if (percentage >= 60) return "from-orange-400 to-red-400"
    return "from-red-400 to-pink-500"
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      submitted:
        "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg shadow-green-200",
      "auto-submitted":
        "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg shadow-orange-200"
    }
    return (
      styles[status] || "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
    )
  }

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-5 h-5 text-yellow-500" />
    if (index === 1) return <Medal className="w-5 h-5 text-gray-400" />
    if (index === 2) return <Award className="w-5 h-5 text-amber-600" />
    return <Star className="w-4 h-4 text-purple-400" />
  }

  return (
    <div className="min-h-screen">
      <div className="px-2 py-1 rounded w-fit border border-Dark ml-3">
        <Link
          href={`/classes/my-class/${classId}/quizzes/${quizId}`}
          className="flex items-center text-TextTwo "
        >
          <ArrowLeft size={18} className="mr-2" />
          Back
        </Link>
      </div>
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-4">
            {submissions[0]?.quiz?.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {submissions[0]?.quiz?.description}
          </p>
        </div>

        {/* Enhanced Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="group relative overflow-hidden bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/30 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Students
                  </p>
                  <p className="text-4xl font-black text-gray-800">
                    {totalSubmissions}
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: "100%" }}
                ></div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/30 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Average
                  </p>
                  <p className="text-4xl font-black text-gray-800">
                    {averageMarks.toFixed(1)}
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${(averageMarks / totalMarks) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/30 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Trophy className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Highest
                  </p>
                  <p className="text-4xl font-black text-gray-800">
                    {highestMarks}
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${(highestMarks / totalMarks) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/30 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Award className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Pass Rate
                  </p>
                  <p className="text-4xl font-black text-gray-800">
                    {passRate.toFixed(0)}%
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${passRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
          {/* Marks Distribution Chart */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 shadow-xl border border-white/30">
            <div className="mb-4">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                Score Distribution
              </h3>
            </div>
            <div className="w-full overflow-hidden">
              <ResponsiveContainer
                width="100%"
                height={
                  windowWidth < 640 ? 280 : windowWidth < 1024 ? 320 : 350
                }
              >
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                  <XAxis
                    dataKey="range"
                    tick={{ fontSize: windowWidth < 640 ? 10 : 12 }}
                    interval={0}
                    angle={windowWidth < 640 ? -45 : -15}
                    textAnchor="end"
                    height={windowWidth < 640 ? 60 : 40}
                    dy={windowWidth < 640 ? 5 : 10}
                  />
                  <YAxis tick={{ fontSize: windowWidth < 640 ? 10 : 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(10px)",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                      fontSize: "14px"
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="url(#gradient1)"
                    radius={[4, 4, 4, 4]}
                  />
                  <defs>
                    <linearGradient id="gradient1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#5B58EB" />
                      <stop offset="100%" stopColor="#BB63FF" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 shadow-xl border border-white/30">
            <div className="mb-4">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                Pass/Fail Ratio
              </h3>
            </div>
            <div className="w-full flex flex-col items-center">
              <ResponsiveContainer
                width="80%"
                height={
                  windowWidth < 640 ? 220 : windowWidth < 1024 ? 260 : 280
                }
              >
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={
                      windowWidth < 640 ? 40 : windowWidth < 1024 ? 55 : 70
                    }
                    outerRadius={
                      windowWidth < 640 ? 80 : windowWidth < 1024 ? 105 : 130
                    }
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(10px)",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                      fontSize: "14px"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-6 lg:space-x-8 mt-4 sm:mt-6">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full"></div>
                  <span className="text-sm sm:text-base text-gray-700 font-medium">
                    Passed ({passedStudents})
                  </span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-400 rounded-full"></div>
                  <span className="text-sm sm:text-base text-gray-700 font-medium">
                    Failed ({totalSubmissions - passedStudents})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Student Submissions */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-white/30 overflow-hidden">
          <div className="p-4 border-b border-white/30 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-800">
                  Student Rankings
                </h3>
                <p className="text-gray-600 mt-1">
                  Sorted by performance score
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-white/30">
            {sortedSubmissions.map((submission, index) => (
              <div
                key={submission.id}
                className="group p-8 hover:bg-white/50 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getGradeColor(submission.marks, totalMarks)} flex items-center justify-center text-white font-bold text-xl shadow-xl`}
                      >
                        #{index + 1}
                      </div>
                      <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-lg">
                        {getRankIcon(index)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h4 className="font-bold text-gray-800 text-xl">
                            {submission.student.user.name}
                          </h4>
                          <p className="text-gray-600 font-medium">
                            Roll: {submission.student.rollNo} • PRN:{" "}
                            {submission.student.prn}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-8">
                    <div className="text-center bg-white/50 rounded-2xl p-4 min-w-[120px]">
                      <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
                        Score
                      </p>
                      <p className="text-3xl font-black text-gray-800">
                        {submission.marks}
                      </p>
                      <p className="text-sm text-gray-500 font-medium">
                        {((submission.marks / totalMarks) * 100).toFixed(1)}%
                      </p>
                    </div>

                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                        Status
                      </p>
                      <span
                        className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold ${getStatusBadge(submission.status)}`}
                      >
                        {submission.status.replace("-", " ").toUpperCase()}
                      </span>
                    </div>

                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                        Submitted
                      </p>
                      <div className="flex items-center justify-center text-sm text-gray-700 bg-gray-50 rounded-xl px-3 py-2">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatSubmissionTime(submission.student.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Progress Bar */}
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      Progress
                    </span>
                    <span className="text-sm font-bold text-gray-800">
                      {submission.marks}/{totalMarks}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-3 bg-gradient-to-r ${getGradeColor(submission.marks, totalMarks)} rounded-full transition-all duration-1000 ease-out relative`}
                      style={{
                        width: `${(submission.marks / totalMarks) * 100}%`
                      }}
                    >
                      <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizSubmissionsPage
