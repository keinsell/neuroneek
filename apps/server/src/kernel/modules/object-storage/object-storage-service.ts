export abstract class ObjectStorageService
{
	abstract putObject(bucket: string, key: string, data: Buffer, metadata: any): Promise<void>

	abstract getObject(bucket: string, key: string): Promise<Buffer>

	abstract deleteObject(bucket: string, key: string): Promise<void>

	abstract listObjects(bucket: string, prefix: string): Promise<string[]>
}
