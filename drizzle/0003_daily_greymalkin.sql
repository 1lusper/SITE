CREATE TABLE `siteConfig` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL DEFAULT 'Dark System',
	`bannerImageUrl` varchar(512),
	`videoBannerImageUrl` varchar(512),
	`faviconUrl` varchar(512),
	`progzacoImageUrl` varchar(512),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `siteConfig_id` PRIMARY KEY(`id`)
);
