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

export type TruncatedTextProps = {
  text: string
  className?: string
}

export type SelectedSlot = {
  [IntClassId: number]: {
    [key: string]: {
      subject: string
      faculty: string | null
    } // key is formatted as `${day},${slot}`
  }
}

export type TableSlotCellProps = {
  selected:
    | {
        subject: string
        faculty: string | null
      }
    | undefined
  onSelect: () => void
  onDelete: () => void
  isCoordinator: boolean
  isEditing: boolean
  currentSubject: string
  selectedFaculty: string | null
}

export type TimeSlotCardProps = {
  timeSlot: string
  IntClassId: number
  selected?:
    | {
        subject: string
        faculty: string | null
      }
    | undefined
  onSelect: () => void
  onDelete: () => void
  isEditing: boolean
  isCoordinator: boolean
  removeTimeSlot: (IntClassId: number, index: number) => void
  rowIndex: number
  currentSubject: string
  selectedFaculty: string
}

export type DayScheduleProps = {
  day: string
  IntClassId: number
  timeSlots: string[]
  selectedSlots: SelectedSlot
  isCoordinator: boolean
  onCellClick: (
    day: string,
    slot: string,
    IntClassId: number,
    isDelete?: boolean
  ) => void
  isEditing: boolean
  removeTimeSlot: (IntClassId: number, index: number) => void
  currentSubject: string
  selectedFaculty: string
}

export type TimeTableSlot = {
  id: number
  timeTableId: number
  day: string
  fromTime: string
  toTime: string
  title: string
  facultyId?: string
  lecturerId?: string
  subjectId?: string
  courseId: number
  classId: number
  departmentId: number
}
