/*
  Warnings:

  - A unique constraint covering the columns `[order_id]` on the table `payment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "payment_order_id_key" ON "public"."payment"("order_id");
