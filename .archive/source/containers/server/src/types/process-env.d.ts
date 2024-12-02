// Extend Node's process.env variables
declare namespace NodeJS {
	export interface ProcessEnv {
		// Add your environment variables here
		[key: string]: string | undefined;
	}
}
