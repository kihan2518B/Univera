import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css" // Import default styles
import { Card, CardContent, CardFooter } from "../ui/card"

export const CoursesSkeleton = () => {
  return (
    <div className="space-y-4">
      <Skeleton height={40} count={1} width="30%" /> {/* Heading skeleton */}
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} height={30} count={1} />
        ))}
      </div>
    </div>
  )
}

export const CourseFormSkeleton = () => {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="space-y-4">
        <Skeleton height={40} width="60%" />
        <Skeleton height={20} width="40%" />
      </div>

      <div className="space-y-4">
        <Skeleton height={40} width="50%" />
        <Skeleton height={20} width="30%" />
      </div>

      <div className="space-y-4">
        <Skeleton height={40} width="40%" />
        <Skeleton height={20} width="30%" />
      </div>

      <div className="flex items-center gap-x-4">
        <Skeleton height={45} width={120} />
        <Skeleton height={45} width={120} />
        <Skeleton height={45} width={120} />
      </div>
    </div>
  )
}

export const ClassesCardSkeleton = () => {
  return (
    <Card className="h-full">
      <div className="relative w-full aspect-video">
        <Skeleton className="h-full w-full rounded-t-lg" />
        <div className="absolute top-2 right-2">
          <Skeleton className="h-5 w-16" />
        </div>
      </div>

      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <div className="flex items-center gap-x-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-28" />
      </CardFooter>
    </Card>
  )
}

export const ClassDetailsSkeleton = () => {
  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <Card className="w-full bg-white shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Image Skeleton */}
            <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden">
              <Skeleton height="100%" containerClassName="w-full h-full" />
            </div>

            {/* Info Skeleton */}
            <div className="flex-grow space-y-2 w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                <div className="w-full md:w-2/3">
                  <Skeleton width="80%" height={32} /> {/* Class name */}
                  <div className="flex gap-2 mt-2">
                    <Skeleton width={120} height={24} /> {/* Semester badge */}
                    <Skeleton width={100} height={24} /> {/* Code badge */}
                  </div>
                </div>
                <div className="w-24 h-10">
                  <Skeleton height="100%" /> {/* Edit button */}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

import React from "react"
import { Clock, Paperclip, User } from "lucide-react"

export const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            {/* Profile Banner Skeleton */}
            <div className="w-full h-64 bg-gray-200 rounded-xl overflow-hidden">
              <div className="h-full flex items-end p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-32 h-32 rounded-full bg-gray-300" />
                  <div className="space-y-2">
                    <div className="h-8 w-48 bg-gray-300 rounded" />
                    <div className="h-4 w-36 bg-gray-300 rounded" />
                    <div className="h-4 w-40 bg-gray-300 rounded" />
                  </div>
                </div>
              </div>
            </div>

            {/* Explore Section Skeleton */}
            <div className="bg-gray-200 rounded-xl p-6">
              <div className="h-6 w-32 bg-gray-300 rounded mb-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-xl p-6">
                    <div className="flex gap-3 items-center mb-3">
                      <div className="w-7 h-7 bg-gray-300 rounded-xl" />
                      <div className="h-5 w-24 bg-gray-300 rounded" />
                    </div>
                    <div className="h-4 w-full bg-gray-300 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            {/* Profile Completion Skeleton */}
            <div className="bg-white rounded-xl p-6">
              <div className="flex flex-col items-center">
                <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
                <div className="w-24 h-24 rounded-full bg-gray-200 mb-4" />
                <div className="h-8 w-24 bg-gray-200 rounded" />
              </div>
            </div>

            {/* Announcements Skeleton */}
            <div className="bg-white rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="h-6 w-32 bg-gray-200 rounded" />
                <div className="h-4 w-16 bg-gray-200 rounded" />
              </div>
              {[...Array(2)].map((_, i) => (
                <div key={i} className="p-4 bg-gray-100 rounded-lg mb-4">
                  <div className="h-5 w-36 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-full bg-gray-200 rounded" />
                </div>
              ))}
            </div>

            {/* Concern Person Skeleton */}
            <div className="bg-white rounded-xl p-6">
              <div className="h-6 w-36 bg-gray-200 rounded mb-4" />
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gray-200" />
                <div className="space-y-2">
                  <div className="h-5 w-32 bg-gray-200 rounded" />
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                  <div className="h-4 w-40 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const AnnouncementFormSkeleton = () => {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
        {/* Title Skeleton */}
        <Skeleton className="h-8 w-1/2 mx-auto mb-6" />

        <form className="space-y-6">
          {/* Title Input Skeleton */}
          <div>
            <Skeleton className="h-5 w-1/4 mb-2" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>

          {/* Category Select Skeleton */}
          <div>
            <Skeleton className="h-5 w-1/4 mb-2" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>

          {/* Description Textarea Skeleton */}
          <div>
            <Skeleton className="h-5 w-1/4 mb-2" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>

          {/* Subjects Checkbox Skeleton */}
          <div>
            <Skeleton className="h-5 w-1/4 mb-3" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Skeleton className="h-5 w-5 rounded" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
            </div>
          </div>

          {/* File Uploader Skeleton */}
          <div className="rounded-lg p-4">
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Submit Button Skeleton */}
          <Skeleton className="h-10 w-full rounded-lg" />
        </form>
      </div>
    </div>
  )
}

