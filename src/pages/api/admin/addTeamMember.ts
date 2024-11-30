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

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { name, email, role } = req.body

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

    const existingMember = await prisma.universityAdmin.findFirst({
      where: {
        OR: [{ email: email.toLowerCase() }]
      }
    })

    if (existingMember) {
      return res.status(400).json({
        error: "A team member with this email already exists"
      })
    }

    const teamMember = await prisma.universityAdmin.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        role
      }
    })

    res.status(201).json(teamMember)
  } catch (error: unknown) {
    const apiError = error as ApiError
    console.error("Error creating team member:", {
      message: apiError.message,
      code: apiError.code,
      details: apiError.details
    })

    res.status(500).json({
      error: "Failed to create team member",
      details: apiError.message || "An unexpected error occurred"
    })
  }
}
