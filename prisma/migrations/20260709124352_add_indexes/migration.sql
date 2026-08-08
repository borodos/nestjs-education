/*
  Warnings:

  - You are about to alter the column `size` on the `avatars` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "avatars" ALTER COLUMN "size" SET DATA TYPE INTEGER;

-- CreateIndex
CREATE INDEX "Profile_user_id_idx" ON "Profile"("user_id");

-- CreateIndex
CREATE INDEX "avatars_profile_id_created_at_idx" ON "avatars"("profile_id", "created_at");
