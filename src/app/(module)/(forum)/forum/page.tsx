"use client"

import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
import { UserContext } from "@/context/user"
import { useQuery } from "@tanstack/react-query"
import { RotateCcw, BookOpen } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { useContext } from "react"

const fetchSubjects = async (courseId: string) => {
  if (!courseId) {
    console.log("No valid courseId found for userRole")
  }

  const response = await fetch(`/api/subjects?courseId=${courseId}`)
  if (!response.ok) {
    console.log("Failed to fetch the subjects")
  }

  const data = await response.json()
  return data.subjects
}

const CoursesPage: React.FC = () => {
  const router = useRouter()
  const { user } = useContext(UserContext)

  const {
    data: subjects,
    error,
    refetch,
    isLoading
  } = useQuery({
    queryKey: ["subjects", user?.courseId],
    queryFn: () => fetchSubjects(String(user?.courseId)),
    enabled: !!user?.courseId && !!user
  })

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl border border-red-100 p-8 shadow-lg">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                <RotateCcw className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-red-600">
                Something went wrong
              </h3>
              <p className="text-red-500 max-w-md mx-auto">
                Failed to load subjects. Please check your connection and try
                again.
              </p>
              <p className="text-sm text-gray-500">
                {error?.message || "An unexpected error occurred."}
              </p>
              <ButtonV1
                icon={RotateCcw}
                label="Try Again"
                onClick={() => refetch()}
                className="mt-4"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const cardColors = [
    {
      gradient: "from-cyan-400 to-blue-500",
      bg: "lamaSkyLight",
      accent: "ColorOne",
      icon: "ColorOne"
    },
    {
      gradient: "from-purple-400 to-pink-500",
      bg: "lamaPurpleLight",
      accent: "ColorTwo",
      icon: "ColorTwo"
    },
    {
      gradient: "from-indigo-400 to-purple-600",
      bg: "lamaPurpleLight",
      accent: "ColorThree",
      icon: "ColorThree"
    }
  ]

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Subject Forums
              </h1>
              <p className="text-gray-600 text-base sm:text-lg mt-2">
                Explore and engage with your course subjects
              </p>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          {isLoading ? (
            <>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                    <div className="space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      </div>
                      <div className="flex justify-between items-center pt-4">
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : subjects?.length > 0 ? (
            subjects.map((subject: any, index: number) => (
              <SubjectCard
                key={subject.id}
                title={subject.name}
                description={
                  subject.description ||
                  "Explore discussions, resources, and collaborate with your peers in this subject."
                }
                colorTheme={cardColors[index % 3]}
                onClick={() => router.push(`/forum/${subject.id}`)}
                index={index}
              />
            ))
          ) : (
            <div className="col-span-full">
              <div className="bg-white rounded-3xl p-12 text-center shadow-lg border border-gray-100">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  No Subjects Available
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  No subject forums are currently available for your course.
                  Please check back later or contact your administrator.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface CourseCardProps {
  title: string
  description: string
  colorTheme: {
    gradient: string
    bg: string
    accent: string
    icon: string
  }
  onClick?: () => void
  index: number
}

const SubjectCard: React.FC<CourseCardProps> = ({
  title,
  description,
  colorTheme,
  onClick,
  index
}) => {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-2"
      style={{
        animationDelay: `${index * 100}ms`
      }}
    >
      <div
        className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden relative"
        style={{ backgroundColor: colorTheme.bg }}
      >
        {/* Gradient Header */}
        <div className={`h-2 bg-gradient-to-r ${colorTheme.gradient}`}></div>

        {/* Card Content */}
        <div className="p-8 relative">
          {/* Decorative Elements */}
          <div className="absolute top-4 right-4 w-20 h-20 rounded-full opacity-10 bg-gradient-to-br from-current to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full opacity-5 bg-gradient-to-tl from-current to-transparent transform translate-x-8 translate-y-8"></div>

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h3
                  className="text-2xl font-bold mb-3 leading-tight"
                  style={{ color: colorTheme.accent }}
                >
                  {title}
                </h3>
                <p className="text-gray-700 text-base leading-relaxed line-clamp-3">
                  {description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoursesPage
