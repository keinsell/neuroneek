-- Disable the enforcement of foreign-keys constraints
PRAGMA foreign_keys = off;
-- Create "new_Ingestion" table
CREATE TABLE `new_Ingestion` (`id` text NOT NULL, `substance_name` text NULL, `administration_route` text NULL, `dosage_unit` text NULL, `dosage_amount` integer NULL, `is_dosage_estimate` boolean NULL DEFAULT false, `ingested_at` datetime NULL, `subject_id` text NULL, `stashId` text NULL, PRIMARY KEY (`id`), CONSTRAINT `Ingestion_stashId_fkey` FOREIGN KEY (`stashId`) REFERENCES `Stash` (`id`) ON UPDATE CASCADE ON DELETE SET NULL, CONSTRAINT `Ingestion_substance_name_fkey` FOREIGN KEY (`substance_name`) REFERENCES `substance` (`name`) ON UPDATE CASCADE ON DELETE SET NULL, CONSTRAINT `Ingestion_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `Subject` (`id`) ON UPDATE CASCADE ON DELETE SET NULL);
-- Copy rows from old table "Ingestion" to new temporary table "new_Ingestion"
INSERT INTO `new_Ingestion` (`id`, `substance_name`, `administration_route`, `dosage_unit`, `dosage_amount`, `is_dosage_estimate`, `ingested_at`, `subject_id`, `stashId`) SELECT `id`, `substanceName`, `routeOfAdministration`, `dosage_unit`, `dosage_amount`, `isEstimatedDosage`, `date`, `subject_id`, `stashId` FROM `Ingestion`;
-- Drop "Ingestion" table after copying rows
DROP TABLE `Ingestion`;
-- Rename temporary table "new_Ingestion" to "Ingestion"
ALTER TABLE `new_Ingestion` RENAME TO `Ingestion`;
-- Drop "Substance" table
DROP TABLE `Substance`;
-- Drop "ChemicalClass" table
DROP TABLE `ChemicalClass`;
-- Drop "PsychoactiveClass" table
DROP TABLE `PsychoactiveClass`;
-- Drop "RouteOfAdministration" table
DROP TABLE `RouteOfAdministration`;
-- Drop "Phase" table
DROP TABLE `Phase`;
-- Drop "Dosage" table
DROP TABLE `Dosage`;
-- Create "substance" table
CREATE TABLE `substance` (`id` text NOT NULL, `name` text NOT NULL, `common_names` text NOT NULL, `brand_names` text NOT NULL, `substitutive_name` text NULL, `systematic_name` text NOT NULL, `pubchem_cid` integer NOT NULL, `unii` text NULL, `cas_number` text NULL, `inchi_key` text NOT NULL, `smiles` text NOT NULL, `psychonautwiki_url` text NULL, `psychoactive_class` text NOT NULL, `chemical_class` text NULL, `description` text NULL, PRIMARY KEY (`id`));
-- Create index "substance_id_key" to table: "substance"
CREATE UNIQUE INDEX `substance_id_key` ON `substance` (`id`);
-- Create index "substance_name_key" to table: "substance"
CREATE UNIQUE INDEX `substance_name_key` ON `substance` (`name`);
-- Create index "substance_substitutive_name_key" to table: "substance"
CREATE UNIQUE INDEX `substance_substitutive_name_key` ON `substance` (`substitutive_name`);
-- Create index "substance_systematic_name_key" to table: "substance"
CREATE UNIQUE INDEX `substance_systematic_name_key` ON `substance` (`systematic_name`);
-- Create index "substance_pubchem_cid_key" to table: "substance"
CREATE UNIQUE INDEX `substance_pubchem_cid_key` ON `substance` (`pubchem_cid`);
-- Create index "substance_cas_number_key" to table: "substance"
CREATE UNIQUE INDEX `substance_cas_number_key` ON `substance` (`cas_number`);
-- Create index "substance_inchi_key_key" to table: "substance"
CREATE UNIQUE INDEX `substance_inchi_key_key` ON `substance` (`inchi_key`);
-- Create index "substance_smiles_key" to table: "substance"
CREATE UNIQUE INDEX `substance_smiles_key` ON `substance` (`smiles`);
-- Create "substance_synonym" table
CREATE TABLE `substance_synonym` (`id` text NOT NULL, `substanceId` text NOT NULL, `name` text NOT NULL, PRIMARY KEY (`id`), CONSTRAINT `substance_synonym_substanceId_fkey` FOREIGN KEY (`substanceId`) REFERENCES `substance` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT);
-- Create index "substance_synonym_name_key" to table: "substance_synonym"
CREATE UNIQUE INDEX `substance_synonym_name_key` ON `substance_synonym` (`name`);
-- Create "substance_tolerance" table
CREATE TABLE `substance_tolerance` (`id` text NOT NULL, `substanceId` text NOT NULL, `mechanism` text NOT NULL, `mechanism_desciption` text NULL, `onset_mechanism` text NOT NULL, `onset_description` text NULL, `decline_mechanism` text NOT NULL, `decline_description` text NULL, `onset_duration` text NULL, `decline_to_baseline_duration` text NULL, `decline_to_half_duration` text NULL, PRIMARY KEY (`id`), CONSTRAINT `substance_tolerance_substanceId_fkey` FOREIGN KEY (`substanceId`) REFERENCES `substance` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT);
-- Create index "substance_tolerance_substanceId_key" to table: "substance_tolerance"
CREATE UNIQUE INDEX `substance_tolerance_substanceId_key` ON `substance_tolerance` (`substanceId`);
-- Create "chemical_class" table
CREATE TABLE `chemical_class` (`id` text NOT NULL, `name` text NOT NULL, `description` text NULL, PRIMARY KEY (`id`));
-- Create index "chemical_class_name_key" to table: "chemical_class"
CREATE UNIQUE INDEX `chemical_class_name_key` ON `chemical_class` (`name`);
-- Create "psychoactive_class" table
CREATE TABLE `psychoactive_class` (`id` text NOT NULL, `name` text NOT NULL, `summary` text NULL, `description` text NULL, `substanceId` text NULL, PRIMARY KEY (`id`), CONSTRAINT `psychoactive_class_substanceId_fkey` FOREIGN KEY (`substanceId`) REFERENCES `substance` (`id`) ON UPDATE CASCADE ON DELETE SET NULL);
-- Create index "psychoactive_class_name_key" to table: "psychoactive_class"
CREATE UNIQUE INDEX `psychoactive_class_name_key` ON `psychoactive_class` (`name`);
-- Create "substance_route_of_administration" table
CREATE TABLE `substance_route_of_administration` (`id` text NOT NULL, `substance_name` text NOT NULL, `name` text NOT NULL, PRIMARY KEY (`id`), CONSTRAINT `substance_route_of_administration_substance_name_fkey` FOREIGN KEY (`substance_name`) REFERENCES `substance` (`name`) ON UPDATE CASCADE ON DELETE RESTRICT);
-- Create index "substance_route_of_administration_name_substance_name_key" to table: "substance_route_of_administration"
CREATE UNIQUE INDEX `substance_route_of_administration_name_substance_name_key` ON `substance_route_of_administration` (`name`, `substance_name`);
-- Create "route_of_administration_phase" table
CREATE TABLE `route_of_administration_phase` (`id` text NOT NULL, `classification` text NOT NULL, `min_duration` integer NULL, `max_duration` integer NULL, `routeOfAdministrationId` text NULL, PRIMARY KEY (`id`), CONSTRAINT `route_of_administration_phase_routeOfAdministrationId_fkey` FOREIGN KEY (`routeOfAdministrationId`) REFERENCES `substance_route_of_administration` (`id`) ON UPDATE CASCADE ON DELETE SET NULL);
-- Create index "route_of_administration_phase_routeOfAdministrationId_classification_key" to table: "route_of_administration_phase"
CREATE UNIQUE INDEX `route_of_administration_phase_routeOfAdministrationId_classification_key` ON `route_of_administration_phase` (`routeOfAdministrationId`, `classification`);
-- Create "route_of_administration_dosage" table
CREATE TABLE `route_of_administration_dosage` (`id` text NOT NULL, `intensivity` text NOT NULL, `amount_min` real NOT NULL, `amount_max` real NOT NULL, `unit` text NOT NULL, `perKilogram` boolean NOT NULL DEFAULT false, `routeOfAdministrationId` text NULL, PRIMARY KEY (`id`), CONSTRAINT `route_of_administration_dosage_routeOfAdministrationId_fkey` FOREIGN KEY (`routeOfAdministrationId`) REFERENCES `substance_route_of_administration` (`id`) ON UPDATE CASCADE ON DELETE SET NULL);
-- Create index "route_of_administration_dosage_intensivity_routeOfAdministrationId_key" to table: "route_of_administration_dosage"
CREATE UNIQUE INDEX `route_of_administration_dosage_intensivity_routeOfAdministrationId_key` ON `route_of_administration_dosage` (`intensivity`, `routeOfAdministrationId`);
-- Enable back the enforcement of foreign-keys constraints
PRAGMA foreign_keys = on;
