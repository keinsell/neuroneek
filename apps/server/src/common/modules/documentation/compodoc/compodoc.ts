import { Logger } from '@nestjs/common'
import { exec }   from 'node:child_process'

import { isDevelopment }      from '../../../../configs/helper/is-development.js'
import { StaticFeatureFlags } from '../../../../configs/static-feature-flags.js'



/** Hook-like method dedicated for updating documentation in background once application is started. In future this
 *  method may use programmatically compodoc because in case of distribution we would not always have package.json. */
export function buildCompodocDocumentation()
  {
	 const logger = new Logger( 'doc:compodoc' )

	 if ( !isDevelopment() || !StaticFeatureFlags.shouldGenerateCompodoc )
		{
		  return
		}
	 exec(
		'pnpm docs:compodoc', (error,
									  stdout,
									  stderr,
		) => {
		  if ( error )
			 {
				logger.error( `Error generating docs: ${error}` )
				return
			 }
		  logger.log( 'Compodoc documentation generated successfully!' )
		} )
  }