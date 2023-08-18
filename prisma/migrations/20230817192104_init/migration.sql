/*
  Warnings:

  - You are about to drop the column `name` on the `academic_semesters` table. All the data in the column will be lost.
  - Added the required column `year` to the `academic_semesters` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "academic_semesters" DROP COLUMN "name",
ADD COLUMN     "year" TEXT NOT NULL;
