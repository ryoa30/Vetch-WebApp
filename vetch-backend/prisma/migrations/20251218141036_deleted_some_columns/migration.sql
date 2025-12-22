/*
  Warnings:

  - You are about to drop the column `reminder_consultation` on the `pet` table. All the data in the column will be lost.
  - You are about to drop the column `reminder_vaccine` on the `pet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."pet" DROP COLUMN "reminder_consultation",
DROP COLUMN "reminder_vaccine";
