CREATE TABLE `SiteSettings` (
  `id` INTEGER NOT NULL DEFAULT 1,
  `whatsappPhone` VARCHAR(15) NOT NULL DEFAULT '551130902861',
  `whatsappMessage` TEXT NOT NULL,
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
