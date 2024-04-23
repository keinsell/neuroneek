generate_datamodel_from_psychonautwiki:
	poetry run datamodel-codegen --input psychonautwiki.json --output pw_types.py --input-file-type=json
	poetry run prisma db push
