import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { studentId, quizId, answers, status, marks } = body

    console.log("studentId:", studentId)
    console.log("quizId:", quizId)
    console.log("answers:", answers)
    console.log("status:", status)
    console.log("marks:", marks)
    console.log("Array.isArray(answers):", Array.isArray(answers))

    // Validate required fields
    if (
      !studentId ||
      !quizId ||
      !answers ||
      !status ||
      marks === undefined ||
      !Array.isArray(answers)
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      )
    }

    // Create submission
    const submission = await prisma.quizSubmissions.create({
      data: {
        studentId: String(studentId),
        quizId: Number(quizId),
        answers: answers.map((a) => String(a)) || [],
        status: String(status),
        marks: Number(marks)
      }
    })

    return NextResponse.json(
      {
        message: "Quiz submited successfully",
        submission
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error while quiz submission", error)
    return NextResponse.json(
      { message: "Error while quiz submission" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const quizId = searchParams.get("quizId")
  const studentId = searchParams.get("studentId")
  const route = searchParams.get("route")

  if (route === "personal") {
    if (!quizId || !studentId) {
      return NextResponse.json(
        { message: "Missing required parameters" },
        { status: 400 }
      )
    }

    try {
      const submission = await prisma.quizSubmissions.findFirst({
        where: {
          quizId: Number(quizId),
          studentId: String(studentId)
        }
      })

      if (!submission) {
        return NextResponse.json(
          { message: "No submission found" },
          { status: 404 }
        )
      }

      return NextResponse.json(submission, { status: 200 })
    } catch (error) {
      return NextResponse.json(
        { message: "Error fetching personal quiz submission", error },
        { status: 500 }
      )
    }
  } else if (route === "all") {
    try {
      const submissions = await prisma.quizSubmissions.findMany({
        where: {
          quizId: Number(quizId)
        },
        include: {
          student: {
            include: {
              user: true
            }
          },
          quiz: true
        }
      })
      return NextResponse.json(submissions, { status: 200 })
    } catch (error) {
      return NextResponse.json(
        { message: "Error fetching all quiz submissions", error },
        { status: 500 }
      )
    }
  }
}
