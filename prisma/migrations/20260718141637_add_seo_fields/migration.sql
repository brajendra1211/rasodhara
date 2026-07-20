-- AlterTable
ALTER TABLE `category` ADD COLUMN `metaDescription` TEXT NULL,
    ADD COLUMN `metaTitle` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `metaDescription` TEXT NULL,
    ADD COLUMN `metaTitle` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `sitesettings` ADD COLUMN `canonicalDomain` VARCHAR(191) NULL,
    ADD COLUMN `googleSiteVerification` VARCHAR(191) NULL,
    ADD COLUMN `metaDescription` TEXT NULL,
    ADD COLUMN `metaTitle` VARCHAR(191) NULL,
    ADD COLUMN `ogImage` VARCHAR(191) NULL,
    ADD COLUMN `robotsIndexingEnabled` BOOLEAN NOT NULL DEFAULT true;
