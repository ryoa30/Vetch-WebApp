-- AlterTable
ALTER TABLE "public"."location" ADD COLUMN     "coordinates" VARCHAR(65) NOT NULL DEFAULT '0,0';

-- AlterTable
ALTER TABLE "public"."vet" ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;
