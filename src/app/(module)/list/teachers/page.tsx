"use client"
/* eslint-disable @typescript-eslint/no-unused-vars */

import Image from "next/image"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useContext, useState } from "react"
import { UserContext } from "@/context/user"
import toast from "react-hot-toast"
import { RotateCcw, Search, Filter, Users, Eye, Trash2 } from "lucide-react"

type Teacher = {
  id: number
  name: string
  email?: string
  subjects: string[]
  course: string[]
}

const fetchDepartment = async (dId: number) => {
  const department = await axios.get("/api/list/teacher", {
    params: {
      departmentId: dId
    }
  })
  return department.data.faculties
}

const TeacherListPage = () => {
  const { user } = useContext(UserContext)
  const userRoles = user?.roles?.map((r: any) => r.id) || []
  const isAddAllowed =
    userRoles.includes(3) ||
    userRoles.includes(10) ||
    userRoles.includes(11) ||
    userRoles.includes(12)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["department"],
    queryFn: () => fetchDepartment(Number(user?.departmentId)),
    enabled: !!user?.departmentId
  })

  // Filter logic for search input
  const filteredData = data?.filter(
    (user: any) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Apply pagination after filtering
  const startIdx = (currentPage - 1) * itemsPerPage
  const endIdx = startIdx + itemsPerPage
  const paginatedData = filteredData?.slice(startIdx, endIdx)
  const totalPages = Math.ceil((filteredData?.length || 0) / itemsPerPage)

  const deleteFaculty = async (id: string) => {
    try {
      const res = await axios.delete(`/api/list/teacher/${id}`)
      toast.success(res.data.message)
      refetch()
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-500">
        <p>Failed to load teachers. Please try again later.</p>
        <p className="text-sm text-gray-500">
          {error?.message || "An unexpected error occurred."}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <RotateCcw className="w-4 h-4" />
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="bg-indigo-600 rounded-2xl p-4 flex items-center justify-center">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Faculty</h1>
            <p className="text-gray-600 mb-4">
              Manage and view all teachers in your department
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">
                {filteredData?.length || 0} teachers found
              </span>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700">Filters</span>
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  TEACHER INFORMATION
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedData && paginatedData.length > 0 ? (
                paginatedData.map((item: Teacher) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <h3 className="text-base font-semibold text-gray-900">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500">{item?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/list/teachers/${item.id}`}>
                          <button className="p-2 rounded-lg bg-indigo-100 hover:bg-indigo-200 transition-colors">
                            <Eye className="w-5 h-5 text-indigo-600" />
                          </button>
                        </Link>
                        <button
                          onClick={() => deleteFaculty(String(item.id))}
                          className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
                        >
                          <Trash2 className="w-5 h-5 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={2}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No teachers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {startIdx + 1} to{" "}
              {Math.min(endIdx, filteredData?.length || 0)} of{" "}
              {filteredData?.length || 0} results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg border ${
                  currentPage === 1
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === page
                          ? "bg-indigo-600 text-white"
                          : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg border ${
                  currentPage === totalPages
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Teacher Button - Conditional */}
      {isAddAllowed && (
        <Link href={`/list/teachers/create`}>
          <button className="fixed bottom-8 right-8 px-6 py-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all hover:shadow-xl">
            + Add Teacher
          </button>
        </Link>
      )}
    </div>
  )
}

export default TeacherListPage
