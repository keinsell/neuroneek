import { Module }            from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join }              from 'node:path'
import process               from 'node:process'



@Module( {
			  imports : [
				 ServeStaticModule.forRoot( {
														rootPath   : join( process.cwd(), 'src/externals/compodoc' ),
														renderPath : '/docs',
														serveRoot  : '/docs',
													 } ),
			  ],
			  exports : [
				 ServeStaticModule,
			  ],
			} )
export class CompodocModule {}