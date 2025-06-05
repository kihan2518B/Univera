// This would go in your backend API handler (e.g., `updateUserProfile.ts`)

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const updateUserProfile = async (
  userId: string,
  updatedFields: Record<string, any>
) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { clerkId: userId },
      data: updatedFields
    })

    return updatedUser
  } catch (error) {
    throw new Error(`Error updating user profile, ${error}`)
  }
}

const findUserData = async (userId: string) => {
  try {
    const User = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        roles: true,
        student: true,
        course: true,
        university: true,
        departmentAdmin: true,
        departmentPrincipal: true,
        Department: true,
        balances: true
      }
    })
    return User
  } catch (error) {
    throw new Error(`Error while getting user in api/(helper)/index ${error}`)
  }
}

async function getCourseById(courseId: number) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        subjects: true,
        faculties: true,
        assignment: true,
        students: true,
        hod: true,
        department: true
      }
    })
    return course
  } catch (error) {
    throw new Error(`Error while getting course in api/(helper)/index ${error}`)
  }
}
export { updateUserProfile, findUserData, getCourseById }
