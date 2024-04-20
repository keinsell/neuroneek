import {Log}          from '../log.js'
import {LoggerLayout} from '../logger-layout.js'



export class PrettyLoggerLayout
	extends LoggerLayout
{
	public layout(data: Log): string | undefined
	{
		return undefined
	}
}
