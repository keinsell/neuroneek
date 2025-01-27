-- Create "atlas_schema_revisions" table
CREATE TABLE `atlas_schema_revisions`
(
    `version`          text     NOT NULL,
    `description`      text     NOT NULL,
    `type`             integer  NOT NULL DEFAULT 2,
    `applied`          integer  NOT NULL DEFAULT 0,
    `total`            integer  NOT NULL DEFAULT 0,
    `executed_at`      datetime NOT NULL,
    `execution_time`   integer  NOT NULL,
    `error`            text NULL,
    `error_stmt`       text NULL,
    `hash`             text     NOT NULL,
    `partial_hashes`   json NULL,
    `operator_version` text     NOT NULL,
    PRIMARY KEY (`version`)
);
-- Create "ingestion" table
CREATE TABLE `ingestion`
(
    `id`                      integer       NOT NULL PRIMARY KEY AUTOINCREMENT,
    `substance_name`          varchar       NOT NULL,
    `route_of_administration` varchar       NOT NULL,
    `dosage`                  float         NOT NULL,
    `ingested_at`             datetime_text NOT NULL,
    `updated_at`              datetime_text NOT NULL,
    `created_at`              datetime_text NOT NULL
);
-- Create "seaql_migrations" table
CREATE TABLE `seaql_migrations`
(
    `version`    varchar NOT NULL,
    `applied_at` bigint  NOT NULL,
    PRIMARY KEY (`version`)
);
-- Create "substance" table
CREATE TABLE `substance`
(
    `id`                 text    NOT NULL,
    `name`               text    NOT NULL,
    `common_names`       text    NOT NULL,
    `pubchem_cid`        integer NOT NULL,
    `psychonautwiki_url` text NULL,
    `psychoactive_class` text    NOT NULL,
    `chemical_class`     text NULL,
    `description`        text NULL,
    PRIMARY KEY (`id`)
);
-- Create index "substance_id_key" to table: "substance"
CREATE UNIQUE INDEX `substance_id_key` ON `substance` (`id`);
-- Create index "substance_name_key" to table: "substance"
CREATE UNIQUE INDEX `substance_name_key` ON `substance` (`name`);
-- Create index "substance_pubchem_cid_key" to table: "substance"
CREATE UNIQUE INDEX `substance_pubchem_cid_key` ON `substance` (`pubchem_cid`);
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
    `id`                      text NOT NULL,
    `classification`          text NOT NULL,
    `lower_duration`          text NULL,
    `upper_duration`          text NULL,
    `routeOfAdministrationId` text NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `route_of_administration_phase_routeOfAdministrationId_fkey` FOREIGN KEY (`routeOfAdministrationId`) REFERENCES `substance_route_of_administration` (`id`) ON UPDATE CASCADE ON DELETE SET NULL
);
-- Create index "route_of_administration_phase_routeOfAdministrationId_classification_key" to table: "substance_route_of_administration_phase"
CREATE UNIQUE INDEX `route_of_administration_phase_routeOfAdministrationId_classification_key` ON `substance_route_of_administration_phase` (`routeOfAdministrationId`, `classification`);
-- Create "substance_route_of_administration_dosage" table
CREATE TABLE `substance_route_of_administration_dosage`
(
    `id`                      text NOT NULL,
    `intensity`               text NOT NULL,
    `lower_bound_amount`      real NULL,
    `upper_bound_amount`      real NULL,
    `unit`                    text NOT NULL,
    `routeOfAdministrationId` text NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `route_of_administration_dosage_routeOfAdministrationId_fkey` FOREIGN KEY (`routeOfAdministrationId`) REFERENCES `substance_route_of_administration` (`id`) ON UPDATE CASCADE ON DELETE SET NULL
);
-- Create index "route_of_administration_dosage_intensivity_routeOfAdministrationId_key" to table: "substance_route_of_administration_dosage"
CREATE UNIQUE INDEX `route_of_administration_dosage_intensivity_routeOfAdministrationId_key` ON `substance_route_of_administration_dosage` (`intensity`, `routeOfAdministrationId`);
-- Create "ingestion_phase" table with PhaseClassification alignment
CREATE TABLE `ingestion_phase` (
                                   `id`                text        NOT NULL PRIMARY KEY,
                                   `ingestion_id`      integer     NOT NULL,
                                   `classification`    text        NOT NULL CHECK(`classification` IN ('Onset', 'Comeup', 'Peak', 'Comedown', 'Afterglow', 'Unknown')),
                                   `description`       text        NULL,
                                   `start_time`        datetime_text NOT NULL,
                                   `end_time`          datetime_text NOT NULL,
                                   `duration_lower`    text        NULL,
                                   `duration_upper`    text        NULL,
                                   `intensity`         text        NULL,
                                   `notes`             text        NULL,
                                   `created_at`        datetime_text NOT NULL,
                                   `updated_at`        datetime_text NOT NULL,
                                   CONSTRAINT `ingestion_phase_ingestion_id_fkey` FOREIGN KEY (`ingestion_id`) REFERENCES `ingestion` (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
                                   CONSTRAINT `ingestion_phase_start_before_end` CHECK (`start_time` <= `end_time`)
);

-- Create indexes for performance
CREATE UNIQUE INDEX `ingestion_phase_id_key` ON `ingestion_phase` (`id`);
CREATE INDEX `ingestion_phase_ingestion_id_idx` ON `ingestion_phase` (`ingestion_id`);
CREATE INDEX `ingestion_phase_classification_idx` ON `ingestion_phase` (`classification`);