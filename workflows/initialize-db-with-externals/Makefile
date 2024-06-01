generate_datamodel_from_psychonautwiki:
	poetry run datamodel-codegen --input psychonautwiki.json --output pw_types.py --input-file-type=json
	poetry run datamodel-codegen --input effectindex.json --output types/effectindex.py --input-file-type=json
	poetry run prisma db push
generate_prisma:
	rye run prisma generate
