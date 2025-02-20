import React, { useState } from "react"
import { MoreVertical, NotepadText, Search, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Prisma } from "@prisma/client"
import { CoursesSkeleton } from "@/components/(commnon)/Skeleton"
import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
import { FilePlus } from "lucide-react"
import { Input } from "@/components/ui/input"
import Table from "@/app/(module)/list/_components/Table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

type AssignmentTableProps = {
  data: {
    faculties: any
    assignments: Prisma.AssignmentGetPayload<{
      include: { faculty: true; subject: true }
    }>[]
  }
  roles: number[]
  classId: string
  subjectId: string
  isLoading: boolean
  isError: boolean
  userId: string
  refetch: () => void
  deleteAssignment: (id: string) => Promise<void>
}

const columns = [
  {
    header: "Sr. No.",
    accessor: "id"
  },
  {
    header: "Title",
    accessor: "title"
  },
  {
    header: "Author",
    accessor: "AuthorName"
  },
  {
    header: "Type",
    accessor: "assignmentType"
  },
  {
    header: "Tags",
    accessor: "tag"
  },
  {
    header: "Due Date",
    accessor: "deadline"
  },
  {
    header: "Start Date",
    accessor: "startDate"
  }
]

export const getTagColor = (tag: string) => {
  // Create a consistent color mapping based on the tag string
  const colors = [
    { bg: "bg-blue-50", text: "text-blue-700" },
    { bg: "bg-purple-50", text: "text-purple-700" },
    { bg: "bg-pink-50", text: "text-pink-700" },
    { bg: "bg-indigo-50", text: "text-indigo-700" },
    { bg: "bg-teal-50", text: "text-teal-700" },
    { bg: "bg-emerald-50", text: "text-emerald-700" },
    { bg: "bg-cyan-50", text: "text-cyan-700" },
    { bg: "bg-violet-50", text: "text-violet-700" }
  ]

  // Use string hash to consistently map tags to colors
  const hashCode = tag.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0)

  const index = Math.abs(hashCode) % colors.length
  return colors[index]
}

export const getDeadlineStatus = (deadline: string) => {
  const today = new Date()
  const deadlineDate = new Date(deadline)
  const daysUntilDeadline = Math.ceil(
    (deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (daysUntilDeadline < 0) {
    return {
      status: "expired",
      className: "bg-red-50 text-red-700 font-medium"
    }
  } else if (daysUntilDeadline <= 1) {
    return {
      status: "urgent",
      className: "bg-orange-50 text-orange-700 font-medium animate-pulse"
    }
  } else if (daysUntilDeadline <= 3) {
    return {
      status: "approaching",
      className: "bg-yellow-50 text-yellow-700 font-medium"
    }
  } else if (daysUntilDeadline <= 7) {
    return {
      status: "upcoming",
      className: "bg-blue-50 text-blue-700 font-medium"
    }
  }
  return {
    status: "normal",
    className: "bg-green-50 text-green-700 font-medium"
  }
}

const formatDeadline = (deadline: string) => {
  const date = new Date(deadline)
  return {
    date: date.getDate().toString().padStart(2, "0"),
    month: (date.getMonth() + 1).toString().padStart(2, "0"),
    year: date.getFullYear()
  }
}

export const AssignmentTableComponent = ({
  data,
  roles,
  classId,
  subjectId,
  deleteAssignment,
  isError,
  isLoading,
  userId
}: AssignmentTableProps) => {
  const [searchTerm, setSearchTerm] = useState("")
  if (isError) return <>Error while fetching data</>
  const renderRow = (
    item: Prisma.AssignmentGetPayload<{
      include: { faculty: true; subject: true }
    }>,
    index: number
  ) => {
    const deadlineInfo = getDeadlineStatus(item.deadline)
    const formattedDate = formatDeadline(item.deadline)
    const canCreateAssignment = data.faculties
      ?.map((f: any) => f.id)
      .includes(userId)

    return (
      <tr
        key={item.id}
        className="text-sm hover:bg-lamaSkyLight transition-colors duration-150"
      >
        {/* Keep all existing cells the same until the last cell */}
        <td className="px-4 py-3">{index + 1}</td>
        <td className="px-4 py-3">
          <span className="font-medium text-TextTwo">{item.title}</span>
        </td>
        <td className="px-4 py-3">{item.AuthorName}</td>
        <td className="px-4 py-3">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-lamaPurpleLight text-ColorThree">
            {item.assignmentType}
          </span>
        </td>
        <td className="px-4 py-3">
          <div className="flex flex-wrap gap-1">
            {item.tag.map((tag, index) => {
              const tagColor = getTagColor(tag)
              return (
                <span
                  key={index}
                  className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium transition-colors",
                    tagColor.bg,
                    tagColor.text
                  )}
                >
                  {tag}
                </span>
              )
            })}
          </div>
        </td>
        <td className="px-4 py-3">
          <div
            className={cn(
              "px-3 py-1 rounded-full text-sm inline-flex items-center justify-center transition-colors",
              deadlineInfo.className
            )}
          >
            {formattedDate.date}/{formattedDate.month}/{formattedDate.year}
          </div>
        </td>
        <td className="px-4 py-3">
          {new Date(item.startDate).getDate()}/
          {new Date(item.deadline).getMonth() + 1}/
          {new Date(item.deadline).getFullYear()}
        </td>
        {canCreateAssignment ? (
          <td className="px-4 py-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-150">
                <MoreVertical size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuItem
                  className="cursor-pointer border-b border-gray-100 focus:bg-gray-100 rounded-sm shadow-sm"
                  onClick={() => {
                    window.location.href = `/classes/my-class/${classId}/assignments/${subjectId}/${item.id}/submissions`
                  }}
                >
                  <NotepadText />
                  View Submissions
                </DropdownMenuItem>
                {roles.includes(4) && (
                  <DropdownMenuItem
                    className="cursor-pointer shadow-sm text-red-500 focus:text-red-500 focus:bg-red-50border-b border-gray-100 focus:bg-gray-100 rounded-sm"
                    onClick={() => deleteAssignment(String(item.id))}
                  >
                    <Trash2 /> Delete Assignment
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </td>
        ) : (
          <td className="px-4 py-3">-</td>
        )}
      </tr>
    )
  }

  if (isLoading || !data) {
    return <CoursesSkeleton />
  }

  const filteredData = data.assignments?.filter((item: any) => {
    const searchString = searchTerm.toLowerCase()
    return (
      item.title?.toLowerCase().includes(searchString) ||
      item.AuthorName?.toLowerCase().includes(searchString) ||
      item.assignmentType?.toLowerCase().includes(searchString) ||
      item.tag?.some((tag: string) => tag.toLowerCase().includes(searchString))
    )
  })

  const canCreateAssignment = data.faculties
    ?.map((f: any) => f.id)
    .includes(userId)
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-TextTwo">Assignments</h1>
        {canCreateAssignment && (
          <ButtonV1
            className="flex items-center gap-2 bg-ColorThree hover:bg-ColorTwo text-white font-medium rounded-lg px-4 py-2 transition-colors duration-200"
            href={`/classes/my-class/${classId}/assignments/${subjectId}/create`}
            icon={FilePlus}
            label="Create new assignment"
          />
        )}
      </div>
      <div className="relative w-full max-w-sm">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <Input
          type="text"
          placeholder="Search assignments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full"
        />
      </div>

      <div className="rounded-lg border border-gray-100 overflow-hidden">
        <Table
          columns={columns}
          renderRow={(item, index) => renderRow(item, Number(index))}
          data={filteredData || []}
        />
      </div>
    </div>
  )
}
