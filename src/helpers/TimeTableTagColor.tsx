import { BookOpen, FlaskConical, Users, Coffee } from "lucide-react"

// Helper functions for styling
export const getBackgroundColor = (tag: string) => {
  switch (tag) {
    case "lecture":
      return "#E3F2FD" // Soft blue
    case "lab":
      return "#F3E5F5" // Soft purple
    case "seminar":
      return "#FFF8E1" // Soft yellow
    case "break":
      return "#CBF5CB" // Soft Blue Romance
    default:
      return "#ffffff" // White
  }
}

export const getBorderColor = (tag: string) => {
  switch (tag) {
    case "lecture":
      return "#90CAF9" // Darker blue border
    case "lab":
      return "#CE93D8" // Darker purple border
    case "seminar":
      return "#FFE082" // Darker yellow border
    case "break":
      return "#7BE37B" // Darker paster green
    default:
      return "#e5e7eb" // Default gray border
  }
}

export const getTagClass = (tag: string) => {
  switch (tag) {
    case "lecture":
      return "bg-blue-100 text-blue-800"
    case "lab":
      return "bg-purple-100 text-purple-800"
    case "seminar":
      return "bg-amber-100 text-amber-800"
    case "break":
      return "bg-green-100 text-green-900"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

// Function to render appropriate icons based on slot type
export const getIconForTag = (tag: string) => {
  switch (tag) {
    case "lecture":
      return <BookOpen size={40} className="text-blue-300" />
    case "lab":
      return <FlaskConical size={40} className="text-purple-300" />
    case "seminar":
      return <Users size={40} className="text-amber-300" />
    case "break":
      return <Coffee size={40} className="text-green-300" />
    default:
      return null
  }
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "bg-green-100 text-green-800 border-green-200"
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "DECLINED":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}
