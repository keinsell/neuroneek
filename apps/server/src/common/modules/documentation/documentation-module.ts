import {Module}         from '@nestjs/common'
import path             from 'path'
import {fileURLToPath}  from 'url'
import {CompodocModule} from './compodoc/compodoc.module.js'



const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);


@Module({
	imports:     [
		CompodocModule,
	],
	controllers: [],
	providers:   [],
	exports:     [],
})
export class DocumentationModule {

}