"use client"

import Pagination from "../_components/Pagination"
import Image from "next/image"
import Link from "next/link"
import TableSearch from "../_components/TableSearch"
import Table from "../_components/Table"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useContext } from "react"
import { UserContext } from "@/context/user"
import { Role } from "@prisma/client"
import DeleteButton from "@/components/(commnon)/DeleteButton"
import toast from "react-hot-toast"
import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
import { RotateCcw } from "lucide-react"
import { CoursesSkeleton } from "@/components/(commnon)/Skeleton"

type Teacher = {
  id: number
  name: string
  email?: string
  subjects: string[]
  course: string[]
  roles: Role[]
}

const columns = [
  {
    header: "Info",
    accessor: "info"
  }
]

const fetchDepartment = async (dId: number) => {
  const department = await axios.get("/api/list/authorities", {
    params: {
      departmentId: dId
    }
  })
  return department.data.authorities
}

const TeacherListPage = () => {
  const { user } = useContext(UserContext)
  const userRoles = user?.roles.map((r: Role) => r.id)
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["department"],
    queryFn: () => fetchDepartment(Number(user?.departmentId)),
    enabled: !!user?.departmentId
  })

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
  const deleteAuthorityById = async (id: string, roles: Role[]) => {
    try {
      const rolesIds = roles.map((r) => r.id)
      const res = await axios.delete(`/api/list/authorities/${id}`, {
        data: { roleIds: rolesIds }
      })
      if (res.status == 409) {
        toast.error(res.data.message)
      } else if (res.status == 200) {
        toast.success(res.data.message)
      }
      refetch()
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Something went wrong")
      } else {
        toast.error("An unexpected error occurred")
      }
    }
  }

  const renderRow = (item: Teacher) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item?.email}</p>
        </div>
      </td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/authorities/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          <DeleteButton
            label={"Delete"}
            onDelete={() => deleteAuthorityById(String(item.id), item.roles)}
            className="px-2 py-2"
          />
        </div>
      </td>
    </tr>
  )

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          All Authorities
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end"></div>
        </div>
      </div>
      {userRoles && userRoles.includes(3) && (
        <Link href={`/list/authorities/create`}>
          <div className="flex justify-end mt-2">
            <button className="flex items-center justify-center rounded-lg bg-Primary p-2">
              Add Authorities
            </button>
            {/* <FormModal table="teacher" type="create"/> */}
          </div>
        </Link>
      )}
      {/* LIST */}
      {!isLoading && (
        <Table columns={columns} renderRow={renderRow} data={data} />
      )}
      {/* PAGINATION */}
      <Pagination />
    </div>
  )
}

export default TeacherListPage
