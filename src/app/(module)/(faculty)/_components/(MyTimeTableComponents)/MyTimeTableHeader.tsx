import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import React from "react"

const MyTimeTableHeader = () => {
  return (
    <>
      <div className="mb-1 px-2 py-1 rounded w-fit border border-Dark">
        <Link href={"/dashboard"} className="flex items-center text-TextTwo ">
          <ArrowLeft size={18} className="mr-2" />
          Back
        </Link>
      </div>
      <div className="text-center mb-2">
        <div className="relative inline-block">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-2 bg-gradient-to-r from-Dark via-ColorThree to-ColorTwo bg-clip-text text-transparent leading-tight">
            Your Timetable
          </h1>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-20 sm:w-28 h-1 rounded-full bg-Primary"></div>
        </div>
      </div>
    </>
  )
}

export default MyTimeTableHeader
