import { Module }           from '@nestjs/common'
import { TerminusModule }   from '@nestjs/terminus'
import { DatabaseModule }   from '../../database/database.module.js'
import { HealthController } from './health-controller.js'



@Module( {
			  imports     : [
				 DatabaseModule,
				 TerminusModule.forRoot( {
													errorLogStyle : 'pretty',
													logger        : false,
												 } ),
			  ],
			  controllers : [ HealthController ],
			  exports     : [ TerminusModule ],
			} )
export class HealthModule {}