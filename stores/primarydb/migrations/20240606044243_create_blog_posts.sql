-- Disable the enforcement of foreign-keys constraints
PRAGMA foreign_keys = off;
-- Drop "substance" table
DROP TABLE `substance`;
-- Drop "substance_synonym" table
DROP TABLE `substance_synonym`;
-- Drop "substance_tolerance" table
DROP TABLE `substance_tolerance`;
-- Drop "chemical_class" table
DROP TABLE `chemical_class`;
-- Drop "psychoactive_class" table
DROP TABLE `psychoactive_class`;
-- Drop "substance_route_of_administration" table
DROP TABLE `substance_route_of_administration`;
-- Drop "route_of_administration_phase" table
DROP TABLE `route_of_administration_phase`;
-- Drop "route_of_administration_dosage" table
DROP TABLE `route_of_administration_dosage`;
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
-- Enable back the enforcement of foreign-keys constraints
PRAGMA foreign_keys = on;
