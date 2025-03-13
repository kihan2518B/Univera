import { NextRequest } from "next/server"
import prisma from "@/lib/prisma"

export async function PATCH(req: NextRequest) {
  try {
    const { title, subjectId, file, uploadedBy, subjectName } = await req.json() // Parse request body

    if (
      !title ||
      !subjectId ||
      !file ||
      !uploadedBy ||
      !subjectName ||
      file.length === 0
    ) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      )
    }

    const updatedSubject = await prisma.subject.update({
      where: { id: Number(subjectId) },
      data: {
        syllabus: {
          push: {
            title,
            subjectName,
            uploadedBy,
            link: file[0].url
          }
        }
      }
    })

    return new Response(
      JSON.stringify({
        message: "Syllabus uploaded successfully",
        subject: updatedSubject
      }),
      {
        status: 200
      }
    )
  } catch (error) {
    console.error("Error uploading syllabus:", error)
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500
    })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userSubjectIdsParam = searchParams.get("userSubjectIds")

    if (!userSubjectIdsParam) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      )
    }

    // Parse the subject IDs from the query parameter
    const userSubjectIds = JSON.parse(userSubjectIdsParam).map(Number)

    if (userSubjectIds.length === 0) {
      return new Response(
        JSON.stringify({ syllabus: [], message: "No subjects found" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      )
    }

    const subjects = await prisma.subject.findMany({
      where: {
        id: { in: userSubjectIds }
      },
      select: {
        id: true,
        syllabus: true,
        name: true // Optional: include subject name for additional context
      }
    })

    // Flatten syllabus from all subjects
    const syllabus = subjects.flatMap((subject) =>
      (subject.syllabus as any[]).map((syl, index) => ({
        ...syl,
        id: `${subject.id}-${index}`
      }))
    )

    return new Response(
      JSON.stringify({
        syllabus,
        message: "Syllabus fetched successfully"
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    )
  } catch (error) {
    console.error("Error fetching syllabus:", error)
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500
    })
  }
}
