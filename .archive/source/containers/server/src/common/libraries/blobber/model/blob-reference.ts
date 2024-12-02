import { UniqueIdentifier } from '../../identification/index.js'



export class BlobReference
  {
	 public id : UniqueIdentifier | undefined
	 public url? : string
	 public presignedUrl? : string
	 public mimeType? : string
	 public size? : number
	 public checksum? : string
	 public createdAt? : Date
	 public updatedAt? : Date


	 constructor(payload : {
		id? : UniqueIdentifier,
		url? : string,
		presignedUrl? : string,
		mimeType? : string,
		size? : number,
		createdAt? : Date,
		updatedAt? : Date,
	 })
		{
		  this.id           = payload.id
		  this.url          = payload.url
		  this.presignedUrl = payload.presignedUrl
		  this.mimeType     = payload.mimeType
		  this.size         = payload.size
		  this.createdAt    = payload.createdAt
		  this.updatedAt    = payload.updatedAt
		}
  }