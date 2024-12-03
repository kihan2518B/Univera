"use client"
import React, { useEffect, useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import { SignOutButton, useUser } from "@clerk/nextjs"
import { LinkItem, Menuitems } from "@/constant"
import UserProfileBtn from "./UserProfileBtn"
import { Roles } from "@/types/globals"

export default function CustomSideBar() {
  const { open } = useSidebar()
  const pathName = usePathname()
  const { user } = useUser()
  const userRole: Roles = (user?.publicMetadata.role as Roles) ?? "admin"
  const [userLinks, setUserLinks] = useState<LinkItem[]>([])

  useEffect(() => {
    if (userRole) {
      setUserLinks(Menuitems[userRole] || [])
    }
  }, [userRole])
  // Check if we are on the signin or signup page
  const isAuthPage =
    pathName.includes("/sign-in") || pathName.includes("/sign-up")

  if (isAuthPage) {
    // Don't render the sidebar on signin or signup pages
    return null
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-gray-200">
      <SidebarHeader className="border-b border-gray-200">
        <div
          className={`w-full flex ${open ? "justify-end" : "justify-center"} p-4`}
        >
          <SidebarTrigger className="cursor-pointer" />
        </div>
        <div
          className="w-full justify-center items-center flex py-5"
          id="logo-container"
        >
          {open ? (
            <h2 className="text-2xl font-bold faculty-glyphic-regular text-TextTwo">
              Univera
            </h2>
          ) : (
            <h2 className="text-xl font-bold text-gray-900">U</h2>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className="pt-5 px-2 gap-1 flex-col">
          {userLinks.map((item) => {
            const isActive = pathName.includes(item.url)
            return (
              <SidebarMenuItem
                className="w-full flex items-center justify-center font-poppins text-TextTwo text-sm"
                key={item.title}
              >
                <SidebarMenuButton
                  asChild
                  className={`
                    transition-all duration-200 font-medium w-full text-center  pr-2 rounded-lg h-10 ${open ? "border-l-4 border-[#f8f9fa]" : "border-0"}
                    ${
                      isActive
                        ? "bg-Secondary shadow-sm hover:bg-Secondary font-bold border-ColorTwo"
                        : "hover:bg-gray-100 hover:text-gray-900"
                    }
                  `}
                >
                  <Link
                    href={item.url}
                    className="flex w-full items-center p-3 gap-3"
                  >
                    <item.icon className={`w-5 h-5 `} />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200 py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full">
              <UserProfileBtn SideBarOpen={open} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-36 mt-2 p-2 bg-white border border-gray-200 rounded-lg shadow-md">
            <DropdownMenuItem className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
              <LogOut className="w-4 h-4" />
              <SignOutButton redirectUrl="/signin" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
