import React from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, BookOpen } from "lucide-react"
import Link from "next/link"
import { Course, Subject } from "@prisma/client"

interface FullCourseData extends Course {
  subjects: Subject[]
}

interface SubjectCardProps {
  course: FullCourseData
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ course }) => {
  return (
    <Card className="w-full overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
      <CardHeader className="bg-gray-500 text-white p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold truncate">{course.name}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href={`/subject/${course.id}`}>
                <DropdownMenuItem>
                  <Pencil className="h-4 w-4 mr-2" />
                  Add Subject
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-sm text-white/80 mt-1">Code: {course.code}</p>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-sm font-medium">Total Subjects</span>
          </div>
          <span className="text-2xl font-bold text-purple-600">
            {course.subjects.length}
          </span>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 p-4">
        <Link href={`/subject/${course.id}`} className="w-full">
          <Button
            variant="outline"
            className="w-full transition-all duration-300 hover:bg-blue-600 hover:text-white"
          >
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
