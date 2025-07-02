"use client"

import React, { ChangeEvent, useEffect, useState } from "react"
import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form"
import { formSchema } from "@/helpers/FormSchema.z"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { EditableInputField } from "@/components/(commnon)/EditableInputField"
import DeleteButton from "@/components/(commnon)/DeleteButton"
import { ArrowLeft } from "lucide-react"

interface CourseDetailsProps {
  user: any
  defaults: any
  courseId: any
  isUpdateAllowed: boolean
}
//Schema
const initForm = {
  name: "",
  code: "",
  totalSemister: 0
}

export const CourseDetials: React.FC<CourseDetailsProps> = ({
  defaults,
  user,
  courseId,
  isUpdateAllowed
}) => {
  const [formData, setFormData] =
    useState<Record<"name" | "code" | "totalSemister", string | number>>(
      initForm
    )
  const [editingField, setEditingField] = useState<string | null>(null)
  const [isDirty, setIsDirty] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const fields = ["name", "code", "totalSemister"]

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
        totalSemister: defaults.totalSemister || 0
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
    setIsDeleting(true)
    try {
      const res = await axios.delete(
        `/api/courses/${courseId}?courseId=${courseId}`
      )
      if (res.status === 200) {
        toast.success(res.data.message)
        router.push(`/courses`)
      } else {
        toast.success(res.data.message)
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Something went wrong")
      } else {
        toast.error("An unexpected error occurred")
      }
    } finally {
      setIsDeleting(false)
    }
  }
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "",
      totalSemister: 0
    }
  })

  const { isSubmitting, isValid } = form.formState
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error("User not authenticated")
      return
    }
    const payload = {
      updatedcourse: values,
      userId: user.id,
      department: user?.Department
    }

    try {
      const response = await axios.patch(
        `/api/courses/${courseId}?courseId=${courseId}`,
        payload
      )
      if (response.status == 200) {
        toast.success(response.data.message)
        router.push(`/courses`)
        setIsDirty(false)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Something went wrong")
      } else {
        toast.error("An unexpected error occurred")
      }
    }
  }

  return (
    <>
      <div className="ml-2 px-2 py-1 rounded w-fit border border-Dark">
        <Link href={"/courses"} className="flex items-center text-TextTwo ">
          <ArrowLeft size={18} className="mr-2" />
          Back
        </Link>
      </div>
      <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
        <div>
          <h1 className="text-2xl">Course Details</h1>
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
                    <FormControl>
                      <EditableInputField
                        key={"name"}
                        label={"Course Name"}
                        placeholder={"Enter your Course Name"}
                        name={"name"}
                        value={formData["name"] as string}
                        onChange={(e) => {
                          handleChange(e)
                          field.onChange(e)
                        }}
                        isEditing={editingField === "name"}
                        setEditingField={setEditingField}
                        isDirty={isDirty}
                        isUpdateAllowed={isUpdateAllowed}
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
                    <FormControl>
                      <EditableInputField
                        key={"code"}
                        label={"Course Code"}
                        placeholder={"Enter your Course Code"}
                        name={"code"}
                        value={formData["code"] as string}
                        onChange={(e) => {
                          handleChange(e)
                          field.onChange(e)
                        }}
                        isEditing={editingField === "code"}
                        setEditingField={setEditingField}
                        isUpdateAllowed={isUpdateAllowed}
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
                name="totalSemister"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <EditableInputField
                        key={"totalSemister"}
                        label={"Total Semister"}
                        placeholder={"Enter total sem of the course"}
                        name={"totalSemister"}
                        value={formData["totalSemister"]}
                        onChange={(e) => {
                          handleChange(e)
                          field.onChange(
                            e.target.value ? parseInt(e.target.value, 10) : ""
                          )
                        }}
                        isEditing={editingField === "totalSemister"}
                        setEditingField={setEditingField}
                        isDirty={isDirty}
                        isUpdateAllowed={isUpdateAllowed}
                        className=""
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isUpdateAllowed && (
                <div className="flex items-center gap-x-2">
                  <Link href="/courses">
                    <Button type="button" variant="ghost">
                      Cancel
                    </Button>
                  </Link>
                  {/* <Link href='/'> */}
                  <Button type="submit" disabled={!isValid || isSubmitting}>
                    Update
                  </Button>
                  <DeleteButton
                    label="Delete"
                    onDelete={handleDeleteClick}
                    isDeleting={isDeleting}
                  />
                  {/* </Link> */}
                </div>
              )}
            </form>
          </Form>
        </div>
      </div>
    </>
  )
}
