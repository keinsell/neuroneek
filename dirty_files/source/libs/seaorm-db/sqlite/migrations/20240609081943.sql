-- Disable the enforcement of foreign-keys constraints
PRAGMA foreign_keys = off;
-- Create "new_substance_route_of_administration_phase" table
CREATE TABLE `new_substance_route_of_administration_phase` (`id` text NOT NULL, `classification` text NOT NULL, `lower_duration` text NULL, `upper_duration` text NULL, `routeOfAdministrationId` text NULL, PRIMARY KEY (`id`), CONSTRAINT `route_of_administration_phase_routeOfAdministrationId_fkey` FOREIGN KEY (`routeOfAdministrationId`) REFERENCES `substance_route_of_administration` (`id`) ON UPDATE CASCADE ON DELETE SET NULL);
-- Copy rows from old table "substance_route_of_administration_phase" to new temporary table "new_substance_route_of_administration_phase"
INSERT INTO `new_substance_route_of_administration_phase` (`id`, `classification`, `routeOfAdministrationId`) SELECT `id`, `classification`, `routeOfAdministrationId` FROM `substance_route_of_administration_phase`;
-- Drop "substance_route_of_administration_phase" table after copying rows
DROP TABLE `substance_route_of_administration_phase`;
-- Rename temporary table "new_substance_route_of_administration_phase" to "substance_route_of_administration_phase"
ALTER TABLE `new_substance_route_of_administration_phase` RENAME TO `substance_route_of_administration_phase`;
-- Create index "route_of_administration_phase_routeOfAdministrationId_classification_key" to table: "substance_route_of_administration_phase"
CREATE UNIQUE INDEX `route_of_administration_phase_routeOfAdministrationId_classification_key` ON `substance_route_of_administration_phase` (`routeOfAdministrationId`, `classification`);
-- Create "new_substance_route_of_administration_dosage" table
CREATE TABLE `new_substance_route_of_administration_dosage` (`id` text NOT NULL, `intensity` text NOT NULL, `lower_bound_amount` real NULL, `upper_bound_amount` real NULL, `unit` text NOT NULL, `routeOfAdministrationId` text NULL, PRIMARY KEY (`id`), CONSTRAINT `route_of_administration_dosage_routeOfAdministrationId_fkey` FOREIGN KEY (`routeOfAdministrationId`) REFERENCES `substance_route_of_administration` (`id`) ON UPDATE CASCADE ON DELETE SET NULL);
-- Copy rows from old table "substance_route_of_administration_dosage" to new temporary table "new_substance_route_of_administration_dosage"
INSERT INTO `new_substance_route_of_administration_dosage` (`id`, `unit`, `routeOfAdministrationId`) SELECT `id`, `unit`, `routeOfAdministrationId` FROM `substance_route_of_administration_dosage`;
-- Drop "substance_route_of_administration_dosage" table after copying rows
DROP TABLE `substance_route_of_administration_dosage`;
-- Rename temporary table "new_substance_route_of_administration_dosage" to "substance_route_of_administration_dosage"
ALTER TABLE `new_substance_route_of_administration_dosage` RENAME TO `substance_route_of_administration_dosage`;
-- Create index "route_of_administration_dosage_intensivity_routeOfAdministrationId_key" to table: "substance_route_of_administration_dosage"
CREATE UNIQUE INDEX `route_of_administration_dosage_intensivity_routeOfAdministrationId_key` ON `substance_route_of_administration_dosage` (`intensity`, `routeOfAdministrationId`);
-- Enable back the enforcement of foreign-keys constraints
PRAGMA foreign_keys = on;
