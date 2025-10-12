import { useQuery } from "@tanstack/react-query"

// ---- Overview ----
export function useDepartmentOverview(deptId: string) {
  return useQuery({
    queryKey: ["department-overview", deptId],
    queryFn: async () => {
      const res = await fetch(`/api/department_admin/${deptId}/overview`)
      if (!res.ok) throw new Error("Failed to fetch department overview")
      return res.json()
    }
  })
}

// ---- Attendance ----
export function useDepartmentAttendance(deptId: string) {
  return useQuery({
    queryKey: ["department-attendance", deptId],
    queryFn: async () => {
      const res = await fetch(`/api/department_admin/${deptId}/attendance`)
      if (!res.ok) throw new Error("Failed to fetch department attendance")
      return res.json()
    }
  })
}

// ---- Announcements ----
export function useDepartmentAnnouncements(deptId: string) {
  return useQuery({
    queryKey: ["department-announcements", deptId],
    queryFn: async () => {
      const res = await fetch(`/api/department_admin/${deptId}/announcements`)
      if (!res.ok) throw new Error("Failed to fetch announcements")
      return res.json()
    }
  })
}
