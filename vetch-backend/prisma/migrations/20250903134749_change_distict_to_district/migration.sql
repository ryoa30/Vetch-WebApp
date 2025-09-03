/*
  Warnings:

  - You are about to drop the column `distict` on the `location` table. All the data in the column will be lost.
  - Added the required column `district` to the `location` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."location" DROP COLUMN "distict",
ADD COLUMN     "district" VARCHAR(65) NOT NULL;
