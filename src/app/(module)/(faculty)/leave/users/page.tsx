"use client"
import Link from "next/link"
import Left from "@/components/Icons/Left"
import Container from "../../_components/Container"
import TableWrapper from "../../_components/(UserComponents)/TableWrapper"
import UsersTable from "../../_components/(UserComponents)/UsersTable"
import { useContext } from "react"
import { UserContext } from "@/context/user"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const fetchDepartment = async (dId: number) => {
  const department = await axios.get("/api/list/teacher", {
    params: {
      departmentId: dId
    }
  })
  return department.data.faculties
}
export default function AdminUsersPage() {
  const { user } = useContext(UserContext)

  const {
    data: users,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["users", user?.departmentId],
    queryFn: () => fetchDepartment(Number(user?.departmentId)),
    enabled: !!user?.departmentId
  })
  return (
    <Container>
      <div className="mb-6 ml-4">
        <Link
          className="flex items-center gap-2 border border-gray-300 bg-white text-gray-700 font-semibold rounded-lg px-4 py-2 hover:bg-gray-100 hover:shadow transition duration-200 w-fit"
          href={"/leave"}
        >
          <Left />
          Back
        </Link>
      </div>
      <TableWrapper title="Admin Users">
        <UsersTable isError={isError} isLoading={isLoading} users={users} />
      </TableWrapper>
    </Container>
  )
}
