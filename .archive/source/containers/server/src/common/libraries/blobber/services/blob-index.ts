import { BlobReference } from '../model/blob-reference.js'



/**
 * BlobIndex is a service that stores metadata about blobs such as their location and size.
 */
export abstract class BlobIndex
  {
	 /**
	  * Stores a blob in the index.
	  * @param blob The blob to store.
	  */
	 public abstract store(blob : Blob) : Promise<BlobReference>


	 /**
	  * Retrieves a blob from the index.
	  * @param {string} id Blob ID, this can be a unique ID, checksum or any valid identifying metadata.
	  * @returns {Promise<BlobReference | undefined>}
	  */
	 public abstract get(id : string) : Promise<BlobReference | undefined>
  }