/*
  Warnings:

  - You are about to drop the `offered_course_schedules` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "offered_course_schedules" DROP CONSTRAINT "offered_course_schedules_facultyId_fkey";

-- DropForeignKey
ALTER TABLE "offered_course_schedules" DROP CONSTRAINT "offered_course_schedules_offeredCourseSectionId_fkey";

-- DropForeignKey
ALTER TABLE "offered_course_schedules" DROP CONSTRAINT "offered_course_schedules_roomId_fkey";

-- DropTable
DROP TABLE "offered_course_schedules";

-- CreateTable
CREATE TABLE "offered_course_class_schedules" (
    "id" TEXT NOT NULL,
    "dayOfWeek" "WeekDays" NOT NULL DEFAULT 'SATURDAY',
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "offeredCourseSectionId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,

    CONSTRAINT "offered_course_class_schedules_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "offered_course_class_schedules" ADD CONSTRAINT "offered_course_class_schedules_offeredCourseSectionId_fkey" FOREIGN KEY ("offeredCourseSectionId") REFERENCES "offered_course_sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offered_course_class_schedules" ADD CONSTRAINT "offered_course_class_schedules_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offered_course_class_schedules" ADD CONSTRAINT "offered_course_class_schedules_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "faculties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
