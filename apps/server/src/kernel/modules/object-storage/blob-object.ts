// Blob, File, Resource, Object, Entry - there are different names which mean the same.
// I've chosen BlobObject to not collide with JavaScript's Blob API.
// The Blob API is a Web API that represents a file-like object of immutable,
// raw data,
// however, Blobs in JavaScript aren't optimized for performance, and their support ends up at 2GB
// (I think a lot earlier as they are stored in memory as buffers)


// This is S3-compatible Object
import {Readable} from 'stream'



export interface Bucket
{
	id: string
	name: string
	createdAt: Date
	updatedAt: Date
}


export interface S3Object
{
	name: string
	size: number
	metadata: Record<string, unknown>
	createdAt: Date
	updateAt: Date
}


export interface IBlob
{
	id: string
	mimeType: string
	size: number
	checksum: string
	createdAt: Date
	updatedAt: Date
	source: Readable
}
