"use client"

import Link from "next/link"
import TableSearch from "../_components/TableSearch"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useContext, useState } from "react"
import { UserContext } from "@/context/user"
import DeleteButton from "@/components/(commnon)/DeleteButton"
import toast from "react-hot-toast"
import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
import { RotateCcw, Users, Plus, Eye, Filter } from "lucide-react"
import { CoursesSkeleton } from "@/components/(commnon)/Skeleton"
import { Prisma } from "@prisma/client"
import PaginationWrapper from "../_components/Pagination"

const fetchStudents = async (cId: number) => {
  const course = await axios.get("/api/list/student", {
    params: {
      courseId: cId
    }
  })
  return course.data.students
}

const StudentListPage = () => {
  const { user } = useContext(UserContext)
  const roles = user?.roles.map((r: any) => r.id)
  const [isDeleting, setIsDeleting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["course"],
    queryFn: () => fetchStudents(user?.courseId as number),
    enabled: !!user?.course?.id
  })

  // Filter logic for search input
  const filteredData = data?.filter(
    (student: StudentWithRelations) =>
      student.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Apply pagination after filtering
  const startIdx = (currentPage - 1) * itemsPerPage
  const endIdx = startIdx + itemsPerPage
  const paginatedData = filteredData?.slice(startIdx, endIdx)
  const totalPages = Math.ceil((filteredData?.length || 0) / itemsPerPage)

  const deleteStudent = async (id: string) => {
    setIsDeleting(true)
    try {
      const res = await axios.delete(`/api/list/student/${id}`)
      if (res.status == 200) {
        toast.success(res.data.message)
        refetch()
      } else {
        toast.error(res.data.message)
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Something went wrong")
      } else {
        toast.error("An unexpected error occurred")
      }
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <CoursesSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <RotateCcw className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-red-600 mb-2">
            Failed to load student data. Please try again.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            {error?.message || "An unexpected error occurred."}
          </p>
          <ButtonV1
            icon={RotateCcw}
            label="Retry"
            onClick={() => refetch()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors"
          />
        </div>
      </div>
    )
  }

  type StudentWithRelations = Prisma.StudentGetPayload<{
    include: {
      user: true
    }
  }>

  const renderRow = (item: StudentWithRelations) => (
    <tr
      key={item.id}
      className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
    >
      <td className="px-6 py-5">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg">
            {item.user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold text-gray-900 text-base">
              {item.user.name}
            </h3>
            <p className="text-sm text-gray-600">{item?.user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center space-x-3">
          <Link href={`/list/students/${item.id}`}>
            <button className="group relative w-10 h-10 flex items-center justify-center rounded-lg bg-blue-500 hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg">
              <Eye className="w-5 h-5 text-white" />
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </button>
          </Link>
          {roles && (roles.includes(11) || roles.includes(5)) && (
            <DeleteButton
              label={"Delete"}
              isDeleting={isDeleting}
              onDelete={() => deleteStudent(String(item.id))}
              className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            />
          )}
        </div>
      </td>
    </tr>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-6 lg:space-y-0">
            {/* Title Section */}
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Students</h1>
                <p className="text-gray-600 mt-1">
                  Manage and view all students in your course
                </p>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  {filteredData?.length || 0} students found
                </div>
              </div>
            </div>

            {/* Add Student Button */}
            {roles && (roles.includes(11) || roles.includes(5)) && (
              <Link href={`/list/students/create`}>
                <button className="group flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                  <span>Add New Student</span>
                </button>
              </Link>
            )}
          </div>

          {/* Search and Filter Section */}
          <div className="mt-8 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative flex-1 max-w-md">
              <TableSearch
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            </div>
            <button className="flex items-center space-x-2 px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="text-gray-600 font-medium">Filters</span>
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {!isLoading ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                    <tr>
                      <th className="px-6 py-5 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                        Student Information
                      </th>
                      <th className="px-6 py-5 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedData?.map((item: any) => renderRow(item))}
                  </tbody>
                </table>
              </div>

              {filteredData && filteredData.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No students found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your search criteria or add new students.
                  </p>
                </div>
              )}

              {/* Pagination */}
              <div className="px-6 py-5 border-t border-gray-100 bg-gray-50">
                <PaginationWrapper
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-600 font-medium">Loading students...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentListPage
