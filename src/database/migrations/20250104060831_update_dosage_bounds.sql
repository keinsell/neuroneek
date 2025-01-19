-- Step 1: Create a new table with NULLABLE lower_bound_amount and upper_bound_amount
CREATE TABLE `substance_route_of_administration_dosage_new`
(
    `id`                      TEXT NOT NULL PRIMARY KEY,
    `intensity`               TEXT NOT NULL,
    `lower_bound_amount`      REAL NULL,
    `upper_bound_amount`      REAL NULL,
    `unit`                    TEXT NOT NULL,
    `routeOfAdministrationId` TEXT NULL,
    CONSTRAINT `route_of_administration_dosage_routeOfAdministrationId_fkey`
        FOREIGN KEY (`routeOfAdministrationId`) REFERENCES `substance_route_of_administration` (`id`)
            ON UPDATE CASCADE
            ON DELETE SET NULL
);

-- Step 2: Copy data from the old table to the new table, skipping rows with `0.0` bounds
INSERT INTO `substance_route_of_administration_dosage_new` (`id`, `intensity`, `lower_bound_amount`,
                                                            `upper_bound_amount`, `unit`, `routeOfAdministrationId`)
SELECT `id`,
       `intensity`,
       `lower_bound_amount`,
       `upper_bound_amount`,
       `unit`,
       `routeOfAdministrationId`
FROM `substance_route_of_administration_dosage`;

-- Step 3: Drop the old table
DROP TABLE `substance_route_of_administration_dosage`;

-- Step 4: Rename the new table to the original name
ALTER TABLE `substance_route_of_administration_dosage_new`
    RENAME TO `substance_route_of_administration_dosage`;

UPDATE substance_route_of_administration_dosage
SET lower_bound_amount = NULL
WHERE intensity = 'threshold';

UPDATE substance_route_of_administration_dosage
SET upper_bound_amount = NULL
WHERE intensity = 'heavy';
