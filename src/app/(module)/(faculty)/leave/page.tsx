"use client"

import React, { useContext } from "react"
import UserTab from "../_components/UserTabs"
import { UserContext } from "@/context/user"
import { Button } from "@/components/ui/button"
import { MonthDateRangePicker } from "../_components/MonthDateRangePicker"
import StatsCards from "../_components/StatsCards"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"

import { Download } from "lucide-react"
import { Card } from "@/components/ui/card"
// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend)

// Define the expected structure of the balance entry
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

// Function to fetch user balances
async function GetUserBalances(email: string): Promise<BalanceEntry[]> {
  const currentYear = new Date().getFullYear()
  try {
    const res = await axios.get(`/api/leave/balance`, {
      params: {
        email,
        isMyBalances: true,
        year: currentYear
      }
    })
    return res.data.balances
  } catch (error) {
    console.error("Error fetching balances:", error)
    throw error
  }
}

export default function LeavePage() {
  const { user } = useContext(UserContext)
  const roles = user?.roles.map((role: any) => role.id) || null

  const {
    data: balances,
    isError,
    isLoading
  } = useQuery({
    queryKey: ["yBalance", "yEvents"],
    queryFn: () => GetUserBalances(user?.email || ""),
    enabled: !!user?.email
  })
  console.log("balances: ", balances)
  // Extract the first balance entry for charts
  const balance = balances?.[0]

  // Generate data for doughnut charts
  // const generateChartData = (
  //   available: number,
  //   used: number,
  //   colors: string[]
  // ) => ({
  //   labels: ["Available", "Used"],
  //   datasets: [
  //     {
  //       data: [available, used],
  //       backgroundColor: [colors[0], colors[1]], // Lighter and darker shades
  //       hoverBackgroundColor: [colors[0], colors[1]], // Hover effects
  //       borderWidth: 0, // No border
  //       borderRadius: 0, // No rounded edges
  //       spacing: 0 // No spacing between segments
  //     }
  //   ]
  // })

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false // Hide default legend
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#333",
        titleFont: {
          size: 16
        },
        bodyFont: {
          size: 14
        },
        callbacks: {
          label: (context: any) => {
            const label = context.label || ""
            const value = context.raw || 0
            return `${label}: ${value} days`
          }
        }
      }
    },
    cutout: "70%", // Ring effect
    animation: {
      animateRotate: true, // Rotate animation
      animateScale: true // Scale animation
    }
  }

  // Define colors for each leave type
  const leaveColors = [
    { available: "#F6C000", used: "#FCEEB5" }, // Annual Leave
    { available: "#50A3A4", used: "#C7E7E8" }, // Casual Leave
    { available: "#474A40", used: "#B5B7B2" }, // Health Leave
    { available: "#F95335", used: "#FCCDC4" }, // Maternity Leave
    { available: "#FF96C5", used: "#FFD8EA" }, // Paternity Leave
    { available: "#0065A2", used: "#B3D7EC" }, // Special Leave
    { available: "#FFA23A", used: "#FFE2BE" } // Unpaid Leave
  ]

  // Leave types and their corresponding balances
  const leaveTypes = [
    {
      label: "Annual Leave",
      available: balance?.annualAvailable || 0,
      used: balance?.annualUsed || 0
    },
    {
      label: "Casual Leave",
      available: balance?.casualAvailable || 0,
      used: balance?.casualUsed || 0
    },
    {
      label: "Health Leave",
      available: balance?.healthAvailable || 0,
      used: balance?.healthUsed || 0
    },
    {
      label: "Maternity Leave",
      available: balance?.maternityAvailable || 0,
      used: balance?.maternityUsed || 0
    },
    {
      label: "Paternity Leave",
      available: balance?.paternityAvailable || 0,
      used: balance?.paternityUsed || 0
    },
    {
      label: "Special Leave",
      available: balance?.specialAvailable || 0,
      used: balance?.specialUsed || 0
    },
    {
      label: "Unpaid Leave",
      available: balance?.unpaidAvailable || 0,
      used: balance?.unpaidUsed || 0
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {roles && user && <UserTab roles={roles} />}

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row py-6 items-center justify-between bg-white rounded-lg px-6 shadow-sm mb-6">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            {/* <Calendar /> */}
            Leave Dashboard
          </h2>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <MonthDateRangePicker />
            <Button className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        <StatsCards />

        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}

        {isError && (
          <div className="text-center p-6 bg-red-50 rounded-lg">
            <p className="text-red-600">
              Error loading data. Please try again later.
            </p>
          </div>
        )}

        {balance && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">
              Leave Balances Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {leaveTypes.map((leave, index) => (
                <Card
                  key={leave.label}
                  className="p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex flex-col items-center">
                    <div className="h-40 w-40 relative mb-4">
                      <Doughnut
                        data={{
                          labels: ["Available", "Used"],
                          datasets: [
                            {
                              data: [leave.available, leave.used],
                              backgroundColor: [
                                leaveColors[index].available,
                                leaveColors[index].used
                              ],
                              borderWidth: 0,
                              borderRadius: 4,
                              spacing: 2
                            }
                          ]
                        }}
                        options={chartOptions}
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        {/* <span className="text-3xl mb-1">{leave.icon}</span> */}
                        <span
                          className="text-xl font-bold"
                          style={{ color: leaveColors[index].available }}
                        >
                          {leave.available}
                        </span>
                        <span className="text-sm text-gray-500">days left</span>
                      </div>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 text-center">
                      {leave.label}
                    </h4>
                    <div className="flex justify-between w-full mt-2 text-sm text-gray-500">
                      <span>Used: {leave.used}</span>
                      <span>Total: {leave.available + leave.used}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
