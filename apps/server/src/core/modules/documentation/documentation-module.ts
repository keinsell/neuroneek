import {Module}         from '@nestjs/common'
import path             from 'path'
import {fileURLToPath}  from 'url'



const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);


@Module({
	imports:     [

	],
	controllers: [],
	providers:   [],
	exports:     [],
})
export class DocumentationModule {

}