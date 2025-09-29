-- CreateTable
CREATE TABLE "public"."bumpers" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "storage_id" TEXT NOT NULL,

    CONSTRAINT "bumpers_pkey" PRIMARY KEY ("id")
);
