"use client"
import React, { useContext, useState } from "react"
import { UserContext } from "@/context/user"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { Download, Calendar, Info } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Tooltip as TooltipUI,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import UserTab from "../_components/UserTabs"
import axios from "axios"

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend)

interface BalanceEntry {
  annualAvailable: number
  annualUsed: number
  annualCredit: number
  casualAvailable: number
  casualUsed: number
  casualCredit: number
  healthAvailable: number
  healthUsed: number
  healthCredit: number
  maternityAvailable: number
  maternityUsed: number
  maternityCredit: number
  paternityAvailable: number
  paternityUsed: number
  paternityCredit: number
  specialAvailable: number
  specialUsed: number
  specialCredit: number
  unpaidAvailable: number
  unpaidUsed: number
  unpaidCredit: number
  email: string
  name: string
  year: string
}

// Custom hook for fetching user balances
const useUserBalances = (email: string, year: string) => {
  return useQuery({
    queryKey: ["leaveBalances", email, year],
    queryFn: async () => {
      const res = await axios.get(`/api/leave/balance`, {
        params: {
          email,
          isMyBalances: true,
          year
        }
      })
      return res.data.balances as BalanceEntry[]
    },
    enabled: !!email
  })
}

// Leave type configuration
const leaveTypes = [
  {
    id: "annual",
    label: "Annual Leave",
    color: "#87CEEB",
    lightColor: "#C3EBFA",
    description: "Regular annual leave allocation"
  },
  {
    id: "casual",
    label: "Casual Leave",
    color: "#5B58EB",
    lightColor: "#CECDF9",
    description: "Short-notice personal leave"
  },
  {
    id: "health",
    label: "Health Leave",
    color: "#BB63FF",
    lightColor: "#CFCEFF",
    description: "Medical and health-related leave"
  },
  {
    id: "maternity",
    label: "Maternity Leave",
    color: "#56E1E9",
    lightColor: "#EDF9FD",
    description: "Leave for expecting mothers"
  },
  {
    id: "paternity",
    label: "Paternity Leave",
    color: "#FAE27C",
    lightColor: "#FEFCE8",
    description: "Leave for expecting fathers"
  }
]

const LeaveCard = ({
  type,
  available,
  used,
  total
}: {
  type: (typeof leaveTypes)[0]
  available: number
  used: number
  total: number
}) => {
  // const percentage = Math.round((used / total) * 100)

  const chartData = {
    labels: ["Available", "Used"],
    datasets: [
      {
        data: [available, used],
        backgroundColor: [type.color, type.lightColor],
        borderWidth: 0,
        borderRadius: 4
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#112C71",
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
        callbacks: {
          label: (context: any) =>
            `${context.label}: ${context.raw} days (${Math.round(
              (context.raw / total) * 100
            )}%)`
        }
      }
    },
    cutout: "70%"
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300 bg-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-[#0A2353]">
              {type.label}
            </h3>
            <TooltipProvider>
              <TooltipUI>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-gray-400 mt-1" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{type.description}</p>
                </TooltipContent>
              </TooltipUI>
            </TooltipProvider>
          </div>
        </div>

        <div className="relative h-40">
          <Doughnut data={chartData} options={chartOptions} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold" style={{ color: type.color }}>
              {available}
            </span>
            <span className="text-sm text-gray-500">days left</span>
          </div>
        </div>

        <div className="flex justify-between mt-4 text-sm">
          <div className="flex flex-col">
            <span className="text-gray-500">Used</span>
            <span className="font-medium text-[#0A2353]">{used} days</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-gray-500">Total</span>
            <span className="font-medium text-[#0A2353]">{total} days</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const QuickStats = ({ balances }: { balances: BalanceEntry }) => {
  const stats = [
    {
      label: "Total Leave Days",
      value: Object.keys(balances)
        .filter((key) => key.includes("Credit"))
        .reduce(
          (acc, key) => acc + (balances[key as keyof BalanceEntry] as number),
          0
        ),
      color: "#87CEEB"
    },
    {
      label: "Days Used",
      value: Object.keys(balances)
        .filter((key) => key.includes("Used"))
        .reduce(
          (acc, key) => acc + (balances[key as keyof BalanceEntry] as number),
          0
        ),
      color: "#5B58EB"
    },
    {
      label: "Days Available",
      value: Object.keys(balances)
        .filter((key) => key.includes("Available"))
        .reduce(
          (acc, key) => acc + (balances[key as keyof BalanceEntry] as number),
          0
        ),
      color: "#BB63FF"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p
                  className="text-2xl font-bold mt-1"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function LeaveDashboard() {
  const { user } = useContext(UserContext)
  const [year, setYear] = useState(new Date().getFullYear().toString())

  const {
    data: balances,
    isLoading,
    isError
  } = useUserBalances(user?.email || "", year)
  const balance = balances?.[0]
  const roles = user?.roles.map((role: any) => role.id) || null

  const handleExport = () => {
    // Implement export functionality
    console.log("Exporting leave report...")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {roles && user && <UserTab roles={roles} />}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-[#0A2353] flex items-center gap-2">
              <Calendar className="w-8 h-8" />
              Leave Dashboard
            </h1>

            <div className="flex flex-wrap items-center gap-4">
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {[2023, 2024, 2025].map((y) => (
                    <SelectItem key={y} value={y.toString()}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                className="bg-[#112C71] hover:bg-[#0A2353] text-white"
                onClick={handleExport}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#112C71]"></div>
          </div>
        )}

        {isError && (
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-red-600">
              Error loading leave data. Please try again.
            </p>
          </div>
        )}

        {balance && (
          <>
            <QuickStats balances={balance} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leaveTypes.map((type) => {
                const available = balance[
                  `${type.id}Available` as keyof BalanceEntry
                ] as number
                const used = balance[
                  `${type.id}Used` as keyof BalanceEntry
                ] as number
                const total = balance[
                  `${type.id}Credit` as keyof BalanceEntry
                ] as number
                return (
                  <LeaveCard
                    key={type.id}
                    type={type}
                    available={available}
                    used={used}
                    total={total}
                  />
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
