/*
  Warnings:

  - Made the column `mood` on table `Post` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Post` MODIFY `mood` ENUM('HAPPY', 'ANGRY', 'SAD', 'LAUGHING', 'CONFUSED') NOT NULL;
