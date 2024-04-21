import {
  Global,
  Module,
}                            from '@nestjs/common'
import { AsyncLocalStorage } from 'async_hooks'



/**
 * AsyncLocalStorage is a Node.js API (based on the async_hooks API) that provides an alternative way of propagating
 * local state through the application without the need to explicitly pass it as a function parameter. It is similar to
 * a thread-local storage in other languages.
 *
 * The main idea of Async Local Storage is that we can wrap some function call with the AsyncLocalStorage#run call. All
 * code that is invoked within the wrapped call gets access to the same store, which will be unique to each call chain.
 *
 * In the context of NestJS, that means if we can find a place within the request's lifecycle where we can wrap the
 * rest of the request's code, we will be able to access and modify state visible only to that request, which may serve
 * as an alternative to REQUEST-scoped providers and some of their limitations.
 *
 * Alternatively, we can use ALS to propagate context for only a part of the system (for example the transaction
 * object) without passing it around explicitly across services, which can increase isolation and encapsulation.
 */
@Global() @Module( {
							providers : [
							  {
								 provide  : AsyncLocalStorage,
								 useValue : new AsyncLocalStorage(),
							  },
							],
							exports   : [ AsyncLocalStorage ],
						 } )
export class AsyncLocalStorageModule {}