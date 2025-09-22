/*
  Warnings:

  - You are about to drop the column `day_of_week` on the `schedule` table. All the data in the column will be lost.
  - Added the required column `day_number` to the `schedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."schedule_vet_id_day_of_week_timeOfDay_idx";

-- AlterTable
ALTER TABLE "public"."schedule" DROP COLUMN "day_of_week",
ADD COLUMN     "day_number" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "schedule_vet_id_day_number_timeOfDay_idx" ON "public"."schedule"("vet_id", "day_number", "timeOfDay");
