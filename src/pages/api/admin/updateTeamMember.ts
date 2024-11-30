import { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/lib/prisma"
import { getAuth } from "@clerk/nextjs/server"
import { AdminRole } from "@/types/teamMember"

interface ApiError extends Error {
  code?: string
  details?: string
}

const validRoles: AdminRole[] = [
  "Department Head",
  "Program Coordinator",
  "Administrative Staff",
  "System Administrator"
]

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req)
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { id } = req.query
    const { name, email, role } = req.body

    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Invalid team member ID" })
    }

    if (!name?.trim()) {
      return res.status(400).json({ error: "Name is required" })
    }

    if (name.length < 2 || name.length > 50) {
      return res.status(400).json({
        error: "Name must be between 2 and 50 characters"
      })
    }

    if (!email?.trim()) {
      return res.status(400).json({ error: "Email is required" })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" })
    }

    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role" })
    }

    const existingMember = await prisma.universityAdmin.findUnique({
      where: { id }
    })

    if (!existingMember) {
      return res.status(404).json({ error: "Team member not found" })
    }

    const emailConflict = await prisma.universityAdmin.findFirst({
      where: {
        email: email.toLowerCase(),
        NOT: { id }
      }
    })

    if (emailConflict) {
      return res.status(400).json({
        error: "This email is already in use by another team member"
      })
    }

    const updatedMember = await prisma.universityAdmin.update({
      where: { id },
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        role
      }
    })

    res.status(200).json(updatedMember)
  } catch (error: unknown) {
    const apiError = error as ApiError
    console.error("Error updating team member:", {
      message: apiError.message,
      code: apiError.code,
      details: apiError.details
    })

    res.status(500).json({
      error: "Failed to update team member",
      details: apiError.message || "An unexpected error occurred"
    })
  }
}
