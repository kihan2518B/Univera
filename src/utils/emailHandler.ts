import { sendProxyEmail } from "./sendProxyEmail"

interface EmailHandlerInput {
  type: "NEW_REQUEST" | "UPDATE_LECTURER" | "STATUS_CHANGE" | "DELETE_APPROVED"
  fromFaculty?: { name?: string; email?: string }
  toLecturer?: { name?: string; email?: string }
  oldLecturer?: { name?: string; email?: string }
  slot?: {
    startTime?: string
    endTime?: string
    title?: string
    location?: string
    className?: string
  }
  date?: string
  reason?: string
  status?: string
}

export async function handleProxyEmail({
  type,
  fromFaculty,
  toLecturer,
  oldLecturer,
  slot,
  date,
  reason,
  status
}: EmailHandlerInput) {
  const recipients = [
    fromFaculty?.email,
    toLecturer?.email,
    oldLecturer?.email
  ].filter((email): email is string => typeof email === "string")

  if (!recipients.length) {
    console.warn("No valid recipients found for email.")
    return
  }

  // Prepare base payload
  const emailPayload: any = {
    type,
    recipients
  }

  if (fromFaculty?.name) emailPayload.fromFacultyName = fromFaculty.name
  if (toLecturer?.name) emailPayload.toLecturerName = toLecturer.name
  if (oldLecturer?.name) emailPayload.oldLecturerName = oldLecturer.name

  if (slot?.startTime) emailPayload.startTime = slot.startTime
  if (slot?.endTime) emailPayload.endTime = slot.endTime
  if (slot?.title) emailPayload.title = slot.title
  if (slot?.location) emailPayload.location = slot.location
  if (slot?.className) emailPayload.className = slot.className

  if (date) emailPayload.date = date
  if (reason) emailPayload.reason = reason
  if (status) emailPayload.status = status

  await sendProxyEmail(emailPayload)
}
