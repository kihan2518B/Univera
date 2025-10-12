// hooks/useAdminSummary.ts
import { useQuery } from "@tanstack/react-query"

export type Summary = {
  departments: number
  staff: number
  students: number
  meta: { universityId: number | null }
}

export function useAdminSummary(params?: { universityId?: number }) {
  const search = new URLSearchParams(
    params?.universityId ? { universityId: String(params.universityId) } : {}
  ).toString()

  return useQuery<Summary, Error>({
    queryKey: ["admin-summary", params?.universityId ?? null],
    queryFn: async () => {
      const res = await fetch(`/api/admin/summary${search ? `?${search}` : ""}`)
      if (!res.ok) throw new Error("Failed to fetch summary")
      return res.json()
    },
    staleTime: 60_000 // 1 minute
  })
}
