-- atlas:checkpoint

-- Create "Account" table
CREATE TABLE `Account` (`id` text NOT NULL, `username` text NOT NULL, `password` text NOT NULL, PRIMARY KEY (`id`));
-- Create index "Account_username_key" to table: "Account"
CREATE UNIQUE INDEX `Account_username_key` ON `Account` (`username`);
-- Create "Subject" table
CREATE TABLE `Subject` (`id` text NOT NULL, `firstName` text NULL, `lastName` text NULL, `dateOfBirth` datetime NULL, `weight` integer NULL, `height` integer NULL, `account_id` text NULL, PRIMARY KEY (`id`), CONSTRAINT `Subject_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `Account` (`id`) ON UPDATE CASCADE ON DELETE SET NULL);
-- Create index "Subject_account_id_key" to table: "Subject"
CREATE UNIQUE INDEX `Subject_account_id_key` ON `Subject` (`account_id`);
-- Create "Effect" table
CREATE TABLE `Effect` (`id` text NOT NULL, `name` text NOT NULL, `slug` text NOT NULL, `category` text NULL, `type` text NULL, `tags` text NOT NULL, `summary` text NULL, `description` text NOT NULL, `parameters` text NOT NULL, `see_also` text NOT NULL, `effectindex` text NULL, `psychonautwiki` text NULL, PRIMARY KEY (`id`));
-- Create index "Effect_name_key" to table: "Effect"
CREATE UNIQUE INDEX `Effect_name_key` ON `Effect` (`name`);
-- Create index "Effect_slug_key" to table: "Effect"
CREATE UNIQUE INDEX `Effect_slug_key` ON `Effect` (`slug`);
-- Create "Ingestion" table
CREATE TABLE `Ingestion` (`id` text NOT NULL, `substanceName` text NULL, `routeOfAdministration` text NULL, `dosage_unit` text NULL, `dosage_amount` integer NULL, `isEstimatedDosage` boolean NULL DEFAULT false, `date` datetime NULL, `subject_id` text NULL, `stashId` text NULL, PRIMARY KEY (`id`), CONSTRAINT `Ingestion_stashId_fkey` FOREIGN KEY (`stashId`) REFERENCES `Stash` (`id`) ON UPDATE CASCADE ON DELETE SET NULL, CONSTRAINT `Ingestion_substanceName_fkey` FOREIGN KEY (`substanceName`) REFERENCES `substance` (`name`) ON UPDATE CASCADE ON DELETE SET NULL, CONSTRAINT `Ingestion_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `Subject` (`id`) ON UPDATE CASCADE ON DELETE SET NULL);
-- Create "Stash" table
CREATE TABLE `Stash` (`id` text NOT NULL, `owner_id` text NOT NULL, `substance_id` text NOT NULL, `addedDate` datetime NULL DEFAULT (CURRENT_TIMESTAMP), `expiration` datetime NULL, `amount` integer NULL, `price` text NULL, `vendor` text NULL, `description` text NULL, `purity` integer NULL DEFAULT 100, PRIMARY KEY (`id`), CONSTRAINT `Stash_substance_id_fkey` FOREIGN KEY (`substance_id`) REFERENCES `substance` (`name`) ON UPDATE CASCADE ON DELETE RESTRICT, CONSTRAINT `Stash_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `Subject` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT);
-- Create "SubstanceInteraction" table
CREATE TABLE `SubstanceInteraction` (`id` text NOT NULL, `substanceId` text NULL, PRIMARY KEY (`id`), CONSTRAINT `SubstanceInteraction_substanceId_fkey` FOREIGN KEY (`substanceId`) REFERENCES `substance` (`id`) ON UPDATE CASCADE ON DELETE SET NULL);
-- Create "_EffectToPhase" table
CREATE TABLE `_EffectToPhase` (`A` text NOT NULL, `B` text NOT NULL, CONSTRAINT `_EffectToPhase_B_fkey` FOREIGN KEY (`B`) REFERENCES `route_of_administration_phase` (`id`) ON UPDATE CASCADE ON DELETE CASCADE, CONSTRAINT `_EffectToPhase_A_fkey` FOREIGN KEY (`A`) REFERENCES `Effect` (`id`) ON UPDATE CASCADE ON DELETE CASCADE);
-- Create index "_EffectToPhase_AB_unique" to table: "_EffectToPhase"
CREATE UNIQUE INDEX `_EffectToPhase_AB_unique` ON `_EffectToPhase` (`A`, `B`);
-- Create index "_EffectToPhase_B_index" to table: "_EffectToPhase"
CREATE INDEX `_EffectToPhase_B_index` ON `_EffectToPhase` (`B`);
-- Create "Substance" table
CREATE TABLE `Substance` (`id` text NOT NULL, `name` text NOT NULL, `common_names` text NOT NULL, `brand_names` text NOT NULL, `substitutive_name` text NULL, `systematic_name` text NOT NULL, `pubchem_cid` integer NOT NULL, `unii` text NULL, `cas_number` text NULL, `inchi_key` text NOT NULL, `smiles` text NOT NULL, `psychonautwiki_url` text NULL, `psychoactive_class` text NOT NULL, `chemical_class` text NULL, `description` text NULL, PRIMARY KEY (`id`));
-- Create index "Substance_name_key" to table: "Substance"
CREATE UNIQUE INDEX `Substance_name_key` ON `Substance` (`name`);
-- Create index "Substance_substitutive_name_key" to table: "Substance"
CREATE UNIQUE INDEX `Substance_substitutive_name_key` ON `Substance` (`substitutive_name`);
-- Create index "Substance_systematic_name_key" to table: "Substance"
CREATE UNIQUE INDEX `Substance_systematic_name_key` ON `Substance` (`systematic_name`);
-- Create index "Substance_pubchem_cid_key" to table: "Substance"
CREATE UNIQUE INDEX `Substance_pubchem_cid_key` ON `Substance` (`pubchem_cid`);
-- Create index "Substance_cas_number_key" to table: "Substance"
CREATE UNIQUE INDEX `Substance_cas_number_key` ON `Substance` (`cas_number`);
-- Create index "Substance_inchi_key_key" to table: "Substance"
CREATE UNIQUE INDEX `Substance_inchi_key_key` ON `Substance` (`inchi_key`);
-- Create index "Substance_smiles_key" to table: "Substance"
CREATE UNIQUE INDEX `Substance_smiles_key` ON `Substance` (`smiles`);
-- Create "ChemicalClass" table
CREATE TABLE `ChemicalClass` (`id` text NOT NULL, `name` text NOT NULL, `description` text NULL, PRIMARY KEY (`id`));
-- Create index "ChemicalClass_name_key" to table: "ChemicalClass"
CREATE UNIQUE INDEX `ChemicalClass_name_key` ON `ChemicalClass` (`name`);
-- Create "PsychoactiveClass" table
CREATE TABLE `PsychoactiveClass` (`id` text NOT NULL, `name` text NOT NULL, `summary` text NULL, `description` text NULL, `substanceId` text NULL, PRIMARY KEY (`id`), CONSTRAINT `PsychoactiveClass_substanceId_fkey` FOREIGN KEY (`substanceId`) REFERENCES `Substance` (`id`) ON UPDATE CASCADE ON DELETE SET NULL);
-- Create index "PsychoactiveClass_name_key" to table: "PsychoactiveClass"
CREATE UNIQUE INDEX `PsychoactiveClass_name_key` ON `PsychoactiveClass` (`name`);
-- Create "RouteOfAdministration" table
CREATE TABLE `RouteOfAdministration` (`id` text NOT NULL, `substanceName` text NOT NULL, `name` text NOT NULL, PRIMARY KEY (`id`), CONSTRAINT `RouteOfAdministration_substanceName_fkey` FOREIGN KEY (`substanceName`) REFERENCES `Substance` (`name`) ON UPDATE CASCADE ON DELETE RESTRICT);
-- Create index "RouteOfAdministration_name_substanceName_key" to table: "RouteOfAdministration"
CREATE UNIQUE INDEX `RouteOfAdministration_name_substanceName_key` ON `RouteOfAdministration` (`name`, `substanceName`);
-- Create "Phase" table
CREATE TABLE `Phase` (`id` text NOT NULL, `min_duration` integer NULL, `max_duration` integer NULL, `routeOfAdministrationId` text NULL, PRIMARY KEY (`id`), CONSTRAINT `Phase_routeOfAdministrationId_fkey` FOREIGN KEY (`routeOfAdministrationId`) REFERENCES `RouteOfAdministration` (`id`) ON UPDATE CASCADE ON DELETE SET NULL);
-- Create "Dosage" table
CREATE TABLE `Dosage` (`id` text NOT NULL, `intensivity` text NOT NULL, `amount_min` real NOT NULL, `amount_max` real NOT NULL, `unit` text NOT NULL, `perKilogram` boolean NOT NULL DEFAULT false, `routeOfAdministrationId` text NULL, PRIMARY KEY (`id`), CONSTRAINT `Dosage_routeOfAdministrationId_fkey` FOREIGN KEY (`routeOfAdministrationId`) REFERENCES `RouteOfAdministration` (`id`) ON UPDATE CASCADE ON DELETE SET NULL);
-- Create index "Dosage_intensivity_routeOfAdministrationId_key" to table: "Dosage"
CREATE UNIQUE INDEX `Dosage_intensivity_routeOfAdministrationId_key` ON `Dosage` (`intensivity`, `routeOfAdministrationId`);
