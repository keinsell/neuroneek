-- Fix all 'route_of_administration' classifications in the 'ingestion' table

UPDATE ingestion SET route_of_administration = 'buccal' WHERE route_of_administration = '"buccal"';
UPDATE ingestion SET route_of_administration = 'inhaled' WHERE route_of_administration = '"inhaled"';
UPDATE ingestion SET route_of_administration = 'insufflated' WHERE route_of_administration = '"insufflated"';
UPDATE ingestion SET route_of_administration = 'intramuscular' WHERE route_of_administration = '"intramuscular"';
UPDATE ingestion SET route_of_administration = 'intravenous' WHERE route_of_administration = '"intravenous"';
UPDATE ingestion SET route_of_administration = 'oral' WHERE route_of_administration = '"oral"';
UPDATE ingestion SET route_of_administration = 'rectal' WHERE route_of_administration = '"rectal"';
UPDATE ingestion SET route_of_administration = 'smoked' WHERE route_of_administration = '"smoked"';
UPDATE ingestion SET route_of_administration = 'sublingual' WHERE route_of_administration = '"sublingual"';
UPDATE ingestion SET route_of_administration = 'transdermal' WHERE route_of_administration = '"transdermal"';