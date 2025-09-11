/*
  Warnings:

  - You are about to drop the column `species_name` on the `species` table. All the data in the column will be lost.
  - You are about to drop the column `upload_certificate` on the `species` table. All the data in the column will be lost.
  - Added the required column `species_type_id` to the `species` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."species" DROP COLUMN "species_name",
DROP COLUMN "upload_certificate",
ADD COLUMN     "species_type_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."species_type" (
    "id" TEXT NOT NULL,
    "species_name" VARCHAR(255) NOT NULL,

    CONSTRAINT "species_type_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."species" ADD CONSTRAINT "species_species_type_id_fkey" FOREIGN KEY ("species_type_id") REFERENCES "public"."species_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;
