/*
  Warnings:

  - You are about to drop the `_ChatToUser` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,driverId]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `driverId` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ChatToUser" DROP CONSTRAINT "_ChatToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChatToUser" DROP CONSTRAINT "_ChatToUser_B_fkey";

-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "driverId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_ChatToUser";

-- CreateIndex
CREATE UNIQUE INDEX "Chat_userId_driverId_key" ON "Chat"("userId", "driverId");

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
