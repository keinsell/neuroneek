#  rye install datamodel-code-generator
generate_datamodel_from_psychonautwiki:
	poetry run  datamodel-codegen --input .cached_data/psychonautwiki.json --output src/types/psychonautwiki.py --input-file-type=json --output-model-type 'pydantic_v2.BaseModel'
	poetry run  datamodel-codegen --input .cached_data/effectindex.json --output src/types/effectindex.py --input-file-type=json --output-model-type 'pydantic_v2.BaseModel'
	poetry run prisma db push
generate_prisma:
	poetry run python3 -m pip prisma generate
