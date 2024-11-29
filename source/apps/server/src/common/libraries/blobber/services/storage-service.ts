import { Blob } from '../model/blob.js'



export interface StorageService
  {
	 upload(blob : Blob) : Promise<string>

	 delete(blob : Blob) : Promise<void>

	 getDownloadStream(blob : Blob) : Promise<NodeJS.ReadableStream>

	 getPresignedDownloadUrl(blob : Blob) : Promise<string>
  }