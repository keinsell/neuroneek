export enum CommandStatus {
	PENDING = 'PENDING',
	PROCESSING = 'PROCESSING',
	COMPLETED = 'COMPLETED',
	FAILED = 'FAILED',
	REJECTED = 'REJECTED',
	CANCELLED = 'CANCELLED',
	INVALID = 'INVALID',
	TIMEOUT = 'TIMEOUT',
	PENDING_RETRY = 'PENDING_RETRY',
	UNKNOWN = 'UNKNOWN',
}
