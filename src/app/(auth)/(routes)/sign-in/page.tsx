"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

import { Loader } from "lucide-react"
import { useSignIn } from "@clerk/nextjs"
import { AlertCircle } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import OauthGoogle from "@/components/GoogleAuth"
import { ButtonV1 } from "@/components/(commnon)/ButtonV1"

interface SignInError {
  errors: Array<{ message: string }>
}

export default function SignIn() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const [emailAddress, setEmailAddress] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  if (!isLoaded) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!isLoaded) return null
    try {
      const res = await signIn.create({
        identifier: emailAddress,
        password
      })

      if (res.status === "complete") {
        await setActive({ session: res.createdSessionId })
        router.push("/dashboard")
      } else {
        console.log(JSON.stringify(res, null, 2))
      }
    } catch (err: unknown) {
      const signInError = err as SignInError
      const errorMessage =
        signInError.errors?.[0]?.message || "An error occurred during sign in"
      console.error("Error", errorMessage)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="font-literata max-h-screen h-fit  flex flex-col sm:flex-row w-full">
      {/* Main Background for small screens */}
      <div className="bottom-0 inset-0 sm:hidden z-0">
        <Image
          src={"/signin_page.png"}
          alt={"Main Background"}
          layout="fill"
          objectFit="fill"
        />
      </div>

      {/* Absolute Background behind the form */}
      <div
        id="curv-mobile-background-container"
        className="absolute z-10 sm:hidden bottom-0 max-w-full w-full h-3/5 pt-48"
      >
        <Image
          id="curv-mobile-background"
          src={"/backgrounds/Rectangle-12.png"}
          alt={"Form Background"}
          layout="fill"
          objectFit="fill"
        />
      </div>

      {/* left side - Image */}
      <div className="w-full sm:w-1/2 h-64 sm:h-screen relative max-sm:hidden bg-gray-200 order-1 sm:order-1">
        <Image
          src={"/signin_page.png"}
          alt={"University Campus"}
          height={1}
          width={1000}
          className={"w-[100%] h-full object-cover "}
        />
      </div>

      {/* Left side - Form */}
      <div
        id="form-container"
        className="max-sm:absolute relative min-h-fit max-sm:bottom-4 z-10 max-sm:h-1/2 w-full sm:w-1/2 p-6 flex items-center justify-center order-2 sm:order-2"
      >
        <Card className="w-full relative max-w-sm space-y-8 sm:p-4 md:p-8 sm:shadow-lg max-sm:shadow-none max-sm:border-0">
          <h1 className="font-literata mt-4 text-3xl max-sm:hidden font-bold text-gray-900">
            Welcome Back!
          </h1>

          <form onSubmit={submit} className="space-y-6 flex flex-col gap-3">
            <div className="space-y-4">
              <div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@university.edu.in"
                  required
                  onChange={(e) => setEmailAddress(e.target.value)}
                  className="bg-[#E7E7FF] rounded-full"
                />
              </div>

              <div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#E7E7FF] rounded-full"
                />
              </div>
            </div>
            {error && (
              <Alert
                variant="destructive"
                className="flex items-center space-x-2 text-sm p-2"
              >
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
                  <AlertDescription className="leading-tight">
                    {error}
                  </AlertDescription>
                </div>
              </Alert>
            )}
            <div
              id="signin-form-button-container"
              className="gap-2 flex flex-col items-center justify-center"
            >
              <ButtonV1
                id="sign-in-submit"
                icon={null}
                loading={isLoading}
                type="submit"
                label="Sign In"
                className="w-full bg-[#5b58eb] hover:bg-[#112c71] text-white rounded-full"
              />

              <div className="text-center text-sm">
                <span className="text-gray-600">Create new account? </span>
                <Link href="/sign-up" className="text-blue-600 hover:underline">
                  Sign up
                </Link>
              </div>

              <div className="relative flex justify-center items-center text-sm">
                <hr className="text-[#112C71] absolute max-sm:hidden border border-[#112C71] w-full bottom-[50%] z-10" />
                <span className="px-2 text-[#112C71] sm:bg-white z-20">
                  Or continue with
                </span>
              </div>

              <OauthGoogle isSignup={false} />
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
