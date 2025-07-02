import clsx from "clsx"
import React from "react"
import toast from "react-hot-toast"
import { FiEdit } from "react-icons/fi"

interface EditableInputFieldProps {
  label: string
  placeholder: string
  value: string | number
  name: string
  className?: string
  isEditing: boolean
  disabled?: boolean
  type?: string
  isUpdateAllowed: boolean
  setEditingField: (field: string | null) => void
  isDirty?: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function EditableInputField({
  label,
  placeholder,
  value,
  name,
  className,
  isEditing,
  isUpdateAllowed,
  type,
  setEditingField,
  onChange,
  disabled,
  isDirty
}: EditableInputFieldProps) {
  const toggleEdit = () => {
    if (disabled) {
      toast.error("Can't update this field", {
        style: {
          background: "#ffc107",
          color: "#112C71"
        }
      })
      return
    }
    if (!isDirty) {
      setEditingField(isEditing ? null : name)
    }
  }

  const FieldClass = clsx(
    "w-full placeholder-gray-400 bg-transparent outline-none focus:ring-0 bg-Secondary/10 text-TextTwo/70 border-2 rounded-xl p-3",
    {
      "cursor-not-allowed text-gray-500 border-ColorOne/50": !isEditing,
      "text-Texttwo border-blue-500": isEditing
    },
    className
  )

  return (
    <div className="flex flex-col gap-2 w-full max-w-md shrink min-w-[100px]">
      <label className="block font-semibold text-Texttwo">{label}</label>
      <div
        className={clsx(
          "flex items-center rounded-md border px-3 py-2 transition-colors",
          {
            "border-blue-500 shadow-md": isEditing,
            "border-gray-300 hover:border-gray-400": !isEditing
          }
        )}
      >
        <input
          type={type ?? "text"}
          className={FieldClass}
          placeholder={placeholder}
          value={value ?? ""}
          name={name}
          disabled={!isEditing || !isUpdateAllowed}
          onChange={onChange}
        />
        {!disabled && (
          <FiEdit
            onClick={toggleEdit}
            className={clsx(
              "ml-2 cursor-pointer transition-transform transform",
              {
                "text-blue-500 hover:scale-110": isEditing,
                "text-gray-500 hover:text-gray-700 hover:scale-105": !isEditing
              }
            )}
            size={18}
          />
        )}
      </div>
      {isUpdateAllowed && isEditing && (
        <span className="text-sm text-gray-500">
          Update your {label} and submit to save.
        </span>
      )}
    </div>
  )
}

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

interface DropdownInputProps {
  label: string
  options: { value: string; label: string }[]
  value: string
  name: string
  onChange: ({ name, value }: { name: string; value: string }) => void
  disabled?: boolean
  placeholder?: string
  className?: string
  isEditing: boolean
  isDirty?: boolean
  setEditingField: (field: string | null) => void
}

export function EditableDropdownInput({
  label,
  options,
  value,
  name,
  onChange,
  disabled = false,
  isEditing,
  setEditingField,
  isDirty,
  placeholder = "Select an option",
  className
}: DropdownInputProps) {
  const handleChange = (newValue: string) => {
    if (newValue) {
      // Avoid unnecessary triggering
      onChange({ name, value: newValue })
    }
  }

  const toggleEdit = () => {
    if (disabled) {
      toast.error("Can't update this field", {
        style: {
          background: "#ffc107",
          color: "#112C71"
        }
      })
      return
    }
    if (!isDirty) {
      setEditingField(isEditing ? null : name)
    }
  }

  return (
    <div className={clsx("flex flex-col gap-2 w-full max-w-md", className)}>
      <label htmlFor={name} className="block font-semibold text-TextTwo">
        {label}
      </label>
      <div
        className={clsx(
          "flex items-center rounded-md border px-3 py-2 transition-colors",
          {
            "border-gray-300 hover:border-gray-400": !disabled,
            "border-gray-200 cursor-not-allowed bg-gray-100": disabled
          }
        )}
      >
        <Select
          value={value}
          onValueChange={handleChange}
          disabled={!isEditing}
        >
          <SelectTrigger
            className={clsx(
              `w-full bg-transparent outline-none focus:ring-0 p-6 border-2 rounded-xl text-TextTwo text-md ${
                isEditing
                  ? "border-blue-500 shadow-md"
                  : "border-ColorOne cursor-not-allowed text-gray-500 hover:text-gray-700"
              }`
            )}
          >
            <SelectValue placeholder={value ?? placeholder} />
          </SelectTrigger>
          <SelectContent
            id="select-content"
            className="bg-white shadow-lg rounded-md flex flex-col w-full overflow-auto max-h-60"
          >
            {options.map((option) => (
              <SelectItem
                className="rounded-lg hover:bg-gray-200 w-full cursor-pointer text-md text-gray-800 flex items-center"
                key={option.value}
                value={option.value}
              >
                <div className="flex items-center gap-3 hover:bg-gray-200 transition-all duration-200 max-w-full rounded-md px-2 py-2">
                  <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
                  {option.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FiEdit
          onClick={toggleEdit}
          className={clsx(
            "ml-2 cursor-pointer transition-transform transform",
            {
              "text-blue-500 hover:scale-110": isEditing,
              "text-gray-500 hover:text-gray-700 hover:scale-105": !isEditing
            }
          )}
          size={18}
        />
      </div>
    </div>
  )
}

interface DropdownInputPropstwo {
  label: string
  options: { value: string; label: string }[]
  value: string
  name: string
  onChange?: ({ name, value }: { name: string; value: string }) => void
  disabled?: boolean
  placeholder?: string
  className?: string
}

export function DropdownInput({
  label,
  options,
  value,
  name,
  onChange,
  disabled = false,
  placeholder = "Select an option",
  className
}: DropdownInputPropstwo) {
  const handleChange = (newValue: string) => {
    if (newValue) {
      // Avoid unnecessary triggering
      if (onChange) {
        onChange({ name, value: newValue })
      }
    }
  }

  return (
    <div className={clsx("flex flex-col gap-2 w-full ", className)}>
      <label htmlFor={name} className="block font-semibold text-TextTwo">
        {label}
      </label>
      <div
        className={clsx(
          "flex items-center rounded-md border px-3 py-2 transition-colors",
          {
            "border-gray-300 hover:border-gray-400": !disabled,
            "border-gray-200 cursor-not-allowed bg-gray-100": disabled
          }
        )}
      >
        <Select value={value} onValueChange={handleChange} disabled={disabled}>
          <SelectTrigger
            className={clsx(
              `w-full bg-transparent outline-none focus:ring-0 p-6 border-2 rounded-xl text-TextTwo text-md border-blue-500 shadow-md `
            )}
          >
            <SelectValue placeholder={value ?? placeholder} />
          </SelectTrigger>
          <SelectContent
            id="select-content"
            className="bg-white shadow-lg rounded-md flex flex-col w-full overflow-auto max-h-60"
          >
            {options.map((option) => (
              <SelectItem
                className="rounded-lg hover:bg-gray-200 w-full cursor-pointer text-md text-gray-800 flex items-center"
                key={option.value}
                value={option.value}
              >
                <div className="flex items-center gap-3 hover:bg-gray-200 transition-all duration-200 max-w-full rounded-md px-2 py-2">
                  <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
                  {option.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
