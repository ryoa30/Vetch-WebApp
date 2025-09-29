/*
  Warnings:

  - Added the required column `is_avail_emergency` to the `vet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_avail_homecare` to the `vet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."vet" ADD COLUMN     "is_avail_emergency" BOOLEAN NOT NULL,
ADD COLUMN     "is_avail_homecare" BOOLEAN NOT NULL;
