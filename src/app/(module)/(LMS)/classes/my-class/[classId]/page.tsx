"use client"

import React from "react"
import { useParams, useRouter } from "next/navigation"
import { ExploreGrid } from "@/app/(module)/(faculty)/_components/DashboardComponents"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function Page() {
  const router = useRouter()
  function handleBack() {
    router.push(`/classes`)
  }
  const { classId } = useParams()
  return (
    <div className="min-h-screen">
      <div className=" mx-auto p-2">
        <div className="grid grid-cols-1 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            {/* Explore Section */}
            <div className="">
              <div className="mb-2">
                <Button
                  onClick={handleBack}
                  variant="ghost"
                  className="flex items-center text-TextTwo hover:bg-lamaSkyLight"
                >
                  <ArrowLeft size={18} className="mr-2" />
                  Back
                </Button>
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
