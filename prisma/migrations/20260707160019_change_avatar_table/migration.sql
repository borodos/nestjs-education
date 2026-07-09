/*
  Warnings:

  - You are about to drop the `Avatar` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Avatar" DROP CONSTRAINT "Avatar_profile_id_fkey";

-- DropTable
DROP TABLE "Avatar";

-- CreateTable
CREATE TABLE "avatars" (
    "id" SERIAL NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "file_name" TEXT NOT NULL,
    "size" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "avatars_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "avatars_profile_id_key" ON "avatars"("profile_id");

-- AddForeignKey
ALTER TABLE "avatars" ADD CONSTRAINT "avatars_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
