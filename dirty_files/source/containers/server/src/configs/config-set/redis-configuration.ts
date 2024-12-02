import convict               from 'convict'
import {IRedisConfiguration} from '../schema/configuration-container.js'



export const RedisConfiguration: convict.Schema<IRedisConfiguration> = {
	host              : {
		doc    : 'The Redis server hostname',
		format : String,
		default: 'localhost',
		env    : 'REDIS_HOST',
	},
	port              : {
		doc    : 'The Redis server port number',
		format : 'port',
		default: 6379,
		env    : 'REDIS_PORT',
	},
	username          : {
		doc     : 'Username for the Redis server',
		format  : String,
		nullable: true,
		default : undefined,
		env     : 'REDIS_USERNAME',
	},
	password          : {
		doc     : 'Password for the Redis server',
		format  : String,
		default : undefined,
		nullable: true,
		env     : 'REDIS_PASSWORD',
	},
	url               : {
		doc     : 'Connection string for the Redis server',
		format  : String,
		nullable: true,
		default : undefined,
		env     : 'REDIS_URL',
	},
	enableOfflineQueue: {
		doc    : 'Enable the Redis client\'s offline queue',
		format : Boolean,
		default: false,
		env    : 'REDIS_ENABLE_OFFLINE_QUEUE',
	},
	db                : {
		doc    : 'The Redis server database number',
		format : 'int',
		default: 0,
		env    : 'REDIS_DB',
	},
}
