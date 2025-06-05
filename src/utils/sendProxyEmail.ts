import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.NEXT_PUBLIC_EMAIL_USER, // Your Gmail
    pass: process.env.NEXT_PUBLIC_EMAIL_PASS // App password
  },
  tls: { rejectUnauthorized: true }
})

type EmailType =
  | "NEW_REQUEST"
  | "UPDATE_LECTURER"
  | "STATUS_CHANGE"
  | "DELETE_APPROVED"

interface EmailData {
  type: EmailType
  recipients: string[]
  fromFacultyName?: string
  toLecturerName?: string
  oldLecturerName?: string
  startTime?: string
  endTime?: string
  reason?: string
  status?: string
  date?: string
  title?: string
  location?: string
  className?: string
}

// Professional email template with styling
const getEmailTemplate = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Proxy System Notification</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 40px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
        Academic Proxy System
      </h1>
      <p style="color: #e8f0fe; margin: 8px 0 0 0; font-size: 16px; opacity: 0.9;">
        Faculty Schedule Management
      </p>
    </div>
    
    <!-- Content -->
    <div style="padding: 40px;">
      ${content}
    </div>
    
    <!-- Footer -->
    <div style="background-color: #f8f9fa; padding: 25px 40px; border-top: 1px solid #e9ecef; text-align: center;">
      <p style="margin: 0; color: #6c757d; font-size: 14px; line-height: 1.6;">
        This is an automated notification from the Academic Proxy System.<br>
        Please do not reply to this email. For support, contact your system administrator.
      </p>
      <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #dee2e6;">
        <p style="margin: 0; color: #adb5bd; font-size: 12px;">
          © ${new Date().getFullYear()} Academic Proxy System. All rights reserved.
        </p>
      </div>
    </div>
    
  </div>
