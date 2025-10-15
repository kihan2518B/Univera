"use client"
import Left from "@/components/Icons/Left"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useParams } from "next/navigation"
import axios from "axios"
import { AuthorityForm } from "../_components/AuthorityForm"

async function GetUser(userId: string) {
  const { data } = await axios.get(`/api/list/authorities/${userId}`)
  return data.authority
}

export default function EditTeacherPage() {
  const { authorityId } = useParams()

  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: () => GetUser(authorityId as string),
    enabled: !!authorityId
  })
  return (
    <section className="mt-8 mx-auto flex flex-col">
      <div className="mt-8 flex">
        <Link
          className="flex justify-center gap-2 border-2 w-32 border-black font-semibold rounded-lg px-6 py-2"
          href={"/list/authorities"}
        >
          <Left />
          Back
        </Link>
      </div>
      <div className="h-full w-full flex flex-col items-center justify-center">
        <div className="h-full w-full flex flex-col gap-2">
          <AuthorityForm data={data} />
        </div>
      </div>
    </section>
  )
}