export const AnnouncementCardSkeleton = ({ withSubjects = false }) => {
  return (
    <div className="group p-3 mx-0.5 sm:p-4 md:p-6 bg-lamaSkyLight/50 rounded-lg shadow-sm border border-ColorThree/20">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-4 mb-2 sm:mb-3">
        {/* Title Skeleton */}
        <div className="h-4 sm:h-7 bg-gray-200 animate-pulse rounded-md w-full sm:w-1/3" />

        {/* Announcer Name Skeleton */}
        <div className="flex items-center gap-1.5">
          <User size={18} className="shrink-0 text-gray-300" />
          <div className="h-5 bg-gray-200 animate-pulse rounded-md w-24 sm:w-32" />
        </div>

        {/* Date Skeleton */}
        <div className="flex items-center text-xs sm:text-sm whitespace-nowrap bg-gray-200 animate-pulse px-3 py-1 rounded-full">
          <Clock size={14} className="mr-1.5 shrink-0 text-gray-300" />
          <div className="h-4 w-24 bg-gray-300 rounded" />
        </div>
      </div>

      {/* Description Skeleton */}
      <div className="space-y-2">
        <div className="h-2 bg-gray-200 animate-pulse rounded w-full" />
        <div className="h-2 bg-gray-200 animate-pulse rounded w-11/12" />
        <div className="h-2 bg-gray-200 animate-pulse rounded w-4/5" />
      </div>

      {/* Subject Tags Skeleton */}
      {withSubjects && (
        <div className="flex flex-wrap gap-2 mt-2">
          {[1, 2].map((index) => (
            <div
              key={index}
              className="h-3 w-24 bg-gray-200 animate-pulse rounded-full"
            />
          ))}
        </div>
      )}

      {/* Attachments Section Skeleton */}
      <div className="mt-2 space-y-2 bg-lamaSkyLight/50 p-3 rounded-lg">
        <div className="flex items-center">
          <Paperclip size={14} className="mr-1.5 shrink-0 text-gray-300" />
          <div className="h-4 w-28 bg-gray-200 animate-pulse rounded" />
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {[1, 2].map((index) => (
            <div
              key={index}
              className="h-4 sm:h-9 w-32 sm:w-36 bg-gray-200 animate-pulse rounded-full"
            />
          ))}
        </div>
      </div>

      {/* Action Buttons Skeleton */}
      <div className="mt-2 flex flex-col sm:flex-row gap-3 sm:justify-end">
        <div className="h-4 w-full sm:w-24 bg-gray-200 animate-pulse rounded-lg" />
        <div className="h-4 w-full sm:w-32 bg-gray-200 animate-pulse rounded-lg" />
      </div>
    </div>
  )
}
