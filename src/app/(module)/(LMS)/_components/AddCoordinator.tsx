import { useEffect, useState } from "react"
import { DropdownInput } from "@/components/(commnon)/EditableInputField"
import { Prisma } from "@prisma/client"
import axios from "axios"
import toast from "react-hot-toast"
import { Submit } from "@/components/(commnon)/ButtonV1"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"

type FacultyWithRelations = Prisma.FacultyGetPayload<{
  include: {
    user: {
      include: {
        roles: true
      }
    }
  }
}>

interface AddCoordinatorProps {
  CoordinatorUsers: FacultyWithRelations[]
  classId: string
  refetch: () => void
}

export function AddCoordinator({
  CoordinatorUsers,
  classId,
  refetch
}: AddCoordinatorProps) {
  const [selectedCoordinator, setSelectedCoordinator] = useState<string>("")
  const [submitting, setSubmitting] = useState(false)
  const UserOption = CoordinatorUsers.reduce<
    { value: string; label: string }[]
  >((options, user) => {
    const roles = user.user.roles.map((role) => role.id)
    if (roles.includes(5)) {
      options.push({ value: user.user.id, label: user.user.name })
    }
    return options
  }, [])

  const handleChange = ({ value }: { name: string; value: string }) => {
    setSelectedCoordinator(value)
  }

  const handleSave = async () => {
    try {
      setSubmitting(true)
      const res = await axios.patch(`/api/classes/${classId}`, {
        updatedClass: {
          coordinatorId: selectedCoordinator
        }
      })
      if (res.status === 200) {
        toast.success(res.data.message)
        refetch()
      } else {
        toast.error(res.data.message)
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Something went wrong")
      } else {
        toast.error("An unexpected error occurred")
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="">
      {UserOption.length > 0 ? (
        <DropdownInput
          className="max-w-2xl w-full"
          label="Select User as Coordinator"
          onChange={handleChange}
          placeholder={
            UserOption.find(
              (option) => String(option.value) === String(selectedCoordinator)
            )?.label || "Select a Coordinator"
          }
          value={
            UserOption.find(
              (option) => String(option.value) === String(selectedCoordinator)
            )?.value || ""
          }
          name="coordinatorId"
          options={UserOption}
        />
      ) : (
        <p className="text-gray-500">
          No coordinators found in this department to assign to this class.
        </p>
      )}
      <Submit
        id="save-coordinator"
        label="Save"
        loading={submitting}
        onClick={handleSave}
        disabled={UserOption.length === 0}
      />
    </div>
  )
}

interface AddMentorProps {
  MentorUsers: FacultyWithRelations[]
  classId: string
  refetch: () => void
}

export function AddMentor({ MentorUsers, classId, refetch }: AddMentorProps) {
  const [selectedMentor, setSelectedMentor] = useState<string>("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string>("")

  const UserOption = MentorUsers.reduce<{ value: string; label: string }[]>(
    (options, user) => {
      const roles = user.user.roles.map((role) => role.id)
      if (roles.includes(13)) {
        options.push({ value: user.user.id, label: user.user.name })
      }
      return options
    },
    []
  )

  const handleChange = ({ value }: { name: string; value: string }) => {
    setSelectedMentor(value)
    setError("") // Clear error on change
  }

  const handleSave = async () => {
    try {
      if (!selectedMentor) {
        setError("Please select a mentor")
        return
      }
      setSubmitting(true)
      const res = await axios.patch(`/api/classes/${classId}`, {
        updatedClass: {
          mentorId: selectedMentor
        }
      })
      if (res.status === 200) {
        toast.success(res.data.message)
        refetch()
      } else {
        toast.error(res.data.message)
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Something went wrong")
      } else {
        toast.error("An unexpected error occurred")
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="">
      {UserOption.length > 0 ? (
        <DropdownInput
          className="max-w-2xl w-full"
          label="Select User as Mentor"
          onChange={handleChange}
          placeholder={
            UserOption.find(
              (option) => String(option.value) === String(selectedMentor)
            )?.label || "Select a Mentor"
          }
          value={
            UserOption.find(
              (option) => String(option.value) === String(selectedMentor)
            )?.value || ""
          }
          name="mentorId"
          options={UserOption}
        />
      ) : (
        <p className="text-gray-500">
          No mentors found in this department to assign to this class.
        </p>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <div className="mt-6 flex justify-end">
        <Submit
          loading={submitting}
          id="save-mentor"
          label="Save"
          onClick={handleSave}
          disabled={UserOption.length === 0 || submitting}
          className="bg-Primary hover:bg-Primary/90"
        />
      </div>
    </div>
  )
}

interface UpdateCoordinatorProps extends AddCoordinatorProps {
  open: boolean
  setOpen: (open: boolean) => void
  coordinatorId: string
}

export function UpdateCoordinator({
  CoordinatorUsers,
  coordinatorId,
  classId,
  refetch,
  open,
  setOpen
}: UpdateCoordinatorProps) {
  const [selectedCoordinator, setSelectedCoordinator] = useState<string>("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string>("")

  const UserOption = CoordinatorUsers.reduce<
    { value: string; label: string }[]
  >((options, user) => {
    const roles = user.user.roles.map((role) => role.id)
    if (roles.includes(5)) {
      options.push({ value: user.user.id, label: user.user.name })
    }
    return options
  }, [])

  console.log("UserOption c", UserOption)

  useEffect(() => {
    // Set the initial selected coordinator if provided
    if (coordinatorId) {
      setSelectedCoordinator(coordinatorId)
    }
  }, [coordinatorId])

  const handleChange = ({ value }: { name: string; value: string }) => {
    setSelectedCoordinator(value)
    setError("") // Clear error on change
  }

  const handleSave = async () => {
    if (!selectedCoordinator) {
      setError("Please select a coordinator")
      return
    }

    try {
      setSubmitting(true)
      const res = await axios.patch(`/api/classes/${classId}`, {
        updatedClass: {
          coordinatorId: selectedCoordinator
        }
      })
      if (res.status === 200) {
        toast.success(res.data.message)
        refetch()
        setOpen(false) // Close dialog after success
      } else {
        toast.error(res.data.message)
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Something went wrong")
      } else {
        toast.error("An unexpected error occurred")
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-Dark mb-4">
            Update Class Coordinator
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {UserOption.length > 0 ? (
            <DropdownInput
              className="max-w-2xl w-full"
              label="Select User as Coordinator"
              onChange={handleChange}
              placeholder={
                UserOption.find(
                  (option) =>
                    String(option.value) === String(selectedCoordinator)
                )?.label || "Select a Coordinator"
              }
              value={
                UserOption.find(
                  (option) =>
                    String(option.value) === String(selectedCoordinator)
                )?.value || ""
              }
              name="coordinatorId"
              options={UserOption}
            />
          ) : (
            <p className="text-gray-500">
              No coordinators found in this department to assign to this class.
            </p>
          )}
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <div className="mt-6 flex justify-end">
            <Submit
              loading={submitting}
              id="save-coordinator"
              label="Save"
              onClick={handleSave}
              disabled={
                UserOption.length === 0 ||
                submitting ||
                selectedCoordinator === coordinatorId
              }
              className="bg-Primary hover:bg-Primary/90"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface UpdateMentorProps extends AddMentorProps {
  open: boolean
  setOpen: (open: boolean) => void
  mentorId: string
}

export function UpdateMentor({
  MentorUsers,
  mentorId,
  classId,
  refetch,
  open,
  setOpen
}: UpdateMentorProps) {
  const [selectedMentor, setSelectedMentor] = useState<string>("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string>("")

  const UserOption = MentorUsers.reduce<{ value: string; label: string }[]>(
    (options, user) => {
      const roles = user.user.roles.map((role) => role.id)
      if (roles.includes(13)) {
        options.push({ value: user.user.id, label: user.user.name })
      }
      return options
    },
    []
  )

  console.log("UserOption", UserOption)

  useEffect(() => {
    // Set the initial selected coordinator if provided
    if (mentorId) {
      setSelectedMentor(mentorId)
    }
  }, [mentorId])

  const handleChange = ({ value }: { name: string; value: string }) => {
    setSelectedMentor(value)
  }

  const handleSave = async () => {
    try {
      if (!selectedMentor) {
        setError("Please select a mentor")
        return
      }
      setSubmitting(true)
      const res = await axios.patch(`/api/classes/${classId}`, {
        updatedClass: {
          mentorId: selectedMentor
        }
      })
      if (res.status === 200) {
        toast.success(res.data.message)
        setOpen(false)
        refetch()
      } else {
        toast.error(res.data.message)
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Something went wrong")
      } else {
        toast.error("An unexpected error occurred")
      }
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-Dark mb-4">
            Update Class Mentor
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {UserOption.length > 0 ? (
            <DropdownInput
              className="max-w-2xl w-full"
              label="Select User as Mentor"
              onChange={handleChange}
              placeholder={
                UserOption.find(
                  (option) => String(option.value) === String(selectedMentor)
                )?.label || "Select a Mentor"
              }
              value={
                UserOption.find(
                  (option) => String(option.value) === String(selectedMentor)
                )?.value || ""
              }
              name="mentorId"
              options={UserOption}
            />
          ) : (
            <p className="text-gray-500">
              No mentors found in this department to assign to this class.
            </p>
          )}
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <div className="mt-6 flex justify-end">
            <Submit
              loading={submitting}
              id="save-coordinator"
              label="Save"
              onClick={handleSave}
              disabled={
                UserOption.length === 0 ||
                submitting ||
                selectedMentor === mentorId
              }
              className="bg-Primary hover:bg-Primary/90"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
