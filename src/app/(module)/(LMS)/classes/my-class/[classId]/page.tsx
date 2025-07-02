"use client"

import React from "react"
import { useParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { ExploreGrid } from "@/app/(module)/(faculty)/dashboard/_components/DashboardComponents"
import Link from "next/link"

export default function Page() {
  const { classId } = useParams()
  return (
    <div className="min-h-screen">
      <div className=" mx-auto p-2">
        <div className="grid grid-cols-1 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            {/* Explore Section */}
            <div>
              <div className="px-2 py-1 rounded w-fit border border-Dark">
                <Link
                  href={`/classes`}
                  className="flex items-center text-TextTwo "
                >
                  <ArrowLeft size={18} className="mr-2" />
                  Back
                </Link>
              </div>
              {/* Header Section */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold text-TextTwo">
                    Explore
                  </h3>
                </div>

                {/* ExploreGrid Component */}
                <div className="relative">
                  {/* Decorative Background Elements */}
                  <div className="absolute inset-0" />

                  {/* Main Grid */}
                  <div className="relative z-10">
                    <ExploreGrid
                      isClassPage={true}
                      classId={Array.isArray(classId) ? classId[0] : classId}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
