-- AlterTable
ALTER TABLE `sitesettings` ADD COLUMN `chatbotApiKey` VARCHAR(191) NULL,
    ADD COLUMN `chatbotEnabled` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `chatbotInstructions` TEXT NULL;
