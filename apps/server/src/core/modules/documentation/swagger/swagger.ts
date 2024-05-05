import {INestApplication, Logger} from '@nestjs/common'
import {DocumentBuilder, OpenAPIObject, SwaggerModule} from '@nestjs/swagger'
import fs from 'node:fs'
import path from 'path'
import prettier from 'prettier'
import tildify from 'tildify'
import {PrismaModel} from "../../../../_gen/index.js"
import {__config} from '../../../../configs/global/__config.js'
import {getMetadataStore} from '../../../../utilities/docs-utils/swagger-api-model.js'


/**
 * Experimental method to add API model functionality to the OpenAPI document.
 *
 * @param {OpenAPIObject} document - The OpenAPI document to add model functionality to.
 * @return {void}
 */
function experimentalAddApiModelFunctionality(document: OpenAPIObject): void
    {
        // ExperimentalL: Force OpenAPI Model Documentation

        const modelMetadataStore = getMetadataStore()

        if (document.components)
            {
                for (const definitionKey in document.components.schemas)
                    {
                        const metatype = modelMetadataStore[definitionKey]

                        if (metatype)
                            {
                                if (metatype.name)
                                    {
                                        document.components.schemas[metatype.name] = document.components.schemas[definitionKey]
                                        delete document.components.schemas[definitionKey]
                                    }

                                if (metatype.description)
                                    {
                                        (
                                            document.components.schemas[metatype.name ?? definitionKey] as any
                                        ).description = metatype.description
                                    }
                            }
                    }
            }

        // Experimental
        const updateSchema = (schema: any) =>
            {
                if (schema?.$ref)
                    {
                        const refArray     = schema.$ref.split('/')
                        const originalName = refArray.pop()
                        const metatype     = modelMetadataStore[originalName]

                        if (metatype?.name)
                            {
                                refArray.push(metatype.name)
                                schema.$ref = refArray.join('/')
                            }
                    }
            }

        // Update Swagger Paths
        for (const pathKey in document.paths)
            {
                for (const methodKey in document.paths[pathKey])
                    {
                        // @ts-ignore
                        const operation = document.paths[pathKey][methodKey]

                        if (operation?.parameters)
                            {
                                for (const param of operation.parameters)
                                    {
                                        updateSchema(param.schema) // references under parameters can be updated
                                    }
                            }

                        if (operation?.requestBody?.content)
                            {
                                for (const mediaTypeKey in operation.requestBody.content)
                                    {
                                        const schema = operation.requestBody.content[mediaTypeKey].schema
                                        updateSchema(schema) // references under request bodies can be updated
                                    }
                            }

                        if (operation?.responses)
                            {
                                for (const responseKey in operation.responses)
                                    {
                                        const contentType = operation.responses[responseKey]?.content

                                        for (const mediaTypeKey in contentType)
                                            {
                                                const schema = contentType[mediaTypeKey].schema
                                                updateSchema(schema) // references under responses can be updated.
                                            }
                                    }
                            }
                    }
            }
    }


export async function buildSwaggerDocumentation(app: INestApplication): Promise<OpenAPIObject>
    {
        const logger = new Logger('doc:swagger')

        const swaggerConfig = new DocumentBuilder()
            .setTitle("🧬 Neuronek")
            .setDescription(__config.get('SERVICE_DESCRIPTION') + `\n\n
Please note API will be rate limited to 10 req/s and 100 req/hour due to low resources available for this service. With the growth of the service we will be able to provide more resources for the API but for now we have to limit the usage - special thanks to the [Railway](https://railway.app?referralCode=hvVUux) for providing us with free resources to host this service.`)
            .setVersion('0.0.1-dev')
            .setContact("Jakub Olan", "https://github.com/keinsell", "keinsell@protonmail.com")
            // .addServer("https://neuronek.up.railway.app/reference", "Production API")
            // .addServer("http://localhost:1337", "Local API")
            .addBearerAuth({
                               name        : 'Bearer Token',
                               type        : 'http',
                               scheme      : 'bearer',
                               bearerFormat: 'JWT',
                               description : 'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer <token>"',
                           })
            .addTag('Substance Warehouse',
                    'Substance Warehouse is community-led database of dosages, effects and interactions, currently it is a read-only database of substances from [PsychonautWiki](https://psychonautwiki.org) however in near future data from other resources will be integrated with ability to do changes on data that is available in API.')
            .addTag('Search Engine',
                    'Search Engine allows user to search substances by name, effects, interactions and other properties. We prepared vectorized full-text search algorithm to provide most relevant results for user query. And in the future we are planning to prepare multiple indexes that will allow for graph-based queries to find the right data you need in record time.')
            .addTag('Account Management',
                    'Application have set of features that allow users to isolate their data from general data - in order to use user-spaced features of application one is supposed to create account and use authentication.',
                    {description: "asdsasad", url: ""})
            .addTag('Subject Profile',
                    `Subject Profiles are fictional characters owned by Account to which we assign ingestion information or other related data`
            )
            .addTag('Authentication')
            .addTag('Ingestion Journal',
                    `Ingestion Journal collects information about historical user ingestion's in order to provide user with insights about his habits and patterns.`)
            .build()

        logger.verbose(`Swagger documentation base built for ${__config.get('SERVICE_NAME')} service.`)

        const document = SwaggerModule.createDocument(app, swaggerConfig, {extraModels: [...PrismaModel.extraModels]})

        logger.verbose(`Swagger documentation document built for ${__config.get('SERVICE_NAME')} service.`)

        experimentalAddApiModelFunctionality(document)

        const absoluteDir                = path.resolve(__dirname);
        const documentationDirectoryPath = path.join(absoluteDir, 'public', 'api');

        fs.mkdirSync(documentationDirectoryPath, {recursive: true})

        const documentationObjectPath = path.join(documentationDirectoryPath, "openapi3.json");

        const formattedDocument = await prettier.format(JSON.stringify(document), {
            parser  : 'json-stringify',
            tabWidth: 2,
        })

        // Save Swagger Documentation to File
        fs.writeFileSync(documentationObjectPath, formattedDocument)
        fs.writeFileSync("./openapi3.json", formattedDocument)

        logger.verbose(`Swagger documentation was snapshot into ${tildify(documentationObjectPath)}`)

        return document
    }
