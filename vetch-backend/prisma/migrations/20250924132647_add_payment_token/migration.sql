/*
  Warnings:

  - Added the required column `payment_token` to the `payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."payment" ADD COLUMN     "payment_token" TEXT NOT NULL;
