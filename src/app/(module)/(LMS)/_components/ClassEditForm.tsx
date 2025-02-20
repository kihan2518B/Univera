"use client"
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { ChangeEvent, useEffect, useState } from "react"
import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { CourseFormSkeleton } from "@/components/(commnon)/Skeleton"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { EditableInputField } from "@/components/(commnon)/EditableInputField"
import DeleteButton from "@/components/(commnon)/DeleteButton"
import { classSchema } from "@/helpers/classSchema.z"

interface ClassDetailsProps {
  user: any
  defaults: any
  classId: any
  isLoading?: boolean
}
//Schema
const initForm = {
  name: "",
  code: "",
  semister: 0
}

export const ClassEditForm: React.FC<ClassDetailsProps> = ({
  defaults,
  user,
  classId,
  isLoading
}) => {
  const [formData, setFormData] =
    useState<Record<"name" | "code" | "semister", string | number>>(initForm)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [isDirty, setIsDirty] = useState(false)
  const fields = ["name", "code", "semister"]
  const [isDeleting, setIsDeleting] = useState(false)

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
      // Update React Hook Form's values
      form.reset({
        name: defaults.name || "",
        code: defaults.code || "",
        semister: defaults.semister || 0
      })
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
  async function handleDeleteClick() {
    try {
      setIsDeleting(true)
      const res = await axios.delete(`/api/classes/${classId}`)
      if (res.status === 200) {
        toast.success(res.data.message)
        router.push(`/classes`)
      }
    } catch (error) {
      toast.error("Internal server error")
    } finally {
      setIsDeleting(false)
    }
  }
  const router = useRouter()
  const form = useForm<z.infer<typeof classSchema>>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      name: "",
      code: "",
      semister: 0
    }
  })

  const { isSubmitting, isValid } = form.formState
  const onSubmit = async (values: z.infer<typeof classSchema>) => {
    if (!user) {
      toast.error("User not authenticated")
      return
    }
    const payload = {
      updatedClass: values,
      userId: user.id,
      department: user?.Department
    }

    try {
      const response = await axios.patch(`/api/classes/${classId}`, payload)
      if (response.status !== 200) {
        throw new Error("Error while updating class")
      }
      router.push(`/classes`)
      setIsDirty(false)
      toast.success(response.data.message)
    } catch (e) {
      toast.error("Something went wrong")
    }
  }

  return (
    <div className=" mx-auto flex md:items-center md:justify-center h-full p-6">
      <h1 className="text-2xl"></h1>
      {isLoading ? (
        <CourseFormSkeleton />
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Edit Class Details</FormLabel>
                  <FormControl>
                    <EditableInputField
                      key={"name"}
                      label={"Class Name"}
                      placeholder={"Enter your Class Name"}
                      name={"name"}
                      value={formData["name"] as string}
                      onChange={(e) => {
                        handleChange(e)
                        field.onChange(e)
                      }}
                      isEditing={editingField === "name"}
                      setEditingField={setEditingField}
                      isDirty={isDirty}
                      className=""
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Code</FormLabel>
                  <FormControl>
                    <EditableInputField
                      key={"code"}
                      label={"Class Code"}
                      placeholder={"Enter your Class Code"}
                      name={"code"}
                      value={formData["code"] as string}
                      onChange={(e) => {
                        handleChange(e)
                        field.onChange(e)
                      }}
                      isEditing={editingField === "code"}
                      setEditingField={setEditingField}
                      isDirty={isDirty}
                      className=""
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="semister"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Semister</FormLabel>
                  <FormControl>
                    <EditableInputField
                      key={"semister"}
                      label={"Total Semister"}
                      placeholder={"Enter total sem of the Class"}
                      name={"semister"}
                      value={formData["semister"]}
                      onChange={(e) => {
                        handleChange(e)
                        field.onChange(
                          e.target.value ? parseInt(e.target.value, 10) : ""
                        )
                      }}
                      isEditing={editingField === "semister"}
                      setEditingField={setEditingField}
                      isDirty={isDirty}
                      className=""
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Link href="/classes">
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Link>
              {/* <Link href='/'> */}
              <Button type="submit" disabled={!isValid || isSubmitting}>
                {isSubmitting ? "Updating..." : "Update"}
              </Button>
              <DeleteButton
                label={isDeleting ? "Deleting..." : "Delete"}
                onDelete={handleDeleteClick}
              />
              {/* </Link> */}
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}
