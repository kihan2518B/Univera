"use client"

import { UserContext } from "@/context/user"
import React, { useContext } from "react"
import { useQuery } from "@tanstack/react-query"
import { FilePlus, RotateCcw } from "lucide-react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { ButtonV1 } from "./ButtonV1"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import AnnouncementCard from "./AnnouncementCard"
import { AnnouncementCardSkeleton } from "./Skeleton"

async function fetchAnnouncements(
  departmentId: string,
  universityId: string,
  classId: string | null
) {
  const response = await axios.get(
    `/api/announcements?route=findMany&&departmentId=${departmentId}&&universityId=${universityId}&&classId=${classId}`
  )
  return response?.data || []
}

export default function CommonAnnouncementsPage({
  classId,
  tab
}: {
  classId: string | null | undefined
  tab: string | null
}) {
  const router = useRouter()
  const { user } = useContext(UserContext)
  const roles = user?.roles?.map((role: any) => role.id) || []

  const allowedRoleIds = [1, 3, 5, 10, 11, 12, 13]
  const isFaculty = roles.includes(4)

  console.log("roles", roles)

  const canCreateAnnouncement =
    classId === null
      ? user?.roles.some((role: any) => allowedRoleIds.includes(role.id)) // null means it's common announcements
      : isFaculty // not null means it's class announcements

  console.log("canCreateAnnouncement", canCreateAnnouncement)

  const {
    data: announcements,
    error,
    refetch,
    isLoading
  } = useQuery({
    queryKey: ["announcements", user?.departmentId, user?.universityId],
    queryFn: () =>
      fetchAnnouncements(
        String(user?.departmentId),
        String(user?.universityId),
        classId === null ? null : (classId as string)
      ),
    enabled: !!user?.departmentId && !!user?.universityId
  })

  if (!user) return null

  return (
    <div>
      <div className="max-w-6xl mx-auto p-3 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-4">
          <h1 className="text-2xl font-semibold text-TextTwo text-center sm:text-left">
            Bulletin
          </h1>
          {canCreateAnnouncement && classId !== null && (
            <button
              onClick={() =>
                router.push(`/announcements/form?classId=${classId}`)
              }
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-ColorThree border border-ColorThree 
          hover:bg-ColorThree hover:text-white transition-all duration-200 gap-2 group/create w-full sm:w-auto"
            >
              <FilePlus
                size={18}
                className="transition-transform group-hover/create:rotate-12"
              />
              Create Announcement for class
            </button>
          )}

          {canCreateAnnouncement && classId === null && (
            <button
              onClick={() => router.push(`/announcements/form`)}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-ColorThree border border-ColorThree 
          hover:bg-ColorThree hover:text-white transition-all duration-200 gap-2 group/create w-full sm:w-auto p-1"
            >
              <FilePlus
                size={18}
                className="transition-transform group-hover/create:rotate-12"
              />
              Create Announcement
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden p-4">
          <Tabs defaultValue={tab ? `${tab}` : `general`} className="w-full">
            <TabsList className="w-full flex justify-evenly bg-lamaSkyLight mb-6 px-3 py-5">
              {[
                { value: "general", label: "General" },
                { value: "event", label: "Event" },
                { value: "private", label: "Private" }
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex-1 data-[state=active]:bg-white data-[state=active]:text-ColorThree
                    data-[state=active]:shadow-sm text-TextTwo hover:text-ColorThree transition-colors text-sm md:text-base py-1"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {["general", "event", "private"].map((tabValue) => (
              <TabsContent
                key={tabValue}
                value={tabValue}
                className="space-y-4 max-h-[65vh] overflow-y-auto custom-scrollbar"
              >
                {error && (
                  <div className="text-red-500">
                    <p>Failed to load announcement. Please try again later.</p>
                    <p className="text-sm text-gray-500">
                      {error?.message || "An unexpected error occurred."}
                    </p>
                    <ButtonV1
                      icon={RotateCcw}
                      label="Retry"
                      onClick={() => refetch()}
                    />
                  </div>
                )}
                {isLoading ? (
                  Array(2)
                    .fill(0)
                    .map((_, index) => (
                      <AnnouncementCardSkeleton
                        key={index}
                        withSubjects={!!classId}
                      />
                    ))
                ) : announcements?.filter((a: any) => a.category === tabValue)
                    .length > 0 ? (
                  announcements
                    .filter((a: any) => a.category === tabValue)
                    .map((announcement: any) => (
                      <AnnouncementCard
                        key={announcement.id}
                        announcement={announcement}
                        facultyClassId={classId}
                        refetch={refetch}
                      />
                    ))
                ) : (
                  <div className="text-center py-12 text-TextTwo/70">
                    No announcements found in this category.
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  )
}
