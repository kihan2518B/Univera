import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { google } from "@ai-sdk/google"
import { streamObject } from "ai"
import { quizSchema } from "@/lib/schemas"

export async function POST(req: Request) {
  try {
    const user = await currentUser()

    if (!user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // Parse multipart form data
    const body = await req.json()
    const {
      title,
      description,
      duration,
      tags,
      classId,
      subjectId,
      departmentId,
      universityId,
      file,
      enableTimeCustomization,
      date,
      fromTime,
      toTime
    } = body

    if (
      !title ||
      !duration ||
      !tags ||
      !classId ||
      !subjectId ||
      !departmentId ||
      !universityId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (enableTimeCustomization && fromTime && toTime) {
      const fromDateTime = new Date(`1970-01-01T${fromTime}`)
      const toDateTime = new Date(`1970-01-01T${toTime}`)

      // Calculate difference in minutes
      const timeDifferenceInMinutes =
        (toDateTime.getTime() - fromDateTime.getTime()) / (1000 * 60)

      if (timeDifferenceInMinutes < duration) {
        return NextResponse.json(
          {
            error:
              "Time slot duration must be equal to or greater than quiz duration"
          },
          { status: 400 }
        )
      }
    }
    const firstFile = file.data
    let AIQuestions: any[] = []
    const result = await streamObject({
      model: google("gemini-2.0-flash"),
      messages: [
        {
          role: "system",
          content: `
        You are an expert educator and assessment designer.
        
        Your task is to carefully read the uploaded document and generate a multiple-choice quiz **strictly following the given schema**. Ensure the quiz is aligned with the estimated time duration provided by the user. Adjust difficulty and number of questions based on this duration.
        
        Each quiz question should include:
        - A clear and concise 'title' for the question.
        - An optional 'description' (if helpful) to provide context or clarification.
        - A list of 4 answer 'options', all of similar length and plausibility.
        - The index of the 'correctAnswer' in the options array (0-based).
        - A reasonable 'marks' value for each question, balanced across the test.
        
        Follow this output format for each question (JSON array element):
        {
          title: string,
          description?: string,
          options: string[4],
          correctAnswer: number,
          marks: number
        }
        
        Ensure:
        - Output is a **valid JSON array** matching the schema.
        - Options are diverse but plausible.
        - The total difficulty matches the test duration.
        - There are **no explanations or extra text** — only valid JSON objects as per schema.
        
        Example (single item):
        {
          "title": "What is the capital of France?",
          "description": null,
          "options": ["Berlin", "Paris", "Madrid", "Rome"],
          "correctAnswer": 1,
          "marks": 2
        }
        `
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Create a multiple choice test based on this document. The duration of the test is ${duration} minutes. Adjust the number of questions and their difficulty accordingly.`
            },
            {
              type: "file",
              data: firstFile,
              mimeType: "application/pdf"
            }
          ]
        }
      ],
      schema: quizSchema,
      output: "array"
    })
    for await (const chunk of result.fullStream) {
      if (chunk.type === "object") {
        AIQuestions = chunk.object // Accumulate the final object
      }
    }
    console.log("Quiz created")
    if (!AIQuestions || AIQuestions[0].length === 0) {
      throw new Error("No questions generated by AI")
    }

    const totalMarks = AIQuestions[0].reduce(
      (sum: number, q: any) => sum + q.marks,
      0
    )
    const prismaUser = await prisma.user.findUnique({
      where: {
        id: user.id
      }
    })
    // Store quiz in database
    const quiz = await prisma.quiz.create({
      data: {
        title: title,
        description: description,
        documentUrl: "document Url", // Store file name or upload to cloud storage
        tags: tags,
        createdByName: prismaUser?.name || "User", // Replace with actual user name from auth
        creatorId: user.id,
        duration: duration,
        numberOfQuestions: AIQuestions[0].length,
        totalMarks: totalMarks,
        visibility: "public",
        status: "draft",
        classId: Number(classId),
        subjectId: Number(subjectId),
        date: date.split("T")[0],
        departmentId: Number(departmentId),
        universityId: Number(universityId),
        from: enableTimeCustomization ? fromTime : null,
        to: enableTimeCustomization ? (toTime ?? null) : null
      }
    })
    const questionsData = AIQuestions[0].map((q: any) => ({
      title: q.title,
      description: q.description || null,
      options: q.options,
      correctAnswer: q.correctAnswer,
      marks: q.marks,
      quizId: quiz.id
    }))

    await prisma.question.createMany({
      data: questionsData
    })

    return NextResponse.json(
      { message: "Successfully generated", quiz },
      { status: 201 }
    )
  } catch (error) {
    console.log(
      "Error while generating quiz @/api/classes/my-class/[classId]/quizzes",
      error
    )
    return NextResponse.json(
      { message: "Failed to generate quiz" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request, context: any) {
  const user = await currentUser()
  const { classId } = await context.params
  if (!user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const quizzes = await prisma.quiz.findMany({
      where: { classId: Number(classId) },
      include: { questions: true },
      orderBy: { date: "desc" }
    })

    return NextResponse.json(
      { message: "quiz found successfully", quizzes },
      { status: 200 }
    )
  } catch (error) {
    console.log(
      "Error while fetching quiz @/api/classes/my-class/[classId]/quizzes",
      error
    )
    return NextResponse.json(
      { message: "Failed to fetch quiz" },
      { status: 500 }
    )
  }
}
