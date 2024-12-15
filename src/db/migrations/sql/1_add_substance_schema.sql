-- Create "substance" table
CREATE TABLE `substance`
(
    `id`                 text    NOT NULL,
    `name`               text    NOT NULL,
    `common_names`       text    NOT NULL,
    `brand_names`        text    NOT NULL,
    `substitutive_name`  text    NULL,
    `systematic_name`    text    NOT NULL,
    `pubchem_cid`        integer NOT NULL,
    `unii`               text    NULL,
    `cas_number`         text    NULL,
    `inchi_key`          text    NOT NULL,
    `smiles`             text    NOT NULL,
    `psychonautwiki_url` text    NULL,
    `psychoactive_class` text    NOT NULL,
    `chemical_class`     text    NULL,
    `description`        text    NULL,
    PRIMARY KEY (`id`)
);
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
CREATE TABLE `substance_synonym`
(
    `id`          text NOT NULL,
    `substanceId` text NOT NULL,
    `name`        text NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `substance_synonym_substanceId_fkey` FOREIGN KEY (`substanceId`) REFERENCES `substance` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT
);
-- Create index "substance_synonym_name_key" to table: "substance_synonym"
CREATE UNIQUE INDEX `substance_synonym_name_key` ON `substance_synonym` (`name`);
-- Create "substance_tolerance" table
CREATE TABLE `substance_tolerance`
(
    `id`                           text NOT NULL,
    `substanceId`                  text NOT NULL,
    `mechanism`                    text NOT NULL,
    `mechanism_desciption`         text NULL,
    `onset_mechanism`              text NOT NULL,
    `onset_description`            text NULL,
    `decline_mechanism`            text NOT NULL,
    `decline_description`          text NULL,
    `onset_duration`               text NULL,
    `decline_to_baseline_duration` text NULL,
    `decline_to_half_duration`     text NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `substance_tolerance_substanceId_fkey` FOREIGN KEY (`substanceId`) REFERENCES `substance` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT
);
-- Create index "substance_tolerance_substanceId_key" to table: "substance_tolerance"
CREATE UNIQUE INDEX `substance_tolerance_substanceId_key` ON `substance_tolerance` (`substanceId`);
-- Create "chemical_class" table
CREATE TABLE `chemical_class`
(
    `id`          text NOT NULL,
    `name`        text NOT NULL,
    `description` text NULL,
    PRIMARY KEY (`id`)
);
-- Create index "chemical_class_name_key" to table: "chemical_class"
CREATE UNIQUE INDEX `chemical_class_name_key` ON `chemical_class` (`name`);
-- Create "psychoactive_class" table
CREATE TABLE `psychoactive_class`
(
    `id`          text NOT NULL,
    `name`        text NOT NULL,
    `summary`     text NULL,
    `description` text NULL,
    `substanceId` text NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `psychoactive_class_substanceId_fkey` FOREIGN KEY (`substanceId`) REFERENCES `substance` (`id`) ON UPDATE CASCADE ON DELETE SET NULL
);
-- Create index "psychoactive_class_name_key" to table: "psychoactive_class"
CREATE UNIQUE INDEX `psychoactive_class_name_key` ON `psychoactive_class` (`name`);
-- Create "substance_route_of_administration" table
CREATE TABLE `substance_route_of_administration`
(
    `id`            text NOT NULL,
    `substanceName` text NOT NULL,
    `name`          text NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `substance_route_of_administration_substanceName_fkey` FOREIGN KEY (`substanceName`) REFERENCES `substance` (`name`) ON UPDATE CASCADE ON DELETE RESTRICT
);
-- Create index "substance_route_of_administration_name_substanceName_key" to table: "substance_route_of_administration"
CREATE UNIQUE INDEX `substance_route_of_administration_name_substanceName_key` ON `substance_route_of_administration` (`name`, `substanceName`);
-- Create "substance_route_of_administration_phase" table
CREATE TABLE `substance_route_of_administration_phase`
(
    `id`                      text    NOT NULL,
    `classification`          text    NOT NULL,
    `min_duration`            integer NULL,
    `max_duration`            integer NULL,
    `routeOfAdministrationId` text    NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `route_of_administration_phase_routeOfAdministrationId_fkey` FOREIGN KEY (`routeOfAdministrationId`) REFERENCES `substance_route_of_administration` (`id`) ON UPDATE CASCADE ON DELETE SET NULL
);
-- Create index "route_of_administration_phase_routeOfAdministrationId_classification_key" to table: "substance_route_of_administration_phase"
CREATE UNIQUE INDEX `route_of_administration_phase_routeOfAdministrationId_classification_key` ON `substance_route_of_administration_phase` (`routeOfAdministrationId`, `classification`);
-- Create "substance_route_of_administration_dosage" table
CREATE TABLE `substance_route_of_administration_dosage`
(
    `id`                      text    NOT NULL,
    `intensivity`             text    NOT NULL,
    `amount_min`              real    NOT NULL,
    `amount_max`              real    NOT NULL,
    `unit`                    text    NOT NULL,
    `perKilogram`             boolean NOT NULL DEFAULT false,
    `routeOfAdministrationId` text    NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `route_of_administration_dosage_routeOfAdministrationId_fkey` FOREIGN KEY (`routeOfAdministrationId`) REFERENCES `substance_route_of_administration` (`id`) ON UPDATE CASCADE ON DELETE SET NULL
);
-- Create index "route_of_administration_dosage_intensivity_routeOfAdministrationId_key" to table: "substance_route_of_administration_dosage"
CREATE UNIQUE INDEX `route_of_administration_dosage_intensivity_routeOfAdministrationId_key` ON `substance_route_of_administration_dosage` (`intensivity`, `routeOfAdministrationId`);
-- Create "substance_interactions" table
CREATE TABLE `substance_interactions`
(
    `id`          text NOT NULL,
    `substanceId` text NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `SubstanceInteraction_substanceId_fkey` FOREIGN KEY (`substanceId`) REFERENCES `substance` (`id`) ON UPDATE CASCADE ON DELETE SET NULL
);
-- Create "effect" table
CREATE TABLE `effect`
(
    `id`             text NOT NULL,
    `name`           text NOT NULL,
    `slug`           text NOT NULL,
    `category`       text NULL,
    `type`           text NULL,
    `tags`           text NOT NULL,
    `summary`        text NULL,
    `description`    text NOT NULL,
    `parameters`     text NOT NULL,
    `see_also`       text NOT NULL,
    `effectindex`    text NULL,
    `psychonautwiki` text NULL,
    PRIMARY KEY (`id`)
);
-- Create index "Effect_name_key" to table: "effect"
CREATE UNIQUE INDEX `Effect_name_key` ON `effect` (`name`);
-- Create index "Effect_slug_key" to table: "effect"
CREATE UNIQUE INDEX `Effect_slug_key` ON `effect` (`slug`);