# 👾 Blobber

Blobber is a library that provides a simple interface to store and retrieve
files from a object storage services, such
as file system, AWS S3, Google Cloud Storage, Azure Blob Storage, etc.

## Drivers

### Core Implementations

- [ ] `blobber-driver-memory` - In-Memory
- [ ] `blobber-driver-filesystem` - File System
- [ ] `blobber-driver-s3` - AWS S3

### Future Implementations

- [ ] `blobber-driver-ftp` - FTP
- [ ] `blobber-driver-sftp` - SFTP
- [ ] `blobber-driver-webdav` - WebDAV
- [ ] `blobber-driver-gcs` - Google Cloud Storage
- [ ] `blobber-driver-azure` - Azure Blob Storage
- [ ] `blobber-driver-minio` - MinIO
- [ ] `blobber-driver-digitalocean` - DigitalOcean Spaces
- [ ] `blobber-driver-ipfs` - IPFS

## How it should work?

- Blobber should be able to store and retrieve files from a object storage
  service.
- Blobber should be able to generate a URL to access a file.
- Blobber should be able to generate a URL to access a file with a expiration
  time.
- Blobber should be able to generate a URL to access a file with a expiration
  time and a password.
- Blobber should be able to search for file.
- Blobber should support strings, buffers and streams.
- Blobber should de-duplicate objects basing on their `CRC32` checksum.
- Should be integrated with Nest.js (`BlobberModule`)

## Future Usage

```ts
const blobberService = new Blobber({
	drivers:       [
		new BlobberDriverMemory(),
	],
	defaultDriver: 'memory',
});
// ~> BlobberService { ... }

const textBlob = Blob.fromString('Hello World!');
// ~> Blob { fileId: null, checksum: '1234567890', size: 1234567890, mimeType: 'text/plain', createdAt: null, updatedAt: null, deletedAt: null }

const file = fs.createReadStream('file.txt');
// ~> ReadStream { ... }

let streamBlob = Blob.fromStream(file);
// ~> Blob { fileId: null, checksum: null, size: null, mimeType: null, createdAt: null, updatedAt: null, deletedAt: null }

await blob.process();
// ~> Blob { fileId: null, checksum: '1234567890', size: 1234567890, mimeType: 'text/plain', createdAt: null, updatedAt: null, deletedAt: null }

const blobReference = await blobberService.store(blob);
// ~> { fileId: '1234567890', checksum: '1234567890', size: 1234567890, mimeType: 'text/plain', createdAt: '2020-01-01T00:00:00.000Z', updatedAt: '2020-01-01T00:00:00.000Z', deletedAt: null }

const url = blobberService.getUrl(blobReference.fileId);
// ~> http://localhost:3000/blobs/1234567890

blob = await blobberService.get(blobReference.fileId);
// ~> Blob { fileId: '1234567890', checksum: '1234567890', size: 1234567890, mimeType: 'text/plain', createdAt: '2020-01-01T00:00:00.000Z', updatedAt: '2020-01-01T00:00:00.000Z', deletedAt: null }

// Reading Blobs

// Strategy 1: Using Streams
const stream = blob.readStream();
// ~> ReadStream { ... } | null

// Strategy 2: Using Buffers
const buffer = await blob.readBuffer();
// ~> Buffer { ... } | null

// Strategy 3: Using Strings
const string = await blob.readString();
// ~> string | null

// Strategy 4: Using URLs
const urlx = blob.getUrl();

// Converting Blob from one type to another

// Strategy 1: From Stream to Buffer
const buffer = await blob.transform.toBuffer();
// ~> Buffer { ... }

// Strategy 2: From Stream to String
const string = await blob.transform.toString();
// ~> string
```