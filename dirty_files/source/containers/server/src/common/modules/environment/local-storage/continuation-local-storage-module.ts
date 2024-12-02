import { ClsModule } from 'nestjs-cls'


const CLS_CONFIG = {
	global      : true,
	interceptor : {mount : true},
	guard       : {mount : true},
	middleware  : {
		mount        : true,
		generateId   : true,
		saveReq      : true,
		saveRes      : true,
		useEnterWith : true,
		idGenerator  : () => Math.random().toString( 36 )
		.slice( 2 ),
	},
}


/** Continuation-local storage allows to store state and propagate it throughout callbacks and promise chains. It
 * allows storing data throughout the lifetime of a web request or any other asynchronous duration. It is similar
 * to thread-local storage in other languages.
 *
 *  - Tracking the Request ID and other metadata for logging purposes
 *  - Keeping track of the user throughout the whole request
 *  - Making the dynamic Tenant database connection available everywhere in multi-tenant apps
 *  - Propagating the authentication level or role to restrict access to resources
 *  - Seamlessly propagating the transaction object of your favourite ORM across services without breaking
 *  encapsulation and isolation by explicitly passing it around.
 *  - Using "request" context in cases where actual REQUEST-scoped providers are not supported (passport strategies,
 *   cron controllers, websocket gateways, ...)
 *
 *   https://papooch.github.io/nestjs-cls/
 */
export const ContinuationLocalStorageModule = ClsModule.forRoot( CLS_CONFIG )