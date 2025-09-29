/*
  Warnings:

  - Added the required column `distict` to the `location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `urban_village` to the `location` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."blog" DROP CONSTRAINT "blog_category_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."booking" DROP CONSTRAINT "booking_location_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."booking" DROP CONSTRAINT "booking_pet_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."booking" DROP CONSTRAINT "booking_vet_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."chat" DROP CONSTRAINT "chat_pet_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."chat" DROP CONSTRAINT "chat_vet_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."concern_detail" DROP CONSTRAINT "concern_detail_booking_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."concern_detail" DROP CONSTRAINT "concern_detail_concern_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."location" DROP CONSTRAINT "location_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."payment" DROP CONSTRAINT "payment_booking_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."pet" DROP CONSTRAINT "pet_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."rating" DROP CONSTRAINT "rating_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."rating" DROP CONSTRAINT "rating_vet_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."schedule" DROP CONSTRAINT "schedule_vet_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."species" DROP CONSTRAINT "species_vet_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."vet" DROP CONSTRAINT "vet_user_id_fkey";

-- AlterTable
ALTER TABLE "public"."location" ADD COLUMN     "distict" VARCHAR(65) NOT NULL,
ADD COLUMN     "urban_village" VARCHAR(65) NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."vet" ADD CONSTRAINT "vet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."location" ADD CONSTRAINT "location_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pet" ADD CONSTRAINT "pet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."species" ADD CONSTRAINT "species_vet_id_fkey" FOREIGN KEY ("vet_id") REFERENCES "public"."vet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."booking" ADD CONSTRAINT "booking_vet_id_fkey" FOREIGN KEY ("vet_id") REFERENCES "public"."vet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."booking" ADD CONSTRAINT "booking_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "public"."pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."booking" ADD CONSTRAINT "booking_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "public"."location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payment" ADD CONSTRAINT "payment_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "public"."booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."concern_detail" ADD CONSTRAINT "concern_detail_concern_id_fkey" FOREIGN KEY ("concern_id") REFERENCES "public"."concern_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."concern_detail" ADD CONSTRAINT "concern_detail_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "public"."booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."rating" ADD CONSTRAINT "rating_vet_id_fkey" FOREIGN KEY ("vet_id") REFERENCES "public"."vet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."rating" ADD CONSTRAINT "rating_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blog" ADD CONSTRAINT "blog_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chat" ADD CONSTRAINT "chat_vet_id_fkey" FOREIGN KEY ("vet_id") REFERENCES "public"."vet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chat" ADD CONSTRAINT "chat_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "public"."pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."schedule" ADD CONSTRAINT "schedule_vet_id_fkey" FOREIGN KEY ("vet_id") REFERENCES "public"."vet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
