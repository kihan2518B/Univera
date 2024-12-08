/*
  Warnings:

  - You are about to drop the column `createdAt` on the `ChatMessage` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `credits` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Department` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Department` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Faculty` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Faculty` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Faculty` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Faculty` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Faculty` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Forum` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `University` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `University` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `_UserRoles` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hodId]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Department` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[principalId]` on the table `Department` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[adminId]` on the table `Department` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rolename]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[adminId]` on the table `University` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hodId` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalSemister` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `moderatorId` to the `Forum` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rollNo` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `semister` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `adminId` to the `University` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_UserRoles" DROP CONSTRAINT "_UserRoles_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserRoles" DROP CONSTRAINT "_UserRoles_B_fkey";

-- DropIndex
DROP INDEX "Faculty_email_key";

-- DropIndex
DROP INDEX "Student_email_key";

-- AlterTable
ALTER TABLE "ChatMessage" DROP COLUMN "createdAt",
ADD COLUMN     "attachmentUrl" JSONB[];

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "createdAt",
DROP COLUMN "credits",
DROP COLUMN "updatedAt",
ADD COLUMN     "hodId" TEXT NOT NULL,
ADD COLUMN     "totalSemister" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Department" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "adminId" TEXT,
ADD COLUMN     "principalId" TEXT;

-- AlterTable
ALTER TABLE "Faculty" DROP COLUMN "createdAt",
DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "phone",
DROP COLUMN "updatedAt",
ADD COLUMN     "achievements" JSONB[],
ADD COLUMN     "documents" JSONB[],
ADD COLUMN     "position" TEXT;

-- AlterTable
ALTER TABLE "Forum" DROP COLUMN "createdAt",
ADD COLUMN     "moderatorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "createdAt",
DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "phone",
DROP COLUMN "updatedAt",
ADD COLUMN     "documents" JSONB[],
ADD COLUMN     "gaurdianPhone" TEXT,
ADD COLUMN     "guardianEmail" TEXT,
ADD COLUMN     "mentorId" TEXT,
ADD COLUMN     "prn" TEXT,
ADD COLUMN     "rollNo" INTEGER NOT NULL,
ADD COLUMN     "semister" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "University" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "adminId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "birthPlace" TEXT,
ADD COLUMN     "caste" TEXT,
ADD COLUMN     "dob" TIMESTAMP(3),
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL;

-- DropTable
DROP TABLE "_UserRoles";

-- CreateTable
CREATE TABLE "UserRole" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NonTeachingStaff" (
    "id" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "experience" INTEGER NOT NULL,
    "documents" JSONB[],
    "departmentId" INTEGER NOT NULL,
    "universityId" INTEGER NOT NULL,

    CONSTRAINT "NonTeachingStaff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "semester" INTEGER NOT NULL,
    "code" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "universityId" INTEGER NOT NULL,
    "resultId" INTEGER NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" SERIAL NOT NULL,
    "rollNo" INTEGER NOT NULL,
    "studentId" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,
    "semister" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "universityId" INTEGER NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" SERIAL NOT NULL,
    "studentId" TEXT NOT NULL,
    "assignmentId" INTEGER NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assignment" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attachmentUrl" TEXT NOT NULL,
    "assignmentType" TEXT NOT NULL DEFAULT 'tutorial',
    "subjectId" INTEGER NOT NULL,
    "facultyId" TEXT NOT NULL,
    "courseId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "universityId" INTEGER NOT NULL,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Result" (
    "id" SERIAL NOT NULL,
    "prn" TEXT NOT NULL,
    "rollNo" INTEGER NOT NULL,
    "totalMarks" INTEGER NOT NULL,
    "obtainedMarks" INTEGER NOT NULL,
    "egp" INTEGER NOT NULL,
    "CGPA" INTEGER NOT NULL,
    "SGPA" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "universityId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "examId" INTEGER NOT NULL,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exam" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "timeTable" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "courseId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "universityId" INTEGER NOT NULL,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForumParticipant" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "forumId" INTEGER NOT NULL,

    CONSTRAINT "ForumParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "deccription" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attachments" JSONB[],
    "announcerId" TEXT NOT NULL,
    "courseId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "universityId" INTEGER NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeTable" (
    "id" SERIAL NOT NULL,
    "day" TEXT NOT NULL,
    "fromTime" TEXT NOT NULL,
    "toTime" TEXT NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "moderatorId" TEXT NOT NULL,

    CONSTRAINT "TimeTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "budget" INTEGER NOT NULL,
    "organiserId" TEXT NOT NULL,
    "universityId" INTEGER NOT NULL,
    "departmentId" INTEGER,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_faculty_to_Subject" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "NonTeachingStaff_id_key" ON "NonTeachingStaff"("id");

-- CreateIndex
CREATE UNIQUE INDEX "NonTeachingStaff_userId_key" ON "NonTeachingStaff"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_id_key" ON "Subject"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_id_key" ON "Attendance"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Submission_id_key" ON "Submission"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Assignment_id_key" ON "Assignment"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Result_id_key" ON "Result"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Exam_id_key" ON "Exam"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_faculty_to_Subject_AB_unique" ON "_faculty_to_Subject"("A", "B");

-- CreateIndex
CREATE INDEX "_faculty_to_Subject_B_index" ON "_faculty_to_Subject"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Course_id_key" ON "Course"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Course_hodId_key" ON "Course"("hodId");

-- CreateIndex
CREATE UNIQUE INDEX "Department_id_key" ON "Department"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Department_principalId_key" ON "Department"("principalId");

-- CreateIndex
CREATE UNIQUE INDEX "Department_adminId_key" ON "Department"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_rolename_key" ON "Role"("rolename");

-- CreateIndex
CREATE UNIQUE INDEX "University_adminId_key" ON "University"("adminId");

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "University" ADD CONSTRAINT "University_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NonTeachingStaff" ADD CONSTRAINT "NonTeachingStaff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NonTeachingStaff" ADD CONSTRAINT "NonTeachingStaff_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NonTeachingStaff" ADD CONSTRAINT "NonTeachingStaff_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Faculty" ADD CONSTRAINT "Faculty_clerkId_fkey" FOREIGN KEY ("clerkId") REFERENCES "User"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "Faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_clerkId_fkey" FOREIGN KEY ("clerkId") REFERENCES "User"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("clerkId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_principalId_fkey" FOREIGN KEY ("principalId") REFERENCES "User"("clerkId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_hodId_fkey" FOREIGN KEY ("hodId") REFERENCES "User"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "Result"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumParticipant" ADD CONSTRAINT "ForumParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumParticipant" ADD CONSTRAINT "ForumParticipant_forumId_fkey" FOREIGN KEY ("forumId") REFERENCES "Forum"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Forum" ADD CONSTRAINT "Forum_moderatorId_fkey" FOREIGN KEY ("moderatorId") REFERENCES "User"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_announcerId_fkey" FOREIGN KEY ("announcerId") REFERENCES "User"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeTable" ADD CONSTRAINT "TimeTable_moderatorId_fkey" FOREIGN KEY ("moderatorId") REFERENCES "Faculty"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeTable" ADD CONSTRAINT "TimeTable_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeTable" ADD CONSTRAINT "TimeTable_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeTable" ADD CONSTRAINT "TimeTable_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_organiserId_fkey" FOREIGN KEY ("organiserId") REFERENCES "User"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_faculty_to_Subject" ADD CONSTRAINT "_faculty_to_Subject_A_fkey" FOREIGN KEY ("A") REFERENCES "Faculty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_faculty_to_Subject" ADD CONSTRAINT "_faculty_to_Subject_B_fkey" FOREIGN KEY ("B") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
