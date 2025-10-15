import {
  FileText,
  Users,
  Calendar,
  BookOpen,
  ClipboardList,
  ScrollText,
  UserCircle,
  MessagesSquare,
  Notebook,
  Pencil,
  Star,
  Sparkles,
  ArrowRight
} from "lucide-react"

import React from "react"
import { type LucideIcon } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { FaBullhorn } from "react-icons/fa"
import { IconType } from "react-icons"

export function ProfileBanner({
  user,
  isStudent
}: {
  user: any
  isStudent: boolean
}) {
  const { user: ClerkUser } = useUser()

  if (!user) return null

  return (
    <div className="w-full mb-8">
      <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden rounded-3xl border border-white/20 shadow-2xl">
        {/* Background with Overlay */}
        <div className="absolute inset-0">
          <Image
            height={400}
            width={800}
            src="/dashboard_background.jpg"
            alt="Background Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-6 right-6 opacity-30">
          <Sparkles className="w-8 h-8 text-white animate-pulse" />
        </div>
        <div className="absolute top-12 right-20 opacity-20">
          <Star
            className="w-6 h-6 text-white animate-bounce"
            style={{ animationDelay: "1s" }}
          />
        </div>

        {/* Content */}
        <div className="relative h-full flex items-end px-6 sm:px-8 md:px-10 lg:px-12 pb-8">
          <div className="flex flex-row items-center space-x-6 sm:space-x-8">
            {/* Profile Image with Glow Effect */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-500"></div>
              <Image
                width={120}
                height={120}
                src={ClerkUser?.imageUrl ?? "/ladaki.jpg"}
                alt="Profile"
                className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full border-4 border-white shadow-2xl object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>

            {/* User Info */}
            <div className="text-left">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">
                  {user.name}
                </h2>
                <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                  <span className="text-xs font-semibold text-white">
                    {isStudent ? "STUDENT" : "FACULTY"}
                  </span>
                </div>
              </div>
              <p className="text-sm sm:text-base md:text-lg font-semibold text-blue-200 mb-1">
                {isStudent
                  ? "Student"
                  : (user.faculty?.position ?? "Faculty Member")}
              </p>
              <p className="text-xs sm:text-sm md:text-base text-white/80">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom gradient border */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      </div>
    </div>
  )
}

function ExploreItem({
  icon: Icon,
  title,
  desc,
  link = "",
  index = 0
}: {
  icon: LucideIcon | IconType
  title: string
  desc?: string
  link?: string
  index?: number
}) {
  const gradientClasses = [
    "from-blue-500 to-blue-600",
    "from-purple-500 to-purple-600",
    "from-green-500 to-green-600",
    "from-orange-500 to-orange-600",
    "from-pink-500 to-pink-600",
    "from-indigo-500 to-indigo-600",
    "from-teal-500 to-teal-600",
    "from-red-500 to-red-600"
  ]

  const gradientClass = gradientClasses[index % gradientClasses.length]

  return (
    <Link href={link}>
      <div className="group relative">
        {/* Hover background glow */}
        <div
          className={`absolute -inset-0.5 bg-gradient-to-r ${gradientClass} rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-500`}
        ></div>

        {/* Main card */}
        <div className="relative bg-white rounded-2xl border border-gray-100 shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2 overflow-hidden">
          {/* Icon section */}
          <div className="p-6 pb-4">
            <div
              className={`w-14 h-14 rounded-xl bg-gradient-to-r ${gradientClass} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}
            >
              {Icon && <Icon className="w-7 h-7 text-white" />}
            </div>
          </div>

          {/* Content section */}
          <div className="px-6 pb-6">
            <h4 className="text-lg font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-300 mb-2">
              {title}
            </h4>
            {desc && (
              <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300 line-clamp-2">
                {desc}
              </p>
            )}
          </div>

          {/* Arrow indicator */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 translate-x-2">
            <ArrowRight className="w-5 h-5 text-white" />
          </div>

          {/* Bottom accent line */}
          <div
            className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradientClass} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
          ></div>
        </div>
      </div>
    </Link>
  )
}

const facultyDashboardItems = [
  {
    icon: FileText,
    title: "Leave Management",
    desc: "Submit and track your leave applications with ease",
    link: `/leave`
  },
  {
    icon: FaBullhorn,
    title: "Announcements",
    desc: "Create and manage important announcements for students",
    link: `/announcements`
  },
  {
    icon: Users,
    title: "My Team",
    desc: "Collaborate with colleagues and manage team activities",
    link: `/myTeam`
  },
  {
    icon: BookOpen,
    title: "Courses",
    desc: "Manage your courses, curriculum, and teaching materials",
    link: `/courses`
  },
  {
    icon: ClipboardList,
    title: "Examinations",
    desc: "Create, schedule, and evaluate student examinations"
  },
  {
    icon: Calendar,
    title: "Time Table",
    desc: "View and manage your teaching schedule",
    link: `/dashboard/time-table`
  },
  {
    icon: ScrollText,
    title: "Policies",
    desc: "Access institutional policies and guidelines",
    link: `/policy`
  }
]

const studentDashboardItems = (classId?: string) => [
  {
    icon: Calendar,
    title: "Time Table",
    desc: "View your class schedule and important dates",
    link: `/classes/my-class/${classId}/time-table`
  },
  {
    icon: FileText,
    title: "Attendance",
    desc: "Track your attendance records and statistics",
    link: "/attendance"
  },
  {
    icon: Notebook,
    title: "Class Notes",
    desc: "Access and organize your study materials"
  },
  {
    icon: Pencil,
    title: "Assignments",
    desc: "Submit assignments and track your progress",
    link: `/classes/my-class/${classId}/assignments`
  },
  {
    icon: FaBullhorn,
    title: "Quizzes",
    desc: "Take quizzes and view your performance",
    link: `/classes/my-class/${classId}/quizzes`
  },
  {
    icon: MessagesSquare,
    title: "Forums",
    desc: "Engage in discussions with peers and faculty",
    link: `/forum`
  },
  {
    icon: ScrollText,
    title: "Syllabus",
    desc: "Access course syllabus and learning outcomes",
    link: `/classes/my-class/${classId}/syllabus`
  },
  {
    icon: FaBullhorn,
    title: "Announcements",
    desc: "Stay updated with important announcements",
    link: `/announcements`
  },
  {
    icon: UserCircle,
    title: "Mentor",
    desc: "Connect with your academic mentor"
  },
  {
    icon: ClipboardList,
    title: "Examinations",
    desc: "View exam schedules and results"
  },
  {
    icon: BookOpen,
    title: "Results",
    desc: "Check your academic performance and grades"
  }
]

const classPageItems = (classId?: string) => [
  {
    icon: Calendar,
    title: "Timetable",
    desc: "Class schedules and timing",
    link: `/classes/my-class/${classId}/time-table`
  },
  {
    icon: Users,
    title: "Students",
    desc: "Manage class students",
    link: `/classes/my-class/${classId}/students`
  },
  {
    icon: FaBullhorn,
    title: "Announcements",
    desc: "Class-specific announcements",
    link: `/classes/my-class/${classId}/classAnnouncement`
  },
  {
    icon: ClipboardList,
    title: "Quizzes",
    desc: "Create and manage quizzes",
    link: `/classes/my-class/${classId}/quizzes`
  },
  {
    icon: BookOpen,
    title: "Syllabus",
    desc: "Course curriculum and syllabus",
    link: `/classes/my-class/${classId}/syllabus`
  },
  {
    icon: FileText,
    title: "Class Notes",
    desc: "Share and manage class notes",
    link: `/classes/my-class/${classId}/class-notes`
  },
  {
    icon: FileText,
    title: "Assignments",
    desc: "Create and track assignments",
    link: `/classes/my-class/${classId}/assignments`
  }
]

export function ExploreGrid({
  isClassPage,
  classId,
  isStudent
}: {
  isClassPage?: boolean
  classId?: string
  isStudent?: boolean
}) {
  const exploreItems =
    isClassPage && classId
      ? classPageItems(classId)
      : isStudent
        ? studentDashboardItems(classId)
        : facultyDashboardItems

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {isClassPage
            ? "Class Management"
            : isStudent
              ? "Student Dashboard"
              : "Faculty Dashboard"}
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {isClassPage
            ? "Manage your class activities and resources efficiently"
            : isStudent
              ? "Access all your academic resources and tools in one place"
              : "Streamline your teaching and administrative tasks"}
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {exploreItems.map((item, index) => (
          <ExploreItem
            key={index}
            icon={item.icon}
            title={item.title}
            desc={"desc" in item ? item.desc : undefined}
            link={"link" in item ? item.link : undefined}
            index={index}
          />
        ))}
      </div>
    </div>
  )
}
