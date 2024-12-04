import React, { useState, ChangeEvent, FormEvent, useEffect } from "react"
import { Submit } from "@/components/(commnon)/ButtonV1"
import { EditableInputField } from "@/components/(commnon)/EditableInputField"
import Image from "next/image"

interface ProfileProps {
  clerkUser: any
  fields: string[]
  defaults: any
  loading: boolean
  onSubmit: (updatedFields: Record<string, string>) => void
}

const initForm = {
  name: "",
  email: "",
  phone: ""
}

const Profile: React.FC<ProfileProps> = ({
  clerkUser,
  fields,
  onSubmit,
  defaults,
  loading
}) => {
  const [isDirty, setIsDirty] = useState(false)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>(initForm)

  useEffect(() => {
    if (defaults) {
      setFormData(
        fields.reduce(
          (acc, field) => {
            acc[field] = defaults[field] || ""
            return acc
          },
          {} as Record<string, string>
        )
      )
    }
  }, [defaults])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
    const defaultValue = defaults[name]

    const isEqual = (() => {
      // Handle null/undefined
      if (defaultValue === null || value === null) {
        return defaultValue === value
      }

      // Handle number/string conversion
      if (typeof defaultValue === "number" && typeof value === "string") {
        return defaultValue.toString() === value
      }

      // Default case
      return defaultValue === value
    })()
    setIsDirty(!isEqual)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingField) return

    const updatedFields = {
      [editingField]: formData[editingField]
    }

    if (formData[editingField] !== defaults[editingField]) {
      onSubmit(updatedFields)
      setIsDirty(false)
      setEditingField(null)
    } else {
      console.log("No changes detected")
    }
  }

  return (
    <div
      className="flex flex-col items-center w-full min-h-screen p-4 sm:p-10 
                 bg-white rounded-md
                 text-TextTwo transition-all duration-300"
    >
      <div className="w-full max-w-6xl">
        <div
          className="flex flex-col md:flex-row items-center md:items-start 
                     justify-between mb-10 space-y-6 md:space-y-0 
                     bg-gradient-to-br from-[#f4f5ff] to-[#e6e8f3] p-6 rounded-xl shadow-lg 
                     hover:bg-white/90 transition-all duration-300 
                     border border-Secondary"
        >
          <div className="flex flex-col items-center md:items-start">
            <h1
              className="text-2xl md:text-3xl font-extrabold mb-4 
                         text-Primary text-center md:text-left 
                         drop-shadow-md"
            >
              {defaults && defaults.name}&#39;s Profile
            </h1>
            <div
              className="relative h-28 w-28 rounded-full shadow-2xl 
                         overflow-hidden bg-ColorTwo/20 
                         transition-all duration-500 
                         hover:scale-105 hover:shadow-2xl 
                         hover:ring-4 hover:ring-ColorThree"
            >
              <Image
                src={clerkUser?.imageUrl ?? "/user.jpg"}
                className="object-cover h-full w-full transition-transform duration-300 hover:scale-110"
                height={112}
                width={112}
                alt="Profile"
                priority
              />
            </div>
          </div>
          <div
            className="text-center md:text-right text-TextTwo/80 
                       space-y-2 text-sm md:text-base"
          >
            <p className="animate-pulse text-ColorThree">
              Last Updated:{" "}
              {defaults &&
                new Date(defaults.updatedAt).toISOString().split("T")[0]}
            </p>
            <p className="text-xs md:text-sm opacity-70 text-Primary">
              Manage your personal information
            </p>
          </div>
        </div>

        <form
          className="flex flex-col gap-6 w-full bg-white 
                     p-6 rounded-2xl shadow-2xl 
                     md:gap-8 md:p-10 
                     border-2 border-Secondary 
                     hover:border-ColorThree/50 
                     transition-all duration-300"
          onSubmit={handleSubmit}
        >
          <div
            id="fields-container"
            className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
          >
            {fields.includes("name") && (
              <EditableInputField
                key={"name"}
                label={"Name"}
                placeholder={"Enter your Name"}
                name={"name"}
                value={formData["name"]}
                onChange={handleChange}
                isEditing={editingField === "name"}
                setEditingField={setEditingField}
                isDirty={isDirty}
                className="bg-Secondary/10 text-TextTwo 
                           border-2 border-ColorOne/30 
                           rounded-xl p-3 
                           focus:border-ColorThree 
                           transition-all duration-300"
              />
            )}
            {fields.includes("phone") && (
              <EditableInputField
                key={"phone"}
                label={"Phone number"}
                placeholder={"Enter your Phone number"}
                name={"phone"}
                value={formData["phone"]}
                onChange={handleChange}
                isEditing={editingField === "phone"}
                setEditingField={setEditingField}
                isDirty={isDirty}
                className="bg-Secondary/10 text-TextTwo 
                           border-2 border-ColorOne/30 
                           rounded-xl p-3 
                           focus:border-ColorThree 
                           transition-all duration-300"
              />
            )}
            {fields.includes("email") && (
              <EditableInputField
                key={"email"}
                label={"Email"}
                placeholder={"Enter your Email"}
                name={"email"}
                value={formData["email"]}
                onChange={handleChange}
                isEditing={editingField === "email"}
                disabled={true}
                setEditingField={setEditingField}
                isDirty={isDirty}
                className="bg-Secondary/10 text-TextTwo/70 
                           border-2 border-ColorOne/30 
                           rounded-xl p-3 
                           opacity-60 cursor-not-allowed"
              />
            )}
          </div>

          <div
            className="flex flex-col sm:flex-row justify-between 
                       items-center mt-6 space-y-4 sm:space-y-0"
          >
            <p
              className={`text-sm transition-colors duration-300 ${
                isDirty ? "text-ColorThree" : "text-TextTwo/50"
              }`}
            >
              {isDirty
                ? "You have unsaved changes"
                : "All information up to date"}
            </p>
            <Submit
              disabled={!isDirty}
              className={`w-full sm:w-auto px-6 py-3 font-medium 
                          rounded-xl `}
              loading={loading}
              label={isDirty ? "Save Changes" : "No Changes"}
            />
          </div>
        </form>
      </div>
    </div>
  )
}

export default Profile