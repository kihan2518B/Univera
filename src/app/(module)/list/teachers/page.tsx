"use client"
/* eslint-disable @typescript-eslint/no-unused-vars */

import Image from "next/image"
import Link from "next/link"
import TableSearch from "../_components/TableSearch"
import Table from "../_components/Table"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useContext, useState } from "react"
import { UserContext } from "@/context/user"
import DeleteButton from "@/components/(commnon)/DeleteButton"
import toast from "react-hot-toast"
import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
import { RotateCcw } from "lucide-react"
import { CoursesSkeleton } from "@/components/(commnon)/Skeleton"
import PaginationWrapper from "../_components/Pagination"

type Teacher = {
  id: number
  name: string
  email?: string
  subjects: string[]
  course: string[]
}

const columns = [
  {
    header: "Info",
    accessor: "info"
  }
]

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
    return <CoursesSkeleton />
  }

  if (error) {
    return (
      <div className="text-red-500">
        <p>Failed to load courses. Please try again later.</p>
        <p className="text-sm text-gray-500">
          {error?.message || "An unexpected error occurred."}
        </p>
        <ButtonV1 icon={RotateCcw} label="Retry" onClick={() => refetch()} />
      </div>
    )
  }

  const renderRow = (item: Teacher) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        {/* <Image
          src={item.photo}
          alt=""
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        /> */}
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item?.email}</p>
        </div>
      </td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/teachers/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          <DeleteButton
            label={"Delete"}
            onDelete={() => deleteFaculty(String(item.id))}
            className="px-2 py-2"
          />
        </div>
      </td>
    </tr>
  )

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-2 w-full">
        <div className="flex justify-between items-center w-full sm:w-1/2 mb-2 sm:mb-0 mx-2">
          <h1 className="block text-lg font-semibold">All Students</h1>
          {isAddAllowed && (
            <Link href={`/list/teachers/create`}>
              <div className="flex justify-end">
                <button className="flex items-center justify-center rounded-lg bg-Primary p-2">
                  Add Teacher
                </button>
                {/* <FormModal table="teacher" type="create"/> */}
              </div>
            </Link>
          )}
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <div className="flex items-center gap-4 self-end"></div>
        </div>
      </div>
      {/* LIST */}
      {!isLoading ? (
        <>
          <Table columns={columns} renderRow={renderRow} data={paginatedData} />
          <PaginationWrapper
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading teachers...</p>
        </div>
      )}
    </div>
  )
}

export default TeacherListPage
