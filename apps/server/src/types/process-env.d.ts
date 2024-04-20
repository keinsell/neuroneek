// Extend Node's process.env variables
declare namespace NodeJS
{
	export interface ProcessEnv
	{
		UV_THREADPOOL_SIZE: number | undefined

		// Add your environment variables here
		[key: string]: string | undefined;
	}
}
