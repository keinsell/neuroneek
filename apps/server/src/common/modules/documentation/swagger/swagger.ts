import {INestApplication, Logger}                      from '@nestjs/common'
import {DocumentBuilder, OpenAPIObject, SwaggerModule} from '@nestjs/swagger'
import fs                                              from 'node:fs'
import path                                            from 'path'
import prettier                                        from 'prettier'
import tildify                                         from 'tildify'
import {fileURLToPath}                                 from 'url'
import {__config}                                      from '../../../../configs/global/__config.js'
import {getMetadataStore}                              from '../../../../utilities/docs-utils/swagger-api-model.js'



/**
 * Experimental method to add API model functionality to the OpenAPI document.
 *
 * @param {OpenAPIObject} document - The OpenAPI document to add model functionality to.
 * @return {void}
 */
function experimentalAddApiModelFunctionality(document: OpenAPIObject): void {
	// ExperimentalL: Force OpenAPI Model Documentation

	const modelMetadataStore = getMetadataStore()

	if (document.components) {
		for (const definitionKey in document.components.schemas) {
			const metatype = modelMetadataStore[definitionKey]

			if (metatype) {
				if (metatype.name) {
					document.components.schemas[metatype.name] = document.components.schemas[definitionKey]
					delete document.components.schemas[definitionKey]
				}

				if (metatype.description) {
					(
						document.components.schemas[metatype.name ?? definitionKey] as any
					).description = metatype.description
				}
			}
		}
	}

	// Experimental
	const updateSchema = (schema: any) => {
		if (schema?.$ref) {
			const refArray     = schema.$ref.split('/')
			const originalName = refArray.pop()
			const metatype     = modelMetadataStore[originalName]

			if (metatype?.name) {
				refArray.push(metatype.name)
				schema.$ref = refArray.join('/')
			}
		}
	}

	// Update Swagger Paths
	for (const pathKey in document.paths) {
		for (const methodKey in document.paths[pathKey]) {
			// @ts-ignore
			const operation = document.paths[pathKey][methodKey]

			if (operation?.parameters) {
				for (const param of operation.parameters) {
					updateSchema(param.schema) // references under parameters can be updated
				}
			}

			if (operation?.requestBody?.content) {
				for (const mediaTypeKey in operation.requestBody.content) {
					const schema = operation.requestBody.content[mediaTypeKey].schema
					updateSchema(schema) // references under request bodies can be updated
				}
			}

			if (operation?.responses) {
				for (const responseKey in operation.responses) {
					const contentType = operation.responses[responseKey]?.content

					for (const mediaTypeKey in contentType) {
						const schema = contentType[mediaTypeKey].schema
						updateSchema(schema) // references under responses can be updated.
					}
				}
			}
		}
	}
}


export async function buildSwaggerDocumentation(app: INestApplication): Promise<OpenAPIObject> {
	const logger = new Logger('doc:swagger')

	const swaggerConfig = new DocumentBuilder()
	.setTitle(__config.get('SERVICE_NAME'))
	.setDescription(__config.get('SERVICE_DESCRIPTION'))
	.setVersion('1.0')
	.addTag('api')
	.addBearerAuth({
		name:         'Bearer Token',
		type:         'http',
		scheme:       'bearer',
		bearerFormat: 'JWT',
		description:  'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer <token>"',
	})
	.build()

	logger.verbose(`Swagger documentation base built for ${__config.get('SERVICE_NAME')} service.`)

	const document = SwaggerModule.createDocument(app, swaggerConfig,

		new DocumentBuilder()
		// https://stackoverflow.com/questions/59376717/global-headers-for-all-controllers-nestjs-swagger
		// .addGlobalParameters( { in          : 'header', required    :
		// true, name        : 'x-request-id', description : 'A unique
		// identifier assigned to the request. Clients can include this
		// header' + ' to trace and correlate requests across different
		// services and systems.', schema      : {type : 'string'},
		// deprecated  : true, example : nanoid( 128 ), } )
		.build() as any)

	logger.verbose(`Swagger documentation document built for ${__config.get('SERVICE_NAME')} service.`)

	experimentalAddApiModelFunctionality(document)

	//SwaggerModule.setup(ApplicationConfiguration.openapiDocumentationPath, app, document, {
	//	explorer:  true,
	//	customCss: new SwaggerTheme('v3').getBuffer("flattop"), // OR newspaper
	//});

	//app.use("/api", apiReference({
	//	spec: {
	//		content: document,
	//	},
	//}))

	const __filename = fileURLToPath(import.meta.url);
	const __dirname  = path.dirname(__filename);

	const absoluteDir                = path.resolve(__dirname);
	const documentationDirectoryPath = path.join(absoluteDir, 'public', 'api');

	fs.mkdirSync(documentationDirectoryPath, {recursive: true})

	const documentationObjectPath = path.join(documentationDirectoryPath, "openapi3.json");

	const formattedDocument = await prettier.format(JSON.stringify(document), {
		parser:   'json-stringify',
		tabWidth: 2,
	})

	// Save Swagger Documentation to File
	fs.writeFileSync(documentationObjectPath, formattedDocument)
	fs.writeFileSync("./openapi3.json", formattedDocument)

	logger.verbose(`Swagger documentation was snapshot into ${tildify(documentationObjectPath)}`)

	return document
}