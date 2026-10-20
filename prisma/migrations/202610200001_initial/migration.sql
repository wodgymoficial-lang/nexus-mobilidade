CREATE TABLE `SmtpSettings` (
  `id` INTEGER NOT NULL DEFAULT 1,
  `host` VARCHAR(255) NOT NULL,
  `port` INTEGER NOT NULL DEFAULT 587,
  `secure` BOOLEAN NOT NULL DEFAULT false,
  `username` VARCHAR(255) NOT NULL,
  `passwordEncrypted` TEXT NOT NULL,
  `fromName` VARCHAR(120) NOT NULL,
  `fromEmail` VARCHAR(254) NOT NULL,
  `recipientEmail` VARCHAR(254) NOT NULL,
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Lead` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(254) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `company` VARCHAR(160) NULL,
  `city` VARCHAR(160) NOT NULL,
  `interest` VARCHAR(50) NOT NULL,
  `message` TEXT NOT NULL,
  `consentAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `emailSent` BOOLEAN NOT NULL DEFAULT false,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX `Lead_createdAt_idx` (`createdAt`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
