-- CreateTable
CREATE TABLE `addresses` (
    `id` VARCHAR(255) NOT NULL,
    `street` VARCHAR(255) NULL,
    `city` VARCHAR(255) NULL,
    `province` VARCHAR(255) NULL,
    `country` VARCHAR(255) NOT NULL,
    `postalCode` VARCHAR(255) NULL,
    `contactId` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_contactId_fkey` FOREIGN KEY (`contactId`) REFERENCES `contacts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
