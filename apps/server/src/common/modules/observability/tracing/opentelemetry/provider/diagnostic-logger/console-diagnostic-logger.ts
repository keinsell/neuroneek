import { Logger }                from '@nestjs/common'
import type { DiagnosticLogger } from '../../../contract/diagnostic-loggger/diagnostic-logger.js'



export class ConsoleDiagnosticLogger
  implements DiagnosticLogger
  {
	 private logger = new Logger( 'opentelemetry:diagnostic' )


	 public debug(
		message : string,
		args : unknown,
	 ) : void
		{
		  this.logger.debug( message, args )
		}


	 public error(
		message : string,
		args : unknown,
	 ) : void
		{
		  this.logger.error( message, args )
		}


	 public info(
		message : string,
		args : unknown,
	 ) : void
		{
		  this.logger.log( message, args )
		}


	 public verbose(
		message : string,
		args : unknown,
	 ) : void
		{
		  this.logger.verbose( message, args )
		}


	 public warn(
		message : string,
		args : unknown,
	 ) : void
		{
		  this.logger.warn( message, args )
		}
  }