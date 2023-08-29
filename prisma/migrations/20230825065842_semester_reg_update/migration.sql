/*
  Warnings:

  - You are about to drop the `semester_regestrations` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "SemesterRegistrationStatus" AS ENUM ('UPCOMING', 'ONGOING', 'ENDED');

-- DropForeignKey
ALTER TABLE "semester_regestrations" DROP CONSTRAINT "semester_regestrations_academicSemesterId_fkey";

-- DropTable
DROP TABLE "semester_regestrations";

-- DropEnum
DROP TYPE "SemesterRegestrationStatus";

-- CreateTable
CREATE TABLE "semester_registrations" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "SemesterRegistrationStatus" NOT NULL DEFAULT 'UPCOMING',
    "minCredit" INTEGER NOT NULL DEFAULT 0,
    "maxCredit" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "academicSemesterId" TEXT NOT NULL,

    CONSTRAINT "semester_registrations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "semester_registrations" ADD CONSTRAINT "semester_registrations_academicSemesterId_fkey" FOREIGN KEY ("academicSemesterId") REFERENCES "academic_semesters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
