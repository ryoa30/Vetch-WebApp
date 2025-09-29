/*
  Warnings:

  - Added the required column `booking_time` to the `booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."booking" ADD COLUMN     "booking_time" TIME(0) NOT NULL;
