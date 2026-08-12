-- AlterTable
ALTER TABLE `sitesettings` ADD COLUMN `razorpayEnabled` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `razorpayKeyId` VARCHAR(191) NULL,
    ADD COLUMN `razorpayKeySecret` VARCHAR(191) NULL;
