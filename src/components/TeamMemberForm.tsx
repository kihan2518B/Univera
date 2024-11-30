import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { addTeamMember, updateTeamMember } from "@/services/teamServices"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, X } from "lucide-react"
import { AdminRole } from "@/types/teamMember"
import toast from "react-hot-toast"

const roleOptions: AdminRole[] = [
  "Department Head",
  "Program Coordinator",
  "Administrative Staff",
  "System Administrator"
]

interface TeamMemberFormProps {
  member?: {
    id: string
    name: string
    email: string
    role: AdminRole
  } | null
  onClose: () => void
  onRefresh: (action: "add" | "update") => void
}

type ValidationErrors = {
  name?: string
  email?: string
  role?: string
}

type FieldValidationResult = {
  isValid: boolean
  error: string
}

export default function TeamMemberForm({
  member,
  onClose,
  onRefresh
}: TeamMemberFormProps) {
  const [formData, setFormData] = useState({
    name: member?.name || "",
    email: member?.email || "",
    role: member?.role || ("Administrative Staff" as AdminRole)
  })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const validateField = (
    name: string,
    value: string
  ): FieldValidationResult => {
    switch (name) {
      case "name": {
        if (!value.trim()) return { isValid: false, error: "Name is required" }
        if (value.length < 2)
          return { isValid: false, error: "Name must be at least 2 characters" }
        if (value.length > 50)
          return {
            isValid: false,
            error: "Name must be less than 50 characters"
          }
        return { isValid: true, error: "" }
      }
      case "email": {
        if (!value) return { isValid: false, error: "Email is required" }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value))
          return { isValid: false, error: "Invalid email format" }
        return { isValid: true, error: "" }
      }
      case "role": {
        if (!value) return { isValid: false, error: "Role is required" }
        if (!roleOptions.includes(value as AdminRole))
          return { isValid: false, error: "Invalid role" }
        return { isValid: true, error: "" }
      }
      default:
        return { isValid: true, error: "" }
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    const { error: fieldError } = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: fieldError }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const validationErrors: ValidationErrors = {}
    let isValid = true

    Object.entries(formData).forEach(([key, value]) => {
      const { isValid: fieldIsValid, error: fieldError } = validateField(
        key,
        value
      )
      if (!fieldIsValid) {
        validationErrors[key as keyof ValidationErrors] = fieldError
        isValid = false
      }
    })

    if (!isValid) {
      setErrors(validationErrors)
      return
    }

    const loadingToast = toast.loading(
      member ? "Updating team member..." : "Adding team member..."
    )

    try {
      setIsLoading(true)
      if (member) {
        await updateTeamMember(member.id, formData)
        onRefresh("update")
      } else {
        await addTeamMember(formData)
        onRefresh("add")
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      toast.error(errorMessage, { id: loadingToast })
    } finally {
      setIsLoading(false)
      toast.dismiss(loadingToast)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl transform transition-all ease-in-out duration-300 scale-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {member ? "Edit Team Member" : "Add Team Member"}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5 text-gray-500" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
                className={`w-full transition-all duration-200 ${
                  errors.name
                    ? "border-red-500 focus-visible:ring-red-500"
                    : "focus-visible:ring-indigo-500"
                }`}
                disabled={isLoading}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                type="email"
                required
                className={`w-full transition-all duration-200 ${
                  errors.email
                    ? "border-red-500 focus-visible:ring-red-500"
                    : "focus-visible:ring-indigo-500"
                }`}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full h-10 rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 ${
                  errors.role ? "border-red-500" : ""
                }`}
                required
                disabled={isLoading}
              >
                {roleOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p className="mt-1 text-xs text-red-500">{errors.role}</p>
              )}
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || Object.keys(errors).length > 0}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isLoading ? "Processing..." : member ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
