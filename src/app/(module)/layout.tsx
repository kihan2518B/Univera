import Menu from "@/components/(commnon)/SideBar"
import Navbar from "@/components/(commnon)/Navbar"
import Image from "next/image"
import Link from "next/link"
import React from "react"
import { UserProvider } from "@/context/user"

export default function ModuleLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="h-screen flex overflow-hidden">
      {/* left */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] min-md:px-4 py-4 px-2 h-screen flex flex-col">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start p-3 gap-2"
        >
          <Image src="/logo.png" alt="logo" width={32} height={32} />
          <span className="hidden lg:block font-extrabold text-2xl">
            Univera
          </span>
        </Link>
        <Menu />
      </div>
      {/* right */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] h-screen flex flex-col bg-[#F7F8FA] overflow-hidden">
        <UserProvider>
          <Navbar />
          <div className="flex-1 overflow-auto custom-scrollbar">
            {children}
          </div>
        </UserProvider>
      </div>
    </div>
  )
}
