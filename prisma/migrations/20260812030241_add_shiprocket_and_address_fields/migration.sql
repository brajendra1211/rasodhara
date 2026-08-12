-- AlterTable
ALTER TABLE `address` ADD COLUMN `city` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `pincode` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `state` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `order` ADD COLUMN `shippingCity` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `shippingPincode` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `shippingState` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `shiprocketAwbCode` VARCHAR(191) NULL,
    ADD COLUMN `shiprocketCourierName` VARCHAR(191) NULL,
    ADD COLUMN `shiprocketError` TEXT NULL,
    ADD COLUMN `shiprocketOrderId` VARCHAR(191) NULL,
    ADD COLUMN `shiprocketShipmentId` VARCHAR(191) NULL,
    ADD COLUMN `shiprocketTrackingUrl` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `sitesettings` ADD COLUMN `shiprocketEmail` VARCHAR(191) NULL,
    ADD COLUMN `shiprocketEnabled` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `shiprocketPackageBreadthCm` INTEGER NOT NULL DEFAULT 15,
    ADD COLUMN `shiprocketPackageHeightCm` INTEGER NOT NULL DEFAULT 10,
    ADD COLUMN `shiprocketPackageLengthCm` INTEGER NOT NULL DEFAULT 20,
    ADD COLUMN `shiprocketPackageWeightGrams` INTEGER NOT NULL DEFAULT 500,
    ADD COLUMN `shiprocketPassword` VARCHAR(191) NULL;
