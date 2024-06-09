# Specify tables to be deleted and dumped
TABLES=("substance_route_of_administration_dosage" "substance_route_of_administration_phase" "substance_route_of_administration" "substance")
MIGRATION_FILE_NAME_SUFFIX="_with_dump"
# Get the latest file that does not contain 'snapshot' in the name
latest_migration_file=$(ls -Art migrations | grep -v $MIGRATION_FILE_NAME_SUFFIX | tail -n 1)

if [ -z "$latest_migration_file" ]
then
    echo "No migration file found"
    exit 1
fi

# Check if the latest migration file has the defined suffix
if [[ $latest_migration_file == *"$MIGRATION_FILE_NAME_SUFFIX.sql" ]]
then
    # If so delete it and create new one
    rm -f "$latest_migration_file"
    new_migration_file="${latest_migration_file%.sql}$MIGRATION_FILE_NAME_SUFFIX.sql"
    cp "migrations/$latest_migration_file" "migrations/$new_migration_file"
else
    # Create a new file with the suffix
    new_migration_file="${latest_migration_file%.sql}$MIGRATION_FILE_NAME_SUFFIX.sql"
    cp "migrations/$latest_migration_file" "migrations/$new_migration_file"
fi

# Define DELETE queries
delete_queries=$(printf 'DELETE FROM "%s";\n' "${TABLES[@]}")

# Dump the database for each table in reversed order to a temporary file
echo "$delete_queries" > temp_dump.txt
for ((idx=${#TABLES[@]}-1 ; idx>=0 ; idx--)) ; do
    table="${TABLES[idx]}"
    sqlite3 /home/keinsell/Projects/neuronek/db.sqlite ".dump $table" | grep "INSERT INTO" >> temp_dump.txt
done

# Insert the content of the temporary dump file before the 'PRAGMA foreign_keys = on;' line
awk '/PRAGMA foreign_keys = on;/{while((getline line<"temp_dump.txt")>0){print line}} {print}' "migrations/$new_migration_file" > tmp && mv tmp "migrations/$new_migration_file"

# Remove the temporary file
rm temp_dump.txt

echo "Dump added to: migrations/$new_migration_file"
