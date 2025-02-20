"use client"
import LeavesTable from "./LeavesTable"
import { getAllLeaveDays } from "@/lib/data/getLeaveDays"
import { Leave } from "@prisma/client"
import Container from "../../_components/Container"
import TableWrapper from "../../_components/(UserComponents)/TableWrapper"
import { useContext } from "react"
import { UserContext } from "@/context/user"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import Left from "@/components/Icons/Left"

export default function AdminLeaves() {
  const { user } = useContext(UserContext)

  const {
    data: allLeaves,
    refetch,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["leaves"],
    queryFn: () => getAllLeaveDays(user),
    enabled: !!user
  })

  if (allLeaves === null) {
    return <Container>No Leaves found...</Container>
  }
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
      <TableWrapper title="All Leaves">
        <LeavesTable
          isLoading={isLoading}
          isError={isError}
          refetch={refetch}
          userName={String(user?.name)}
          userId={String(user?.id)}
          leaves={allLeaves as Leave[]}
        />
      </TableWrapper>
    </Container>
  )
}
