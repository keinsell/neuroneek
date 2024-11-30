import {isDevelopment} from "../../configs/helper/is-development.js";



export function censorString(string : string) : string {
	//	return env.isDev ? string : string.replace(/./g, "*")
	return isDevelopment() ? string : "[CENSORED]"
}