-- CreateTable
CREATE TABLE "public"."vet" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "upload_certificate" TEXT,
    "description" VARCHAR(255) NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "vet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."location" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "address_name" VARCHAR(65) NOT NULL,
    "postal_code" VARCHAR(65) NOT NULL,
    "city" VARCHAR(65) NOT NULL,
    "province" VARCHAR(65) NOT NULL,
    "address_notes" VARCHAR(65),

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

    CONSTRAINT "pet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."species" (
    "id" TEXT NOT NULL,
    "vet_id" TEXT NOT NULL,
    "species_name" VARCHAR(255) NOT NULL,
    "upload_certificate" TEXT,

    CONSTRAINT "species_pkey" PRIMARY KEY ("id")
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
    "title" VARCHAR(65) NOT NULL,
    "context" VARCHAR(255) NOT NULL,
    "picture" TEXT,
    "date" TIMESTAMP(3) NOT NULL,

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
    "day_of_week" VARCHAR(10) NOT NULL,
    "time_of_day" TIMESTAMP NOT NULL,

    CONSTRAINT "schedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vet_user_id_key" ON "public"."vet"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_booking_id_key" ON "public"."payment"("booking_id");

-- AddForeignKey
ALTER TABLE "public"."vet" ADD CONSTRAINT "vet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."location" ADD CONSTRAINT "location_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pet" ADD CONSTRAINT "pet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."species" ADD CONSTRAINT "species_vet_id_fkey" FOREIGN KEY ("vet_id") REFERENCES "public"."vet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."booking" ADD CONSTRAINT "booking_vet_id_fkey" FOREIGN KEY ("vet_id") REFERENCES "public"."vet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."booking" ADD CONSTRAINT "booking_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "public"."pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."booking" ADD CONSTRAINT "booking_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "public"."location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payment" ADD CONSTRAINT "payment_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "public"."booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."concern_detail" ADD CONSTRAINT "concern_detail_concern_id_fkey" FOREIGN KEY ("concern_id") REFERENCES "public"."concern_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."concern_detail" ADD CONSTRAINT "concern_detail_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "public"."booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."rating" ADD CONSTRAINT "rating_vet_id_fkey" FOREIGN KEY ("vet_id") REFERENCES "public"."vet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."rating" ADD CONSTRAINT "rating_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blog" ADD CONSTRAINT "blog_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chat" ADD CONSTRAINT "chat_vet_id_fkey" FOREIGN KEY ("vet_id") REFERENCES "public"."vet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chat" ADD CONSTRAINT "chat_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "public"."pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."schedule" ADD CONSTRAINT "schedule_vet_id_fkey" FOREIGN KEY ("vet_id") REFERENCES "public"."vet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
