import {randomUUID}       from 'node:crypto'
import {
	pipeline,
	Readable,
}                         from 'stream'
import {promisify}        from 'util'
import {UniqueIdentifier} from '../../identification/index.js'



export class Blob
{
	public id?: UniqueIdentifier
	public url?: string
	public presignedUrl?: string
	public mimeType?: string
	public size?: number
	public checksum?: string
	public createdAt?: Date
	public updatedAt?: Date
	public source?: Readable

	constructor(payload: {
		id?: UniqueIdentifier;
		url?: string;
		presignedUrl?: string;
		mimeType?: string;
		size?: number;
		createdAt?: Date;
		updatedAt?: Date;
		source?: Readable;
	})
	{
		this.id           = payload.id || randomUUID()
		this.url          = payload.url
		this.presignedUrl = payload.presignedUrl
		this.mimeType     = payload.mimeType
		this.size         = payload.size
		this.createdAt    = payload.createdAt
		this.updatedAt    = payload.updatedAt
		this.source       = payload.source
	}

	static async fromBuffer(buffer: Buffer): Promise<Blob>
	{
		const readableStream = Readable.from(buffer)
		const blob           = new Blob({source: readableStream})
		return blob
	}

	static async fromString(string: string, mimeType?: string): Promise<Blob>
	{
		const buffer         = Buffer.from(string, 'utf8')
		const readableStream = Readable.from(buffer)
		const blob           = new Blob({
			                                source: readableStream,
			                                mimeType,
		                                })
		return blob
	}

	static async fromStream(stream: Readable): Promise<Blob>
	{
		return new Blob({source: stream})
	}

	async toBuffer(): Promise<Buffer>
	{
		const chunks: Buffer[] = []
		const pipelinePromise  = promisify(pipeline)
		await pipelinePromise(this.source!, async function* (source)
		{
			for await (const chunk of source)
			{
				chunks.push(chunk)
			}
		})

		return Buffer.concat(chunks)
	}

	async toString(): Promise<string>
	{
		const buffer = await this.toBuffer()
		return buffer.toString()
	}
}
