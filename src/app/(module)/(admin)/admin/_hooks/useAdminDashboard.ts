// lib/hooks/useDashboard.ts
"use client"
import { useQuery } from "@tanstack/react-query"

export function useCounts(universityId?: number) {
  const q = universityId ? `?universityId=${universityId}` : ""
  return useQuery({
    queryKey: ["dashboard", "counts", universityId ?? "all"],
    queryFn: async () => {
      const res = await fetch(`/api/admin/dashboard/counts${q}`)
      if (!res.ok) throw new Error("Failed to fetch counts")
      return res.json()
    },
    staleTime: 60_000 // 1 minute
  })
}

export function useAnnouncements(universityId?: number) {
  const q = universityId ? `?universityId=${universityId}` : ""
  return useQuery({
    queryKey: ["dashboard", "announcements", universityId ?? "all"],
    queryFn: async () => {
      const res = await fetch(`/api/admin/dashboard/announcements${q}`)
      if (!res.ok) throw new Error("Failed to fetch announcements")
      return res.json()
    },
    staleTime: 30_000
  })
}

export function useDepartmentAttendance(universityId?: number, days = 30) {
  const q = universityId
    ? `?universityId=${universityId}&days=${days}`
    : `?days=${days}`

  return useQuery({
    queryKey: [
      "dashboard",
      "attendance",
      "departments",
      universityId ?? "all",
      days
    ],
    queryFn: async () => {
      const res = await fetch(`/api/admin/dashboard/attendance/departments${q}`)
      if (!res.ok) throw new Error("Failed to fetch department attendance")
      return res.json()
    },
    staleTime: 30_000
  })
}

export function useMonthlyAttendance(universityId?: number, months = 6) {
  const q = universityId
    ? `?universityId=${universityId}&months=${months}`
    : `?months=${months}`
  return useQuery({
    queryKey: [
      "dashboard",
      "attendance",
      "monthly",
      universityId ?? "all",
      months
    ],
    queryFn: async () => {
      const res = await fetch(`/api/admin/dashboard/attendance/monthly${q}`)
      if (!res.ok) throw new Error("Failed to fetch monthly attendance")
      return res.json()
    },
    staleTime: 30_000
  })
}
