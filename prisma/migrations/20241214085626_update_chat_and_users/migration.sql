/*
  Warnings:

  - You are about to drop the column `driverId` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Chat` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_driverId_fkey";

-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_userId_fkey";

-- DropIndex
DROP INDEX "Chat_userId_driverId_key";

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "driverId",
DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "_ChatUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ChatUsers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ChatUsers_B_index" ON "_ChatUsers"("B");

-- AddForeignKey
ALTER TABLE "_ChatUsers" ADD CONSTRAINT "_ChatUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatUsers" ADD CONSTRAINT "_ChatUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
