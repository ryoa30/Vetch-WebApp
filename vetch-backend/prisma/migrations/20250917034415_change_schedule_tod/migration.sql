/*
  Warnings:

  - You are about to drop the column `time_of_day` on the `schedule` table. All the data in the column will be lost.
  - Added the required column `timeOfDay` to the `schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."schedule" DROP COLUMN "time_of_day",
ADD COLUMN     "timeOfDay" TIME(0) NOT NULL;

-- CreateIndex
CREATE INDEX "schedule_vet_id_day_of_week_timeOfDay_idx" ON "public"."schedule"("vet_id", "day_of_week", "timeOfDay");