</body>
</html>
`

// Utility function to format details section
const getDetailsSection = (
  details: Array<{ label: string; value?: string }>
) => {
  const validDetails = details.filter((d) => d.value)
  if (validDetails.length === 0) return ""

  return `
    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 25px; margin: 25px 0; border-left: 4px solid #667eea;">
      <h3 style="color: #495057; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">
        📋 Request Details
      </h3>
      <table style="width: 100%; border-collapse: collapse;">
        ${validDetails
          .map(
            (detail) => `
          <tr>
            <td style="padding: 8px 0; color: #6c757d; font-weight: 500; width: 120px; vertical-align: top;">
              ${detail.label}:
            </td>
            <td style="padding: 8px 0; color: #495057; font-weight: 400;">
              ${detail.value}
            </td>
          </tr>
        `
          )
          .join("")}
      </table>
    </div>
  `
}

// Utility function for status badge
const getStatusBadge = (status?: string) => {
  if (!status) return ""

  const statusColors = {
    APPROVED: "#28a745",
    DECLINED: "#dc3545"
  }

  const color =
    statusColors[status.toUpperCase() as keyof typeof statusColors] || "#6c757d"

  return `
    <span style="display: inline-block; background-color: ${color}; color: #ffffff; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
      ${status}
    </span>
  `
}

export async function sendProxyEmail({
  type,
  recipients,
  fromFacultyName,
  toLecturerName,
  oldLecturerName,
  status,
  reason,
  date,
  startTime,
  endTime,
  title,
  location,
  className
}: EmailData) {
  if (!recipients || recipients.length === 0) {
    throw new Error("No recipients provided to sendProxyEmail")
  }

  if (!fromFacultyName || !toLecturerName || !startTime || !endTime) {
    throw new Error("Missing email content data")
  }

  let subject = ""
  let content = ""

  try {
    switch (type) {
      case "NEW_REQUEST":
        subject = `🔔 New Proxy Request from ${fromFacultyName}`
        content = `
        <div style="margin-bottom: 25px;">
          <h2 style="color: #495057; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">
            New Proxy Request
          </h2>
          <p style="color: #6c757d; margin: 0; font-size: 16px; line-height: 1.6;">
            Respected <strong style="color: #495057;">${toLecturerName}</strong>,
          </p>
        </div>
        
        <p style="color: #495057; font-size: 16px; line-height: 1.6; margin: 20px 0;">
          You have received a new proxy teaching request from <strong>${fromFacultyName}</strong>. 
          Please review the details below and respond at your earliest convenience.
        </p>
        
        ${getDetailsSection([
          { label: "Date", value: date },
          {
            label: "Time Slot",
            value:
              startTime && endTime ? `${startTime} - ${endTime}` : undefined
          },
          { label: "Class", value: className },
          { label: "Subject", value: title },
          { label: "Location", value: location },
          { label: "Reason", value: reason }
        ])}
  
        <div style="background-color: #e3f2fd; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #2196f3;">
            <p style="margin: 0; color: #1565c0; font-size: 14px; line-height: 1.6;">
                <strong>📌 Action Required:</strong> Please 
                <a href="https://univera.vercel.app/dashboard/time-table" style="color: #0d47a1; text-decoration: underline;">
                click here to view and respond to this proxy request
                </a> in the system.
            </p>
        </div>
        
        <p style="color: #6c757d; font-size: 16px; line-height: 1.6; margin: 25px 0 0 0;">
          Thank you for your cooperation.
        </p>
      `
        break

      case "UPDATE_LECTURER":
        subject = `📝 Proxy Request Updated From - ${fromFacultyName}`
        content = `
        <div style="margin-bottom: 25px;">
          <h2 style="color: #495057; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">
            Proxy Request Updated
          </h2>
        </div>
        
        <p style="color: #495057; font-size: 16px; line-height: 1.6; margin: 20px 0;">
          <strong>${fromFacultyName}</strong> has updated their proxy request with new lecturer assignment.
        </p>
        
        ${getDetailsSection([
          { label: "Date", value: date },
          {
            label: "Time Slot",
            value:
              startTime && endTime ? `${startTime} - ${endTime}` : undefined
          },
          { label: "Class", value: className },
          { label: "Subject", value: title },
          { label: "Location", value: location },
          { label: "Reason", value: reason }
        ])}
        
        <div style="background-color: #fff3cd; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #ffc107;">
          <h4 style="color: #856404; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">
            🔄 Lecturer Change
          </h4>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #6c757d; font-weight: 500; width: 120px;">Previous:</td>
              <td style="padding: 8px 0; color: #856404; font-weight: 500;">${oldLecturerName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6c757d; font-weight: 500;">New:</td>
              <td style="padding: 8px 0; color: #856404; font-weight: 500;">${toLecturerName}</td>
            </tr>
          </table>
        </div>
      `
        break

      case "STATUS_CHANGE":
        subject = `📋 Proxy Request ${status} - ${date}`
        content = `
        <div style="margin-bottom: 25px;">
          <h2 style="color: #495057; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">
            Request Status Update
          </h2>
        </div>
        
        <p style="color: #495057; font-size: 16px; line-height: 1.6; margin: 20px 0;">
          Your proxy request has been updated with the following status: ${getStatusBadge(status)}
        </p>
        
        ${getDetailsSection([
          { label: "Date", value: date },
          {
            label: "Time Slot",
            value:
              startTime && endTime ? `${startTime} - ${endTime}` : undefined
          },
          { label: "Class", value: className },
          { label: "Subject", value: title },
          { label: "Location", value: location },
          { label: "Requesting Faculty", value: fromFacultyName },
          { label: "Assigned Lecturer", value: toLecturerName }
        ])}
        
        ${
          status === "APPROVED"
            ? `
          <div style="background-color: #d4edda; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #28a745;">
            <p style="margin: 0; color: #155724; font-size: 14px; line-height: 1.6;">
              <strong>✅ Approved:</strong> Proxy request has been approved by the assigned lecturer - ${toLecturerName}.
            </p>
          </div>
        `
            : status === "DECLINED"
              ? `
          <div style="background-color: #f8d7da; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #dc3545;">
            <p style="margin: 0; color: #721c24; font-size: 14px; line-height: 1.6;">
              <strong>❌ Rejected:</strong> Proxy request has been declined by the assigned lecturer - ${toLecturerName}.
            </p>
          </div>
        `
              : ""
        }
      `
        break

      case "DELETE_APPROVED":
        subject = `🗑️ Approved Proxy Request Cancelled - ${date}`
        content = `
        <div style="margin-bottom: 25px;">
          <h2 style="color: #495057; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">
            Proxy Request Cancelled
          </h2>
        </div>
        
        <div style="background-color: #f8d7da; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #dc3545;">
          <p style="margin: 0; color: #721c24; font-size: 16px; line-height: 1.6; font-weight: 500;">
            ⚠️ An approved proxy request has been cancelled by <strong>${fromFacultyName}</strong>.
          </p>
        </div>
        
        ${getDetailsSection([
          { label: "Date", value: date },
          {
            label: "Time Slot",
            value:
              startTime && endTime ? `${startTime} - ${endTime}` : undefined
          },
          { label: "Class", value: className },
          { label: "Subject", value: title },
          { label: "Location", value: location }
        ])}
        
        <p style="color: #6c757d; font-size: 16px; line-height: 1.6; margin: 25px 0 0 0;">
          Please update your schedule accordingly. If you have any questions, contact the requesting faculty member directly.
        </p>
      `
        break

      default:
        console.warn("⚠️ Unknown email type:", type)
        return
    }

    const htmlContent = getEmailTemplate(content)

    await transporter.sendMail({
      from: `"Proxy System" <${process.env.EMAIL_USER}>`,
      to: recipients.join(","),
      subject,
      html: htmlContent
    })
  } catch (error: any) {
    console.error("❌ Failed to send email:", error.message)
    throw error
  }
}
