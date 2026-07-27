-- CreateTable
CREATE TABLE `ProductBadge` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `trustBadgeId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ProductBadge_productId_trustBadgeId_key`(`productId`, `trustBadgeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProductBadge` ADD CONSTRAINT `ProductBadge_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductBadge` ADD CONSTRAINT `ProductBadge_trustBadgeId_fkey` FOREIGN KEY (`trustBadgeId`) REFERENCES `TrustBadge`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
