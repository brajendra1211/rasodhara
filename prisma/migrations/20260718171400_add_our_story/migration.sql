-- AlterTable
ALTER TABLE `sitesettings` ADD COLUMN `storyBody` TEXT NULL,
    ADD COLUMN `storyCtaHref` VARCHAR(191) NULL,
    ADD COLUMN `storyCtaLabel` VARCHAR(191) NULL,
    ADD COLUMN `storyImage` VARCHAR(191) NULL,
    ADD COLUMN `storyTitle` VARCHAR(191) NULL;
