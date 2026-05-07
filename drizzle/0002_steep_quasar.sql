CREATE TABLE `analytics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`event` varchar(100) NOT NULL,
	`userId` int,
	`metadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `analytics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blogPosts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`category` varchar(100) DEFAULT 'noticia',
	`description` text,
	`content` text NOT NULL,
	`imageUrl` varchar(512),
	`published` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blogPosts_id` PRIMARY KEY(`id`),
	CONSTRAINT `blogPosts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `emailAuth` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`passwordHash` varchar(255) NOT NULL,
	`name` varchar(255),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `emailAuth_id` PRIMARY KEY(`id`),
	CONSTRAINT `emailAuth_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `footerConfig` (
	`id` int AUTO_INCREMENT NOT NULL,
	`logoUrl` varchar(512),
	`partnerText` text,
	`phone` varchar(20),
	`email` varchar(320),
	`instagramUrl` varchar(512),
	`facebookUrl` varchar(512),
	`whatsappUrl` varchar(512),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `footerConfig_id` PRIMARY KEY(`id`)
);
