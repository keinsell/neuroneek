import {MiddlewareConsumer, NestModule, Type} from '@nestjs/common';
//noinspection ES6UnusedImports
import {EventEmitter}                         from "node:events"



const eventEmitter = new EventEmitter();

type Configured = Type<Partial<NestModule>>;


/**
 * Class decorator for Module, that will call `configure` method after
 * configuring passed modules
 * @param depModules modules, that should be configured before target module
 */
export function InitializeModuleAfter(...depModules: Array<Type<unknown>>) {
	return <T extends Configured>(constructor: T) => {
		const decorated = class extends constructor {
			//@ts-ignore
			async configure(consumer: MiddlewareConsumer) {
				if (depModules.length) await Promise.all(depModules.map((m) => new Promise((r) => eventEmitter.once(m.name, r))));
				if (super.configure) await super.configure(consumer); else await Promise.resolve();
				eventEmitter.emit(constructor.name);
			}
		};
		// https://github.com/microsoft/TypeScript/issues/37157
		Object.defineProperty(decorated, 'name', {value: constructor.name});
		return decorated;
	};
}