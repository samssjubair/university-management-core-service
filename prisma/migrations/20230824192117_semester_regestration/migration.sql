-- CreateEnum
CREATE TYPE "SemesterRegestrationStatus" AS ENUM ('UPCOMING', 'ONGOING', 'ENDED');

-- CreateTable
CREATE TABLE "semester_regestrations" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "SemesterRegestrationStatus" NOT NULL,
    "minCredit" INTEGER NOT NULL DEFAULT 0,
    "maxCredit" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "academicSemesterId" TEXT NOT NULL,

    CONSTRAINT "semester_regestrations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "semester_regestrations" ADD CONSTRAINT "semester_regestrations_academicSemesterId_fkey" FOREIGN KEY ("academicSemesterId") REFERENCES "academic_semesters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
