"use client"
import Link from "next/link"
import Left from "@/components/Icons/Left"
import { AuthorityForm } from "../_components/AuthorityForm"

export default function SubjectsPage() {
  return (
    <section className="mt-8 mx-auto flex flex-col">
      <Link
        className="flex justify-center w-32 gap-2 border-2 border-black font-semibold rounded-lg px-6 py-2"
        href={"/list/authorities"}
      >
        <Left />
        Back
      </Link>
      <div className="h-full  flex flex-col items-center justify-center">
        <div className="h-full w-full flex flex-col gap-2">
          <AuthorityForm data={null} />
        </div>
      </div>
    </section>
  )
}
