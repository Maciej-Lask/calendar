-- AlterTable
ALTER TABLE `event` MODIFY `canBeBooked` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `isBooked` BOOLEAN NOT NULL DEFAULT false;
