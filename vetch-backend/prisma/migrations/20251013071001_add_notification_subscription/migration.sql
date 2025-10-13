-- CreateTable
CREATE TABLE "public"."notification_subscription" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "keys" JSONB NOT NULL,

    CONSTRAINT "notification_subscription_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."notification_subscription" ADD CONSTRAINT "notification_subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
