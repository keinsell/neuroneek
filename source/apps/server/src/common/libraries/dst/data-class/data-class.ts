import {Logger} from '@nestjs/common'
import {crc32}  from 'crc'



type ValuesType = {
	[key: string]: any;
};

let O = Object


function produce(proto: object, base: object, values: ValuesType): object {
	return O.freeze(O.assign(O.seal(O.assign(O.create(proto), base)), values))
}


/**
 * Syntax sugar that leverages the power of available type systems in TypeScript and JavaScript to provide an effortless
 * way for defining value objects that are immutable and persistent.
 *
 * ```ts
 * class User extends DataClass {
 *   name: string = "Anon";
 *   age: number = 25;
 * }
 * ```
 *
 * The implemented concept is heavily inspired by Scala and Kotlin. Both languages have the implementation of
 * data classes as a part of their syntax and share similar APIs.
 *
 * @see [Kotin `data class`](https://kotlinlang.org/docs/data-classes.html)
 * @see [Scala `case class`](https://docs.scala-lang.org/tour/case-classes.html)
 */
export class ImmutableClass {
	static create<Type extends ImmutableClass>(this: {
		new(): Type
	}, values?: Omit<Partial<Type>, keyof ImmutableClass>): Type {
		const logger = new Logger(this.constructor.name)

		const product = (
			produce(this.prototype, new this(), values as any) as Type
		)

		logger.debug(`Creating value object ${product.constructor.name}... ${JSON.stringify(values)}`, {
			constructor: this.constructor.name,
			values:      values,
		})

		const isThis = product.validate()

		if (!isThis) {
			logger.error(`Constructed value object is invalid`, {
				constructor: this.constructor.name,
				values:      values,
			})
			throw new TypeError(`Constructed Value Object is invalid`)
		}

		logger.verbose(`Created value object ${product.constructor.name}`, {
			constructor: this.constructor.name,
			values:      values,
		})

		return product
	}


	copy(values?: Omit<Partial<this>, keyof this>): this {
		return produce(O.getPrototypeOf(this), this, values as any) as this
	}


	equals(other: this): boolean {
		for (let key in this) {
			let a = this[key]
			let b = other[key]
			if (a !== b && (
				a == null || b == null || (
					a instanceof ImmutableClass && b instanceof ImmutableClass ?
						!a.equals(b) :
						a.valueOf() !== b.valueOf()
				)
			)) {
				return false
			}
		}
		return true
	}


	validate(): this is this {
		return true
	}


	hash(): string {
		const data = JSON.stringify(this)
		return crc32(data).toString(16)
	}
}