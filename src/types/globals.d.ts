export {}

// Create a type for the roles
export type Roles = "university_admin" | "university_admin_staff" | "faculty"

export type chatMessage = {
  attachments: boolean
  id: number
  message: string
  userId: string
  forumId: number
  attachments?: Array<{
    url: string
    fileType: string
    fileName: string
  }>
  createdAt: string
}

export type Forum = {
  id: number
  name: string
  userId: number
  subjectId: number
  departmentId: number
  moderatorId: number
  courseId: number
  forumTags: string[]
  isPrivate: boolean
  status: string
}

export type UploadedFile = {
  url: string
  fileType: string
  fileName: string
}

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}

export type Student = {
  id: string
  checked: boolean
}
