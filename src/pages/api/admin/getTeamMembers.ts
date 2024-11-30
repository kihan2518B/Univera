import { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/lib/prisma"
import { getAuth } from "@clerk/nextjs/server"

interface ApiError extends Error {
  code?: string
  details?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req)
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  if (req.method === "GET") {
    try {
      const teamMembers = await prisma.universityAdmin.findMany()
      res.status(200).json(teamMembers)
    } catch (_err: unknown) {
      const apiError = _err as ApiError
      console.error("Error fetching team members:", {
        message: apiError.message,
        code: apiError.code,
        details: apiError.details
      })
      res.status(500).json({
        error: "Failed to fetch team members",
        details: apiError.message || "An unexpected error occurred"
      })
    }
  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}
