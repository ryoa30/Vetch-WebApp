-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "full_name" TEXT NOT NULL,
    "phone_number" TEXT,
    "profile_picture" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."vet" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "upload_certificate" TEXT,
    "sip_number" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "is_avail_homecare" BOOLEAN NOT NULL,
    "is_avail_emergency" BOOLEAN NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verified_date" TIMESTAMP(3),

    CONSTRAINT "vet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."location" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "address_name" TEXT NOT NULL,
    "postal_code" VARCHAR(65) NOT NULL,
    "urban_village" VARCHAR(65) NOT NULL,
    "district" VARCHAR(65) NOT NULL,
    "city" VARCHAR(65) NOT NULL,
    "province" VARCHAR(65) NOT NULL,
    "address_notes" VARCHAR(65),
    "coordinates" VARCHAR(65) NOT NULL DEFAULT '0,0',
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pet" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "pet_name" VARCHAR(65) NOT NULL,
    "species_name" VARCHAR(65) NOT NULL,
    "gender" VARCHAR(65) NOT NULL,
    "pet_dob" TIMESTAMP NOT NULL,
    "neuter_status" BOOLEAN NOT NULL,
    "primary_color" VARCHAR(65) NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "reminder_consultation" VARCHAR(65),
    "reminder_vaccine" VARCHAR(65),
    "reminder_consultation_date" TIMESTAMP(3),
    "reminder_vaccine_date" TIMESTAMP(3),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "pet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."species" (
    "id" TEXT NOT NULL,
    "vet_id" TEXT NOT NULL,
    "species_type_id" TEXT NOT NULL,

    CONSTRAINT "species_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."species_type" (
    "id" TEXT NOT NULL,
    "species_name" VARCHAR(255) NOT NULL,

    CONSTRAINT "species_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."booking" (
    "id" TEXT NOT NULL,
    "vet_id" TEXT NOT NULL,
    "pet_id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "illness_description" TEXT NOT NULL,
    "booking_date" TIMESTAMP(3) NOT NULL,
    "booking_price" INTEGER NOT NULL,
    "booking_status" VARCHAR(20) NOT NULL,
    "booking_type" VARCHAR(65) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payment" (
    "id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "payment_method" VARCHAR(65) NOT NULL,
    "payment_status" VARCHAR(65) NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."concern_type" (
    "id" TEXT NOT NULL,
    "concern_name" VARCHAR(65) NOT NULL,

    CONSTRAINT "concern_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."concern_detail" (
    "id" TEXT NOT NULL,
    "concern_id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,

    CONSTRAINT "concern_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."rating" (
    "id" TEXT NOT NULL,
    "vet_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "context" VARCHAR(100) NOT NULL,
    "rating" INTEGER NOT NULL,
    "rating_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."blog" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "context" TEXT NOT NULL,
    "picture" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "blog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."category" (
    "id" TEXT NOT NULL,
    "category_name" VARCHAR(65) NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."chat" (
    "id" TEXT NOT NULL,
    "vet_id" TEXT NOT NULL,
    "pet_id" TEXT NOT NULL,
    "chat_history" TEXT,
    "video_call_history" TEXT,
    "status" VARCHAR(5) NOT NULL,

    CONSTRAINT "chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."schedule" (
    "id" TEXT NOT NULL,
    "vet_id" TEXT NOT NULL,
    "day_number" INTEGER NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "timeOfDay" TIME(0) NOT NULL,

    CONSTRAINT "schedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "vet_user_id_key" ON "public"."vet"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_booking_id_key" ON "public"."payment"("booking_id");

-- CreateIndex
CREATE INDEX "schedule_vet_id_day_number_timeOfDay_idx" ON "public"."schedule"("vet_id", "day_number", "timeOfDay");

-- AddForeignKey
ALTER TABLE "public"."vet" ADD CONSTRAINT "vet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."location" ADD CONSTRAINT "location_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pet" ADD CONSTRAINT "pet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."species" ADD CONSTRAINT "species_species_type_id_fkey" FOREIGN KEY ("species_type_id") REFERENCES "public"."species_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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

