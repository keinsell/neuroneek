import {Log} from "./log.js"


// The main purpose of this class is to define a standard interface for all logger layout classes. This interface includes a single method, layout(data: Log), which must be implemented by any concrete class that extends LoggerLayout.

export abstract class LoggerLayout {

	// layout(data: Log): string | undefined - This is an abstract method that takes in a Log object as an argument and returns a formatted string representation of the log data or undefined. The specific formatting of the log data is determined by the concrete layout class that implements this method.

	abstract layout(data: Log): string | undefined
}