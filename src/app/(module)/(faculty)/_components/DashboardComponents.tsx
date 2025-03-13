import {
  Home,
  FileText,
  Users,
  Calendar,
  BookOpen,
  ClipboardList,
  ScrollText
} from "lucide-react"

import React from "react"
import { type LucideIcon } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { FaBullhorn } from "react-icons/fa"
import { IconType } from "react-icons"

export function ProfileBanner({ user }: { user: any }) {
  const { user: ClerkUser } = useUser()
  if (!user) return null
  return (
    <div className="w-full overflow-hidden mb-6">
      <div className="relative h-40 sm:h-48 md:h-56 lg:h-64 overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl border-2 md:border-4 border-white">
        <div className="absolute inset-0">
          <Image
            height={100}
            width={100}
            src="/dashboard_background.jpg"
            alt="Background Cover"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative h-full flex items-center px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="flex flex-row items-center justify-center space-y-3 space-x-2 sm:space-y-0 sm:space-x-4 md:space-x-6 lg:space-x-8">
            <div className="relative">
              <Image
                width={100}
                height={100}
                src={ClerkUser?.imageUrl ?? "/ladaki.jpg"}
                alt="Profile"
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full border-2 md:border-4 border-white shadow-lg object-cover"
              />
            </div>
            <div className="text-left items-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-Dark">
                {user.name}
              </h2>
              <p className="text-xs sm:text-sm md:text-base font-semibold text-TextTwo">
                {user.faculty?.position ?? "faculty"}
              </p>
              <p className="text-xs sm:text-sm md:text-base text-TextTwo">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ExploreItem({
  icon: Icon,
  title,
  desc,
  link = ""
}: {
  icon: LucideIcon | IconType
  title: string
  desc?: string
  link?: string
}) {
  return (
    <Link href={link}>
      <div className="w-full p-1 sm:p-2">
        <div className="w-full relative group">
          {/* Main Container */}
          <div
            className="relative z-10 flex flex-col items-center py-2 small:py-4 sm:py-5 px-1
              rounded-2xl sm:rounded-3xl border-2
              border-lamaPurple/30 bg-white/90 
              hover:bg-gradient-to-br 
              group-hover:scale-[1.02]"
          >
            <div className="flex flex-col justify-evenly items-center w-[95%] gap-1">
              <div
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl
                text-ColorThree
                flex items-center justify-center
                group transition-all duration-500 ease-in-out
                shadow-md group-hover:shadow-xl"
              >
                {Icon && (
                  <Icon
                    className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8
                     transform group-hover:scale-110 transition-transform duration-500"
                  />
                )}
              </div>
              {/* Title Container */}
              <div className="flex-1">
                <h4
                  className="text-xs sm:text-base md:text-lg font-bold text-TextTwo
                    group-hover:text-ColorThree
                    text-center xs:text-left transition-colors duration-500
                    tracking-tight line-clamp-2"
                >
                  {title}
                </h4>
              </div>
            </div>

            {/* Description */}
            <p
              className="mt-2 text-sm sm:text-base md:text-lg text-gray-600
                text-center xs:text-left leading-relaxed
                group-hover:text-gray-700 transition-colors duration-500
                line-clamp-3 md:line-clamp-none hidden sm:block"
            >
              {desc}
            </p>

            {/* Animated Border Gradient */}
            <div className="absolute bottom-0 left-2 w-[95%] h-[2px] sm:h-[3px] overflow-hidden rounded-b-2xl sm:rounded-b-3xl">
              <div
                className="w-[200%] h-full bg-gradient-to-r from-ColorTwo via-ColorThree to-ColorTwo
                  transform -translate-x-full group-hover:translate-x-0
                  transition-transform duration-700 ease-in-out"
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
const dashboardItems = [
  {
    icon: Home,
    title: "Home",
    desc: "description"
  },
  {
    icon: FileText,
    title: "Leave",
    desc: "description"
  },
  {
    icon: FaBullhorn,
    title: "Announcement",
    desc: "description"
  },
  {
    icon: Users,
    title: "My Team",
    desc: "description"
  },
  {
    icon: BookOpen,
    title: "Courses",
    desc: "description"
  },
  {
    icon: ClipboardList,
    title: "Exam",
    desc: "description"
  },
  {
    icon: Calendar,
    title: "Time-Table",
    desc: "description"
  },
  {
    icon: ScrollText,
    title: "Policies",
    desc: "description"
  }
]

const classPageItems = (classId?: string) => [
  {
    icon: Calendar,
    title: "Timetable",
    link: `/classes/my-class/${classId}/time-table`
  },
  {
    icon: Users,
    title: "Students",
    link: `/classes/my-class/${classId}/students`
  },
  {
    icon: FaBullhorn,
    title: "Announcements",
    link: `/classes/my-class/${classId}/classAnnouncement`
  },
  {
    icon: ClipboardList,
    title: "Quizzes",
    link: `/classes/my-class/${classId}/quizzes`
  },
  {
    icon: BookOpen,
    title: "Syllabus",
    link: `/classes/my-class/${classId}/syllabus`
  },
  {
    icon: FileText,
    title: "Class Notes",
    link: `/classes/my-class/${classId}/class-notes`
  },
  {
    icon: FileText,
    title: "Assignments",
    link: `/classes/my-class/${classId}/assignments`
  }
]

export function ExploreGrid({
  isClassPage,
  classId
}: {
  isClassPage?: boolean
  classId?: string
}) {
  const exploreItems =
    isClassPage && classId ? classPageItems(classId) : dashboardItems

  return (
    <div className="grid grid-cols-2 small:grid-cols-3 gap-2 sm:gap-4">
      {exploreItems.map((item, index) => (
        <ExploreItem
          key={index}
          icon={item.icon}
          title={item.title}
          desc={"desc" in item ? item.desc : undefined}
          link={"link" in item ? item.link : undefined}
        />
      ))}
    </div>
  )
}
