"use client"
/* eslint-disable @typescript-eslint/no-unused-vars */

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
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { formSchema } from "@/helpers/FormSchema.z"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { EditableInputField } from "@/components/(commnon)/EditableInputField"
import DeleteButton from "@/components/(commnon)/DeleteButton"
import { BookOpen, Code, Calendar, ArrowLeft, Save, Trash2 } from "lucide-react"

interface CourseDetailsProps {
  user: any
  defaults: any
  courseId: any
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
  courseId
}) => {
  const [formData, setFormData] =
    useState<Record<"name" | "code" | "totalSemister", string | number>>(
      initForm
    )
  const [editingField, setEditingField] = useState<string | null>(null)
  const [isDirty, setIsDirty] = useState(false)
  const [loading, setLoading] = useState(false)
  const fields = ["name", "code", "totalSemister"]

  function handleBack() {
    router.push(`/courses`)
  }

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
      setLoading(true)
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
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-2">
          <Button
            onClick={handleBack}
            variant="ghost"
            className="flex items-center text-TextTwo hover:bg-lamaSkyLight"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back
          </Button>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              Edit Course Information
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              Update your course details. Changes will be saved automatically.
            </p>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* Course Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-base font-medium text-gray-700">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                        Course Name
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
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
                            className="pl-4 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                          />
                          {isDirty && editingField === "name" && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Course Code Field */}
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-base font-medium text-gray-700">
                        <Code className="h-4 w-4 text-green-600" />
                        Course Code
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
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
                            isDirty={isDirty}
                            className="pl-4 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                          />
                          {isDirty && editingField === "code" && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Total Semester Field */}
                <FormField
                  control={form.control}
                  name="totalSemister"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-base font-medium text-gray-700">
                        <Calendar className="h-4 w-4 text-purple-600" />
                        Total Semesters
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <EditableInputField
                            key={"totalSemister"}
                            label={"Total Semister"}
                            placeholder={"Enter total semesters of the course"}
                            name={"totalSemister"}
                            value={formData["totalSemister"]}
                            onChange={(e) => {
                              handleChange(e)
                              field.onChange(
                                e.target.value
                                  ? parseInt(e.target.value, 10)
                                  : ""
                              )
                            }}
                            isEditing={editingField === "totalSemister"}
                            setEditingField={setEditingField}
                            isDirty={isDirty}
                            className="pl-4 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                          />
                          {isDirty && editingField === "totalSemister" && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
                  <Link href="/courses">
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-lg transition-all duration-200"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to Courses
                    </Button>
                  </Link>

                  <div className="flex items-center gap-3">
                    <Button
                      type="submit"
                      disabled={!isValid || isSubmitting}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="h-4 w-4" />
                      {isSubmitting ? "Updating..." : "Update Course"}
                    </Button>

                    <DeleteButton
                      label="Delete"
                      onDelete={handleDeleteClick}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                    />
                  </div>
                </div>

                {/* Status Indicator */}
                {isDirty && (
                  <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 px-4 py-2 rounded-lg border border-orange-200">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    You have unsaved changes
                  </div>
                )}
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}
