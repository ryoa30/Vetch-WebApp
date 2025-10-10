/*
  Warnings:

  - A unique constraint covering the columns `[booking_id]` on the table `rating` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `booking_id` to the `rating` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."rating" ADD COLUMN     "booking_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "rating_booking_id_key" ON "public"."rating"("booking_id");

-- AddForeignKey
ALTER TABLE "public"."rating" ADD CONSTRAINT "rating_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "public"."booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
