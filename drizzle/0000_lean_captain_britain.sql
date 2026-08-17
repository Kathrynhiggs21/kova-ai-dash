CREATE TABLE `integration_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`slug` varchar(96) NOT NULL,
	`name` varchar(160) NOT NULL,
	`category` varchar(96) NOT NULL,
	`iconUrl` varchar(512),
	`status` enum('connected','needs_action','error','not_accessible','warning') NOT NULL DEFAULT 'connected',
	`description` text,
	`actionLabel` varchar(160),
	`actionUrl` varchar(1024),
	`note` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `integration_records_id` PRIMARY KEY(`id`),
	CONSTRAINT `integration_records_user_slug_idx` UNIQUE(`userId`,`slug`)
);
--> statement-breakpoint
CREATE TABLE `stored_files` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`integrationId` int,
	`fileName` varchar(255) NOT NULL,
	`fileKey` varchar(512) NOT NULL,
	`fileUrl` varchar(1024) NOT NULL,
	`contentType` varchar(160) NOT NULL,
	`sizeBytes` int NOT NULL DEFAULT 0,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `stored_files_id` PRIMARY KEY(`id`),
	CONSTRAINT `stored_files_fileKey_unique` UNIQUE(`fileKey`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
ALTER TABLE `integration_records` ADD CONSTRAINT `integration_records_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `stored_files` ADD CONSTRAINT `stored_files_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `stored_files` ADD CONSTRAINT `stored_files_integrationId_integration_records_id_fk` FOREIGN KEY (`integrationId`) REFERENCES `integration_records`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `integration_records_user_category_idx` ON `integration_records` (`userId`,`category`);--> statement-breakpoint
CREATE INDEX `stored_files_user_created_idx` ON `stored_files` (`userId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `stored_files_integration_idx` ON `stored_files` (`integrationId`);