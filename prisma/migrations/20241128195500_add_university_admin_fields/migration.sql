/*
  Warnings:

  - You are about to drop the column `createdAt` on the `UniversityAdmin` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `UniversityAdmin` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UniversityAdmin" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";
