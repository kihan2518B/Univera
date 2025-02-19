"use client"
import React, { useContext } from "react"
import {
  ProfileBanner,
  ExploreGrid
} from "@/app/(module)/(faculty)/_components/DashboardComponents"
import ProfileCompletion from "@/app/(module)/(faculty)/_components/ProfileCompletion"
import { UserContext } from "@/context/user"
import { DashboardSkeleton } from "@/components/(commnon)/Skeleton"
import { FiEdit, FiBell, FiArrowRight } from "react-icons/fi"

const App = () => {
  const { user } = useContext(UserContext)
  if (!user) return <DashboardSkeleton />

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Section */}
          <div className="lg:col-span-8 space-y-6">
            <ProfileBanner user={user} />
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Explore
              </h3>
              <ExploreGrid />
            </div>
          </div>

          {/* Right Section */}
          <div className="lg:col-span-4 space-y-6">
            {/* Profile Completion */}
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Profile Completion
              </h3>
              <ProfileCompletion completionPercentage={75} />
              <button className="mt-5 flex items-center justify-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
                <FiEdit className="text-sm" /> Edit
              </button>
            </div>

            {/* Announcements */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Announcements
                </h3>
                <button className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700">
                  See all <FiArrowRight className="text-sm" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg shadow-sm flex items-start gap-3">
                  <FiBell className="text-blue-500 text-sm mt-1" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Prelim Payment
                    </h4>
                    <p className="text-xs text-gray-600">
                      Complete before deadline.
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg shadow-sm flex items-start gap-3">
                  <FiBell className="text-yellow-500 text-sm mt-1" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Exam Schedule
                    </h4>
                    <p className="text-xs text-gray-600">
                      Check dates & prepare.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Concern Person */}
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Concern Person
              </h3>
              <div className="flex flex-col items-center">
                <img
                  src="/api/placeholder/100/100"
                  alt="Concern Person"
                  className="w-12 h-12 rounded-full object-cover border border-gray-300"
                />
                <div className="mt-2">
                  <h4 className="text-sm font-medium text-gray-900">
                    Ritaben Meme
                  </h4>
                  <p className="text-xs text-gray-600">Assistant</p>
                  <p className="text-xs text-gray-600">example@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
