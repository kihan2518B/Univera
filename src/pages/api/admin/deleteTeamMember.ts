import { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/lib/prisma"
import { getAuth } from "@clerk/nextjs/server"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req)
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { id } = req.query

    if (!id) {
      return res.status(400).json({ error: "Missing team member ID" })
    }

    const teamMember = await prisma.universityAdmin.findUnique({
      where: { id: String(id) }
    })

    if (!teamMember) {
      return res.status(404).json({ error: "Team member not found" })
    }

    await prisma.universityAdmin.delete({
      where: { id: String(id) }
    })

    res.status(200).json({ message: "Team member deleted successfully" })
  } catch (error) {
    console.error("Error deleting team member:", error)
    res.status(500).json({ error: "Failed to delete team member" })
  }
}
