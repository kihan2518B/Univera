export type AdminRole =
  | "Department Head"
  | "Program Coordinator"
  | "Administrative Staff"
  | "System Administrator"

export interface TeamMember {
  id: string
  name: string
  email: string
  role: AdminRole
}
