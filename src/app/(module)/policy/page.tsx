"use client"

import { UserContext } from "@/context/user"
import React, { useContext } from "react"
import { useQuery } from "@tanstack/react-query"
import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
import { FilePlus, RotateCcw } from "lucide-react"
import axios from "axios"
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs"
import { TabsList } from "@radix-ui/react-tabs"
import { useRouter } from "next/navigation"
import PolicyCard from "./_components/PolicyCard"
import { AnnouncementCardSkeleton } from "@/components/(commnon)/Skeleton"

async function fetchPolicy(departmentId: string, universityId: string) {
  const response = await axios.get(
    `/api/policy?route=findMany&&departmentId=${departmentId}&&universityId=${universityId}`
  )
  return response?.data || []
}

export default function PolicyPage() {
  const router = useRouter()
  const { user } = useContext(UserContext)
  console.log("user: ", user)
  // Check if the user has any of the required role IDs
  const allowedRoleIds = [1, 3, 10, 11, 12]

  const canCreatePolicy = user?.roles.some((role: any) =>
    allowedRoleIds.includes(role.id)
  )

  const {
    data: policy,
    error,
    refetch,
    isLoading
  } = useQuery({
    queryKey: ["fetchPolicies", user?.departmentId, user?.universityId],
    queryFn: () =>
      fetchPolicy(String(user?.departmentId), String(user?.universityId)),
    enabled: !!user?.departmentId && !!user?.universityId
  })

  return (
    <div>
      <div className="max-w-6xl mx-auto p-2 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-4">
          <h1 className="text-2xl font-semibold text-TextTwo text-center sm:text-left">
            Policies
          </h1>
          {canCreatePolicy && (
            <button
              onClick={() => router.push("/policy/form")}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-ColorThree border border-ColorThree
              hover:bg-ColorThree hover:text-white transition-all duration-200 gap-2 group/create w-full sm:w-auto"
            >
              <FilePlus
                size={18}
                className="transition-transform group-hover/create:rotate-12"
              />
              Create Policy
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden p-4">
          <Tabs defaultValue="academic" className="w-full ">
            <TabsList className="w-full flex justify-evenly bg-lamaSkyLight mb-6 px-1 py-1.5">
              {[
                { value: "academic", label: "Academic" },
                { value: "administrative", label: "Administrative" },
                { value: "financial", label: "Financial" }
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex-1 data-[state=active]:bg-white data-[state=active]:text-ColorThree
                    data-[state=active]:shadow-sm text-TextTwo hover:text-ColorThree transition-colors text-xs sm:text-sm md:text-base py-1"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {["academic", "administrative", "financial"].map((tabValue) => (
              <TabsContent
                key={tabValue}
                value={tabValue}
                className="space-y-2 max-h-[65vh] overflow-y-auto custom-scrollbar"
              >
                {error && (
                  <div className="text-red-500">
                    <p>Failed to load policy. Please try again later.</p>
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
                        withSubjects={false}
                      />
                    ))
                ) : policy?.filter((a: any) => a.category === tabValue).length >
                  0 ? (
                  policy
                    .filter((a: any) => a.category === tabValue)
                    .map((policy: any) => (
                      <PolicyCard
                        key={policy.id}
                        policy={policy}
                        refetch={refetch}
                      />
                    ))
                ) : (
                  <div className="text-center py-12 text-TextTwo/70">
                    No policy found in this category.
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
