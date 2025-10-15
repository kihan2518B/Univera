"use client"
import React, { useContext } from "react"
import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { formSchema } from "@/helpers/FormSchema.z"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { UserContext } from "@/context/user"
import { ArrowLeft } from "lucide-react"

const CreatePage = () => {
  const { user } = useContext(UserContext)
  const router = useRouter()

  function handleBack() {
    router.push(`/courses`)
  }

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
      ...values,
      userId: user.id, // Clerk's user ID
      department: user?.Department
    }

    try {
      const res = await axios.post(`/api/courses`, payload)
      if (res.status === 200) {
        toast.success(res.data.message)
        router.push(`/courses`)
      } else {
        toast.error(res.data.message)
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Course Information
                </h2>
                <p className="text-blue-100 text-sm mt-1">
                  Don&apos;t worry, you can change these details later
                </p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
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
                      <FormLabel className="text-base font-medium text-gray-900 flex items-center">
                        <svg
                          className="w-4 h-4 mr-2 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                        Course Name
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="pl-4 pr-4 py-3 text-base border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                            placeholder="e.g 'BTech CSE'"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-sm text-gray-600">
                        What will you teach in this course?
                      </FormDescription>
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
                      <FormLabel className="text-base font-medium text-gray-900 flex items-center">
                        <svg
                          className="w-4 h-4 mr-2 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                          />
                        </svg>
                        Course Code
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="pl-4 pr-4 py-3 text-base border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                            placeholder="e.g 'CSE I'"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-sm text-gray-600">
                        What is the code of this course?
                      </FormDescription>
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
                      <FormLabel className="text-base font-medium text-gray-900 flex items-center">
                        <svg
                          className="w-4 h-4 mr-2 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                        Total Semesters
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="string"
                            className="pl-4 pr-4 py-3 text-base border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                            placeholder="e.g '4'"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseInt(e.target.value, 10)
                                  : ""
                              )
                            }
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-sm text-gray-600">
                        How many semesters does this course have?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <Link href="/courses">
                    <Button
                      type="button"
                      variant="ghost"
                      className="px-6 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Cancel
                    </Button>
                  </Link>

                  <Button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className={`px-8 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Course...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                        Continue
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePage
