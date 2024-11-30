"use client"
import React from "react"
import { ChevronUp } from "lucide-react"
import { UserButton, useUser } from "@clerk/nextjs"

interface UserProfileBtnProps {
  SideBarOpen: boolean
}

export default function UserProfileBtn({ SideBarOpen }: UserProfileBtnProps) {
  const { user, isLoaded } = useUser()

  // Render a loading state that matches server-side output
  const loadingContent = (
    <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
  )

  return (
    <div
      className={`${
        SideBarOpen ? "w-full px-2" : "w-full p-1"
      } h-full cursor-pointer bg-Secondary text-TextTwo flex items-center justify-around rounded-xl hover:shadow-lg shadow-sm py-2`}
    >
      {SideBarOpen ? (
        <div className="w-full flex py-1 h-full items-center gap-2">
          {!isLoaded ? (
            loadingContent
          ) : (
            <div className="flex w-full items-center gap-2">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-6 w-6 rounded-full"
                  }
                }}
              />
              <div className="text-sm font-bold font-roboto">
                {user?.fullName ?? "User"}
              </div>
            </div>
          )}
          <div className="">
            <ChevronUp />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-between gap-2">
          <ChevronUp />
          {!isLoaded ? (
            loadingContent
          ) : (
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-6 w-6 rounded-full"
                }
              }}
            />
          )}
        </div>
      )}
    </div>
  )
}
