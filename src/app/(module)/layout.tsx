import CustomSideBar from "@/components/(commnon)/CustomSideBar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import React from "react"

export default function ModuleLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider>
      <div className="h-full w-full p-0 m-0 flex bg-[#f8f9fa]">
        <CustomSideBar />
        <SidebarTrigger className="md:hidden scale-150" size={"sm"} />
        {children}
      </div>
    </SidebarProvider>
  )
}
