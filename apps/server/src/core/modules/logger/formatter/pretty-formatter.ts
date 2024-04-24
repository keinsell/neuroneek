import chalk, {ChalkInstance} from "chalk"
import {LogLevel}             from "../log-level.js"
import {Log}                  from "../log.js"



export abstract class LogFormatter {
	abstract format(data: Log): string | undefined
}


export class PrettyFormatter extends LogFormatter {
	private logLevelIconMap: { [key in LogLevel]: { icon: string, shorthand: string, color: ChalkInstance } } = {
		[LogLevel.TRACE]: {
			icon:      '🔎',
			shorthand: 'TRC',
			color:     chalk.rgb(128, 128, 128),
		},
		[LogLevel.DEBUG]: {
			icon:      '🪲',
			shorthand: 'DBG',
			color:     chalk.rgb(255, 255, 0),
		},
		[LogLevel.INFO]:  {
			icon:      'ℹ️',
			shorthand: 'INF',
			color:     chalk.rgb(0, 255, 0),
		},
		[LogLevel.WARN]:  {
			icon:      '⚠️',
			shorthand: 'WRN',
			color:     chalk.rgb(255, 128, 0),
		},
		[LogLevel.ERROR]: {
			icon:      '🔥',
			shorthand: 'ERR',
			color:     chalk.rgb(255, 0, 0),
		},
		[LogLevel.FATAL]: {
			icon:      '💣',
			shorthand: 'FTL',
			color:     chalk.bgRgb(255, 0, 0).white,
		},
	}


	public format(data: Log): string | undefined {
		if (data == null) return

		const level = this.logLevelIconMap[data.level]

		const parts: string[] = []

		parts.push(level.color(`${level.shorthand} ${level.icon}`))

		parts.push(data.message ?? data.message)

		const output = `${parts.join(' ')}`

		return output
	}
}