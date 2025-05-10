import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css" // Import default styles
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"

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

export function SyllabusSkeleton() {
  // Create an array of 6 items to render skeleton cards
  const skeletonCards = Array(6).fill(null)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {skeletonCards.map((_, index) => (
        <Card
          key={`skeleton-${index}`}
          className="p-3 sm:p-4 overflow-hidden rounded-xl border-0 shadow w-full"
        >
          <div className="flex flex-row items-start gap-2">
            {/* Icon skeleton */}
            <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />

            <div className="flex-1 min-w-0">
              {/* Title skeleton */}
              <Skeleton className="h-6 w-3/4 mb-3" />

              {/* Tags skeleton */}
              <div className="flex flex-col space-y-2 mt-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-5 w-24 rounded-md" />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-32 rounded-md" />
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons skeleton */}
          <div className="flex justify-end gap-2 mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200/50">
            <Skeleton className="h-8 w-16 rounded-lg" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        </Card>
      ))}
    </div>
  )
}

export function Assignments_Subject_Skeleton() {
  // Create arrays to generate multiple skeleton cards
  const mySubjectSkeletons = Array(4).fill(null)
  const otherSubjectSkeletons = Array(4).fill(null)

  return (
    <div className="p-6">
      {/* Back button skeleton */}
      <Skeleton className="h-10 w-24 rounded-lg" />
      {/* My Subjects section */}
      <Skeleton className="h-8 w-48 mx-auto my-6" /> {/* Section title */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {mySubjectSkeletons.map((_, index) => (
          <Card
            key={`my-subject-skeleton-${index}`}
            className="p-4 relative overflow-hidden"
          >
            {/* Top part of subject card */}
            <div className="flex items-center mb-3">
              <Skeleton className="h-10 w-10 rounded-md mr-3" />{" "}
              {/* Icon placeholder */}
              <div className="flex-1">
                <Skeleton className="h-5 w-24 mb-1" /> {/* Subject name */}
                <Skeleton className="h-4 w-16" /> {/* Subject code/detail */}
              </div>
            </div>

            {/* Bottom part with details */}
            <div className="flex justify-between items-center mt-2">
              <Skeleton className="h-4 w-20" /> {/* Subject detail */}
              <Skeleton className="h-6 w-16 rounded-full" />{" "}
              {/* Badge or action button */}
            </div>

            {/* Shimmering effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
          </Card>
        ))}
      </div>
      {/* Other Subjects section */}
      <Skeleton className="h-8 w-48 mx-auto my-6" /> {/* Section title */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {otherSubjectSkeletons.map((_, index) => (
          <Card
            key={`other-subject-skeleton-${index}`}
            className="p-4 relative overflow-hidden"
          >
            {/* Top part of subject card */}
            <div className="flex items-center mb-3">
              <Skeleton className="h-10 w-10 rounded-md mr-3" />{" "}
              {/* Icon placeholder */}
              <div className="flex-1">
                <Skeleton className="h-5 w-24 mb-1" /> {/* Subject name */}
                <Skeleton className="h-4 w-16" /> {/* Subject code/detail */}
              </div>
            </div>

            {/* Bottom part with details */}
            <div className="flex justify-between items-center mt-2">
              <Skeleton className="h-4 w-20" /> {/* Subject detail */}
              <Skeleton className="h-6 w-16 rounded-full" />{" "}
              {/* Badge or action button */}
            </div>

            {/* Shimmering effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
          </Card>
        ))}
      </div>
    </div>
  )
}

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/button"

interface AssignmentSubmissionsSkeletonProps {
  classId: string
}

export function AssignmentSubmissionsSkeleton({
  classId
}: AssignmentSubmissionsSkeletonProps) {
  return (
    <div className="min-h-screen bg-lamaSkyLight p-6">
      {/* Back Button */}
      <Link
        href={`/classes/my-class/${classId}`}
        className="flex items-center text-TextTwo hover:bg-lamaSkyLight"
      >
        <ArrowLeft size={18} className="mr-2" />
        Back
      </Link>

      {/* Assignment Details Card Skeleton */}
      <Card className="mb-6 sm:mb-8 border-none shadow-lg bg-white">
        <CardHeader className="border-b border-gray-100 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Title Skeleton */}
            <div className="h-8 bg-gray-200 rounded-md w-3/4 animate-pulse"></div>
            {/* Edit Button Skeleton */}
            <div className="h-10 bg-gray-200 rounded-md w-24 animate-pulse"></div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Timeline Skeleton */}
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-full">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded w-2/3 animate-pulse"></div>
              </div>
            </div>
            {/* Type Skeleton */}
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-full">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
            {/* Author Skeleton */}
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-full">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded w-3/5 animate-pulse"></div>
              </div>
            </div>
            {/* Tags Skeleton */}
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-full">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-14 animate-pulse"></div>
                </div>
              </div>
            </div>
            {/* Attachment Skeleton */}
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-full">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
                <div className="h-20 bg-gray-200 rounded w-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submissions Section Skeleton */}
      <div className="space-y-6">
        <div className="h-7 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="grid gap-4">
          {/* Generate 3 submission skeletons */}
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <Card key={index} className="border-none shadow-sm bg-white">
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                    <div>
                      <div className="h-5 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  )
}

export function FacultyQuizzesSkeleton() {
  return (
    <div className="p-3">
      <div className="mb-4">
        <Button
          variant="ghost"
          className="flex items-center text-TextTwo hover:bg-lamaSkyLight"
          disabled
        >
          <ArrowLeft size={18} className="mr-2" />
          Back
        </Button>
      </div>
      <div className="flex justify-between items-start md:items-center mb-3">
        <div className="h-8 w-32 bg-gray-200 rounded-md animate-pulse"></div>
        <div className="h-10 w-28 bg-gray-200 rounded-md animate-pulse"></div>
      </div>

      {/* Desktop Table View Skeleton - only visible on md screens and above */}
      <div className="hidden md:block overflow-x-auto bg-[#EDF9FD] rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-[#C3EBFA]">
          <thead className="bg-[#87CEEB]">
            <tr>
              {Array(7)
                .fill(0)
                .map((_, i) => (
                  <th
                    key={i}
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-[#0A2353] uppercase tracking-wider"
                  >
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#F1F0FF]">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-[#FEFCE8]" : "bg-white"}
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="h-5 w-12 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="h-5 w-10 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View Skeleton - only visible on smaller screens (below md breakpoint) */}
      <div className="block md:hidden space-y-4">
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-2.5 border-l-4 border-gray-200"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="h-4 bg-gray-200 rounded animate-pulse"
                    ></div>
                  ))}
              </div>
              <div className="mt-4">
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export const QuizReviewSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Back Button */}
      <div className="mb-4">
        <Button
          variant="ghost"
          className="flex items-center text-TextTwo hover:bg-lamaSkyLight"
          disabled
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Quizzes
        </Button>
      </div>

      {/* Quiz Header Skeleton */}
      <Card className="mb-6 bg-white border border-gray-200 shadow-sm rounded-2xl p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <div className="w-full md:w-2/3">
            {/* Title skeleton */}
            <div className="h-8 bg-gray-200 rounded-md w-3/4 animate-pulse"></div>
            {/* Description skeleton */}
            <div className="h-4 bg-gray-200 rounded-md w-full mt-2 animate-pulse"></div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3 md:mt-0">
            {/* Status badge skeleton */}
            <div className="h-6 bg-gray-200 rounded-full w-24 animate-pulse"></div>
            {/* Visibility badge skeleton */}
            <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
          </div>
        </div>

        {/* Quiz Meta Information Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* Duration skeleton */}
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-md w-32 animate-pulse"></div>
          </div>
          {/* Questions count skeleton */}
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-md w-28 animate-pulse"></div>
          </div>
          {/* Total marks skeleton */}
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-md w-24 animate-pulse"></div>
          </div>
        </div>

        {/* Tags Skeleton */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"
            ></div>
          ))}
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex flex-wrap gap-3 mt-4">
          <div className="h-10 bg-gray-200 rounded-md w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded-md w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded-md w-32 animate-pulse"></div>
        </div>

        {/* Visibility explainer skeleton */}
        <div className="mt-4 bg-lamaSkyLight p-3 rounded-lg">
          <div className="flex items-center">
            <div className="h-4 w-4 bg-gray-300 rounded-full animate-pulse mr-2"></div>
            <div className="h-4 bg-gray-300 rounded-md w-3/4 animate-pulse"></div>
          </div>
        </div>
      </Card>

      {/* Quiz Questions Section Skeleton */}
      <div className="h-6 bg-gray-200 rounded-md w-40 mb-4 animate-pulse"></div>

      <div className="space-y-4">
        {/* Generate 3 question skeletons */}
        {[1, 2, 3].map((index) => (
          <Card
            key={index}
            className="bg-white border border-gray-200 shadow-sm rounded-2xl p-4 md:p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="h-6 bg-gray-200 rounded-md w-2/3 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded-full w-24 animate-pulse"></div>
            </div>

            {/* Question description skeleton */}
            {index % 2 === 0 && (
              <div className="h-16 bg-gray-200 rounded-lg w-full mb-3 animate-pulse"></div>
            )}

            {/* Options skeleton */}
            <div className="space-y-2 mt-3">
              {[1, 2, 3, 4].map((optIndex) => (
                <div
                  key={optIndex}
                  className="h-12 bg-gray-200 rounded-lg w-full animate-pulse"
                ></div>
              ))}
            </div>

            {/* Correct answer indicator skeleton */}
            <div className="mt-3 flex items-center">
              <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse mr-2"></div>
              <div className="h-4 bg-gray-200 rounded-md w-48 animate-pulse"></div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
