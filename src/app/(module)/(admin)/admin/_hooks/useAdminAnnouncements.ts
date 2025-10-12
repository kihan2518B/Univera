// hooks/useAnnouncements.ts
import { useQuery } from "@tanstack/react-query"

export type Announcement = {
  id: number
  title: string
  description: string | null
  date: string
  category: string
  announcerName: string
  departmentId: number
  classId: number | null
  subjectName: string[]
  attachments: any[]
}

export function useAnnouncements(params: {
  start?: string
  end?: string
  departmentId?: number
  universityId?: number
  q?: string
}) {
  const search = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== null)
        .map(([k, v]) => [k, String(v)])
    )
  ).toString()

  return useQuery<{ announcements: Announcement[] }, Error>({
    queryKey: ["announcements", params],
    queryFn: async () => {
      const res = await fetch(
        `/api/admin/dashboard/announcements${search ? `?${search}` : ""}`
      )
      if (!res.ok) throw new Error("Failed to fetch announcements")
      return res.json()
    },
    staleTime: 30000
  })
}
