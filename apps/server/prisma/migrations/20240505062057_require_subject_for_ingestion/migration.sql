/*
  Warnings:

  - Made the column `subject_id` on table `Ingestion` required. This step will fail if there are existing NULL values in that column.

*/
-- DeleteRecords
DELETE FROM "Ingestion" WHERE "subject_id" IS NULL;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ingestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "substanceName" TEXT,
    "routeOfAdministration" TEXT,
    "dosage_unit" TEXT,
    "dosage_amount" INTEGER,
    "isEstimatedDosage" BOOLEAN DEFAULT false,
    "date" DATETIME,
    "subject_id" TEXT NOT NULL,
    "stashId" TEXT,
    CONSTRAINT "Ingestion_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "Subject" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ingestion_substanceName_fkey" FOREIGN KEY ("substanceName") REFERENCES "Substance" ("name") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Ingestion_stashId_fkey" FOREIGN KEY ("stashId") REFERENCES "Stash" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Ingestion" ("date", "dosage_amount", "dosage_unit", "id", "isEstimatedDosage", "routeOfAdministration", "stashId", "subject_id", "substanceName") SELECT "date", "dosage_amount", "dosage_unit", "id", "isEstimatedDosage", "routeOfAdministration", "stashId", "subject_id", "substanceName" FROM "Ingestion";
DROP TABLE "Ingestion";
ALTER TABLE "new_Ingestion" RENAME TO "Ingestion";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
