/*
  Warnings:

  - Added the required column `canBeBooked` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isBooked` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `event` ADD COLUMN `canBeBooked` BOOLEAN NOT NULL,
    ADD COLUMN `isBooked` BOOLEAN NOT NULL;
