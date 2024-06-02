PSYCHONAUTWIKI_GRAPHQL_DIR=graphql/psychonautwiki
PSYCHONAUTWIKI_GRAPHQL_SCHEMA_PATH=${PSYCHONAUTWIKI_GRAPHQL_DIR}/schema.graphql
PYTHON_TYPES_DIR=src/custom_types

#  rye install datamodel-code-generator
generate_datamodel_from_psychonautwiki:
	poetry run  datamodel-codegen --input .cached_data/psychonautwiki.json --output src/types/psychonautwiki.py --input-file-type=json --output-model-type 'pydantic_v2.BaseModel'
	poetry run  datamodel-codegen --input .cached_data/effectindex.json --output src/types/effectindex.py --input-file-type=json --output-model-type 'pydantic_v2.BaseModel'
	poetry run prisma db push
generate_prisma:
	poetry run python3 -m pip prisma generate

generate_psychonautwiki_types:
	poetry run ariadne-codegen
	#	poetry run strawberry schema-codegen --output ${PYTHON_TYPES_DIR}/gql_scheam_psychonautwiki.py ${PSYCHONAUTWIKI_GRAPHQL_SCHEMA_PATH}
	# poetry run strawberry codegen --schema ${PYTHON_TYPES_DIR} -o out -p python ${PSYCHONAUTWIKI_GRAPHQL_DIR}/queries.graphql
	#poetry run strawberry codegen --schema ${PSYCHONAUTWIKI_GRAPHQL_SCHEMA_PATH} --output-dir src -p python  ${PSYCHONAUTWIKI_GRAPHQL_DIR}/queries.graphql

# Generate package stubs
generate_stubs:
	poetry run stubgen -p pubchempy -p diskcache -m src --include-docstrings --include-private --inspect-mode --ignore-errors

annotate_types:
	poetry run pytype src
