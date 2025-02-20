"use client"
import React, { useContext } from "react"
import WelcomeBanner from "../../_components/WelcomeBanner"
import { Balances } from "@prisma/client"
import Calendar from "../../_components/Calendar"
import Container from "../../_components/Container"
import UserBalances from "../../_components/UserBalances"
import { UserContext } from "@/context/user"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import Left from "@/components/Icons/Left"
import axios from "axios"
import { UserBalancesSkeleton } from "../../_components/Faculty_Skeleton"

async function GetUserBalances(email: string) {
  const currentYear = new Date().getFullYear()
  const res = await axios.get(`/api/leave/balance`, {
    params: {
      email,
      isMyBalances: true,
      year: currentYear
    }
  })
  return res.data.balances
}

export default function Portal() {
  const { user } = useContext(UserContext)

  const { data, refetch, isError, isLoading } = useQuery({
    queryKey: ["yBalance", "yEvents"],
    queryFn: () => GetUserBalances(String(user?.email)),
    enabled: !!user?.email
  })

  return (
    <>
      <div className="mb-6 ml-4">
        <Link
          className="flex items-center gap-2 border border-gray-300 bg-white text-gray-700 font-semibold rounded-lg px-4 py-2 hover:bg-gray-100 hover:shadow transition duration-200 w-fit"
          href={"/leave"}
        >
          <Left />
          Back
        </Link>
      </div>
      <WelcomeBanner balance={data} user={user} refetch={refetch} />
      <Calendar events={data?.Events} />
      <div>
        <Container>
          <div className=" my-4 ">
            <h2 className="text-xl text-center font-extrabold leading-tight  lg:text-2xl">
              Current Year Balances
            </h2>
          </div>
        </Container>
        {isLoading ? (
          <Container>
            <UserBalancesSkeleton />
          </Container>
        ) : (
          <UserBalances isError={isError} balances={data as Balances[]} />
        )}
      </div>
    </>
  )
}
