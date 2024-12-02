-- Disable the enforcement of foreign-keys constraints
PRAGMA foreign_keys = off;
-- Create "new_ingestion" table
CREATE TABLE `new_ingestion` (`id` integer NOT NULL PRIMARY KEY AUTOINCREMENT, `substance_name` text NULL, `administration_route` text NULL, `dosage_unit` text NULL, `dosage_amount` float NULL, `ingestion_date` datetime NULL, `subject_id` text NULL, `stash_id` text NULL, CONSTRAINT `fk_stash_ingestion_id` FOREIGN KEY (`stash_id`) REFERENCES `stash` (`id`) ON UPDATE CASCADE ON DELETE SET NULL, CONSTRAINT `fk_stash_substance_id` FOREIGN KEY (`substance_name`) REFERENCES `substance` (`name`) ON UPDATE CASCADE ON DELETE SET NULL, CONSTRAINT `fk_ingestion_subject_id` FOREIGN KEY (`subject_id`) REFERENCES `subject` (`id`) ON UPDATE CASCADE ON DELETE SET NULL);
-- Copy rows from old table "ingestion" to new temporary table "new_ingestion"
INSERT INTO `new_ingestion` (`id`, `substance_name`, `administration_route`, `dosage_unit`, `dosage_amount`, `ingestion_date`, `subject_id`, `stash_id`) SELECT `id`, `substance_name`, `administration_route`, `dosage_unit`, `dosage_amount`, `ingestion_date`, `subject_id`, `stash_id` FROM `ingestion`;
-- Drop "ingestion" table after copying rows
DROP TABLE `ingestion`;
-- Rename temporary table "new_ingestion" to "ingestion"
ALTER TABLE `new_ingestion` RENAME TO `ingestion`;
-- Enable back the enforcement of foreign-keys constraints
PRAGMA foreign_keys = on;
