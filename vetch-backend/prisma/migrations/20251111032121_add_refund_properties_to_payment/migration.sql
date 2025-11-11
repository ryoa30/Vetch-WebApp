/*
  Warnings:

  - Added the required column `gross_amount` to the `payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_id` to the `payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."payment" ADD COLUMN     "gross_amount" INTEGER NOT NULL,
ADD COLUMN     "order_id" VARCHAR(100) NOT NULL;
