import React from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { BookOpen } from "lucide-react"
import Link from "next/link"
import { Course, Subject } from "@prisma/client"

interface FullCourseData extends Course {
  subjects: Subject[]
}

interface CourseCardProps {
  course: FullCourseData
  isUpdateAllowed: boolean
}

export const Courcecard_c: React.FC<CourseCardProps> = ({
  course,
  isUpdateAllowed
}) => {
  return (
    <Card className="w-full overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
      <div className="relative w-full h-60">
        <Image
          src="/placeholder.avif"
          alt={`${course.name} cover`}
          layout="fill"
          objectFit="cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-800/70 to-gray-900 flex flex-col justify-end p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold truncate text-white">
              {course.name}
            </h3>
          </div>
          <p className="text-sm text-gray-300 mt-1">Code: {course.code}</p>
        </div>
      </div>
      <CardContent className="p-4 bg-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BookOpen className="h-5 w-5 text-gray-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">
              Total Semister
            </span>
          </div>
          <span className="text-2xl font-bold text-gray-800">
            {course.totalSemister}
          </span>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-200 p-4">
        <Link href={`/courses/${course.id}`} className="w-full">
          <Button
            variant="outline"
            className="w-full transition-all duration-300 hover:bg-gray-700 hover:text-white border-gray-400 text-gray-700"
          >
            {isUpdateAllowed ? "Edit" : "View"} Course
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
