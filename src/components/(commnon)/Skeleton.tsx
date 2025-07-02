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
import {
  Award,
  Calendar,
  Clock,
  Paperclip,
  TrendingUp,
  Trophy,
  User,
  Users
} from "lucide-react"

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

export function AssignmentSubmissionsSkeleton() {
  return (
    <div className="min-h-screen bg-lamaSkyLight p-6">
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

const IndividualSkeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
)

export function AttendancePageSkeleton() {
  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section IndividualSkeleton */}
        <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
          <div className="bg-ColorThree text-white p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <IndividualSkeleton className="h-8 w-64 mb-2 bg-white/20" />
                <IndividualSkeleton className="h-4 w-80 bg-white/20" />
              </div>
              <IndividualSkeleton className="h-6 w-16 bg-white/20 self-start lg:self-center" />
            </div>
          </div>

          {/* Slot Details IndividualSkeleton */}
          <div className="p-6 bg-gray-50">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm"
                >
                  <IndividualSkeleton className="w-5 h-5" />
                  <div className="flex-1">
                    <IndividualSkeleton className="h-3 w-12 mb-1" />
                    <IndividualSkeleton className="h-4 w-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Attendance Summary IndividualSkeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { bg: "bg-green-50", border: "border-green-200" },
            { bg: "bg-red-50", border: "border-red-200" },
            { bg: "bg-blue-50", border: "border-blue-200" }
          ].map((style, i) => (
            <Card key={i} className={`${style.bg} ${style.border}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <IndividualSkeleton className="h-4 w-16 mb-2" />
                    <IndividualSkeleton className="h-8 w-12" />
                  </div>
                  <IndividualSkeleton className="w-8 h-8" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bulk Actions Section IndividualSkeleton */}
        <Card className="bg-white shadow-lg border border-gray-200">
          <CardHeader className="bg-blue-50 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <IndividualSkeleton className="w-5 h-5" />
              <IndividualSkeleton className="h-5 w-32" />
            </div>
            <IndividualSkeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Make All Present IndividualSkeleton */}
              <div className="space-y-3">
                <IndividualSkeleton className="h-4 w-32" />
                <IndividualSkeleton className="h-10 w-full" />
              </div>

              {/* Bulk Roll Number Input IndividualSkeleton */}
              <div className="space-y-3">
                <IndividualSkeleton className="h-4 w-48" />
                <div className="flex gap-2">
                  <IndividualSkeleton className="h-10 flex-1" />
                  <IndividualSkeleton className="h-10 w-16" />
                </div>
                <IndividualSkeleton className="h-3 w-64" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Table IndividualSkeleton */}
        <Card className="bg-white shadow-lg border border-gray-200">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <IndividualSkeleton className="h-6 w-48" />
            <IndividualSkeleton className="h-4 w-80 mt-2" />
          </CardHeader>
          <CardContent className="p-0">
            {/* Desktop/Tablet Table View IndividualSkeleton */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="text-left p-4">
                      <IndividualSkeleton className="h-4 w-16" />
                    </th>
                    <th className="text-left p-4">
                      <IndividualSkeleton className="h-4 w-24" />
                    </th>
                    <th className="text-left p-4 hidden md:table-cell">
                      <IndividualSkeleton className="h-4 w-12" />
                    </th>
                    <th className="text-left p-4 hidden lg:table-cell">
                      <IndividualSkeleton className="h-4 w-16" />
                    </th>
                    <th className="text-center p-4">
                      <IndividualSkeleton className="h-4 w-20 mx-auto" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <tr key={i} className="border-b border-gray-100 bg-gray-50">
                      <td className="p-4">
                        <IndividualSkeleton className="h-5 w-8" />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <IndividualSkeleton className="w-8 h-8 rounded-full" />
                          <IndividualSkeleton className="h-4 w-32" />
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <IndividualSkeleton className="h-4 w-24" />
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <IndividualSkeleton className="h-4 w-40" />
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <IndividualSkeleton className="w-5 h-5" />
                          <IndividualSkeleton className="h-4 w-12" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View IndividualSkeleton */}
            <div className="block sm:hidden">
              <div className="space-y-3 p-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="rounded-lg p-4 border-l-4 border-l-gray-300 bg-gray-50 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      {/* Student Info IndividualSkeleton */}
                      <div className="flex items-center gap-3 flex-1">
                        <IndividualSkeleton className="w-12 h-12 rounded-full" />
                        <div className="flex-1 min-w-0">
                          <IndividualSkeleton className="h-5 w-32 mb-1" />
                          <IndividualSkeleton className="h-4 w-24" />
                        </div>
                      </div>

                      {/* Attendance Toggle IndividualSkeleton */}
                      <div className="flex flex-col items-center gap-2 ml-4">
                        <IndividualSkeleton className="w-6 h-6" />
                        <IndividualSkeleton className="h-3 w-12" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button IndividualSkeleton */}
        <div className="flex justify-center pb-6">
          <IndividualSkeleton className="h-12 w-48" />
        </div>
      </div>
    </div>
  )
}

export const SlotsContentSkeleton: React.FC = () => {
  return (
    <div className="p-4 sm:p-6">
      <div className="space-y-4 sm:space-y-6">
        {/* Header Summary Section Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-blue-50/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-blue-100/50">
          <div className="flex items-center mb-3 sm:mb-0">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <IndividualSkeleton className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
            </div>
            <IndividualSkeleton className="h-6 w-24 sm:h-7 sm:w-32" />
          </div>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {[1, 2, 3].map((i) => (
              <IndividualSkeleton
                key={i}
                className="h-6 w-16 sm:w-20 rounded-full"
              />
            ))}
          </div>
        </div>

        {/* Slots List IndividualSkeleton */}
        <div className="space-y-4 md:space-y-6">
          {[1, 2, 3, 4].map((slotIndex) => (
            <div
              key={slotIndex}
              className="group relative rounded-2xl md:rounded-3xl shadow-lg border-l-4 md:border-l-6 overflow-hidden bg-gradient-to-r from-white/95 to-white/90 backdrop-blur-sm border border-gray-100/50"
              style={{
                borderLeftColor: "#CE93D8"
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-50/20 pointer-events-none" />
              <div className="relative p-4 md:p-6">
                <div className="flex flex-col space-y-4">
                  {/* Header Section */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
                    <div className="flex items-start space-x-3 md:space-x-4 flex-1 min-w-0">
                      <div className="flex-1 min-w-0">
                        <IndividualSkeleton className="h-6 w-48 md:h-7 md:w-64 lg:h-8 lg:w-80 mb-2" />
                        <IndividualSkeleton className="h-4 w-32 md:h-5 md:w-40 lg:h-6 lg:w-48" />
                      </div>
                    </div>
                    {/* Desktop Action Buttons */}
                    <div className="hidden sm:flex gap-2">
                      <IndividualSkeleton className="h-9 w-24 md:h-10 md:w-28 rounded-xl" />
                      <IndividualSkeleton className="h-9 w-28 md:h-10 md:w-32 rounded-xl" />
                    </div>
                  </div>

                  {/* Info Grid Section */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                    {/* Time Card */}
                    <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/50">
                      <div className="flex-shrink-0 p-2 rounded-lg bg-blue-500/10">
                        <IndividualSkeleton className="h-4 w-4 md:h-5 md:w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <IndividualSkeleton className="h-3 w-8 mb-1" />
                        <IndividualSkeleton className="h-4 w-20 md:h-5 md:w-24" />
                      </div>
                    </div>

                    {/* Location Card */}
                    <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-100/50">
                      <div className="flex-shrink-0 p-2 rounded-lg bg-red-500/10">
                        <IndividualSkeleton className="h-4 w-4 md:h-5 md:w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <IndividualSkeleton className="h-3 w-12 mb-1" />
                        <IndividualSkeleton className="h-4 w-16 md:h-5 md:w-20" />
                      </div>
                    </div>

                    {/* Tag Card */}
                    <div className="flex">
                      <div className="w-full flex items-center justify-center px-4 py-3 rounded-xl bg-purple-100 shadow-md ring-1 ring-white/30">
                        <IndividualSkeleton className="h-4 w-16" />
                      </div>
                    </div>
                  </div>

                  {/* Mobile Action Buttons */}
                  <div className="sm:hidden space-y-2">
                    <IndividualSkeleton className="h-10 w-full max-w-xs mx-auto rounded-xl" />
                    <IndividualSkeleton className="h-10 w-full max-w-xs mx-auto rounded-xl" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const AttendanceCardSkeleton = () => {
  return (
    <section className="max-w-5xl mx-auto px-4">
      {[...Array(5)].map((_, index) => (
        <Card key={index} className="mb-4 p-4 animate-pulse">
          <CardHeader className="flex flex-row justify-between items-center">
            <div className="flex items-center gap-3">
              <Skeleton circle width={20} height={20} />
              <div>
                <Skeleton width={120} height={16} />
                <Skeleton width={80} height={12} />
              </div>
            </div>
            <Skeleton width={20} height={20} />
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border bg-white/50 border-border"
                >
                  <Skeleton height={20} width={`60%`} />
                  <Skeleton height={16} width={`40%`} className="mt-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  )
}

export const AttendanceStateSkeleton = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto px-2 sm:px-6 lg:px-8 py-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="rounded-2xl p-4 border animate-pulse">
          <Skeleton width={80} height={16} />
          <Skeleton width={40} height={24} className="mt-2" />
        </div>
      ))}
    </div>
  )
}

export const QuizResultsSkeleton = () => {
  return (
    <div className="min-h-screen">
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4">
            <Skeleton height={60} width={400} className="mx-auto" />
          </div>
          <div className="max-w-2xl mx-auto">
            <Skeleton height={24} count={2} />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {[
            { icon: Users, color: "from-blue-500 to-cyan-500" },
            { icon: TrendingUp, color: "from-green-500 to-emerald-500" },
            { icon: Trophy, color: "from-purple-500 to-pink-500" },
            { icon: Award, color: "from-indigo-500 to-blue-500" }
          ].map((card, index) => (
            <div
              key={index}
              className="group relative overflow-hidden bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/30"
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${card.color} rounded-2xl flex items-center justify-center shadow-lg`}
                  >
                    <card.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-right">
                    <Skeleton width={60} height={16} className="mb-2" />
                    <Skeleton width={80} height={40} />
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <Skeleton height={8} className="rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
          {/* Bar Chart Skeleton */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 shadow-xl border border-white/30">
            <div className="mb-4">
              <Skeleton width={200} height={32} />
            </div>
            <div className="w-full">
              <Skeleton height={350} />
            </div>
          </div>

          {/* Pie Chart Skeleton */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 shadow-xl border border-white/30">
            <div className="mb-4">
              <Skeleton width={180} height={32} />
            </div>
            <div className="w-full flex flex-col items-center">
              <div className="w-80 h-80 flex items-center justify-center">
                <Skeleton circle height={200} width={200} />
              </div>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-6 lg:space-x-8 mt-4 sm:mt-6">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full"></div>
                  <Skeleton width={80} height={16} />
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-400 rounded-full"></div>
                  <Skeleton width={80} height={16} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Student Submissions Skeleton */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-white/30 overflow-hidden">
          <div className="p-4 border-b border-white/30 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <Skeleton width={200} height={36} />
                <div className="mt-1">
                  <Skeleton width={180} height={20} />
                </div>
              </div>
            </div>
          </div>

          <div className="divide-y divide-white/30">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="group p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                        <Skeleton width={30} height={24} />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-lg">
                        <Skeleton circle width={20} height={20} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <Skeleton width={180} height={24} className="mb-2" />
                          <Skeleton width={220} height={18} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-8">
                    <div className="text-center bg-white/50 rounded-2xl p-4 min-w-[120px]">
                      <Skeleton
                        width={40}
                        height={16}
                        className="mb-1 mx-auto"
                      />
                      <Skeleton
                        width={60}
                        height={36}
                        className="mb-1 mx-auto"
                      />
                      <Skeleton width={50} height={14} className="mx-auto" />
                    </div>

                    <div className="text-center">
                      <Skeleton
                        width={50}
                        height={16}
                        className="mb-2 mx-auto"
                      />
                      <Skeleton
                        width={100}
                        height={32}
                        className="mx-auto rounded-xl"
                      />
                    </div>

                    <div className="text-center">
                      <Skeleton
                        width={70}
                        height={16}
                        className="mb-2 mx-auto"
                      />
                      <div className="flex items-center justify-center bg-gray-50 rounded-xl px-3 py-2">
                        <Calendar className="w-4 h-4 mr-2 text-gray-300" />
                        <Skeleton width={80} height={14} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar Skeleton */}
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <Skeleton width={60} height={16} />
                    <Skeleton width={40} height={16} />
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <Skeleton height={12} className="rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
