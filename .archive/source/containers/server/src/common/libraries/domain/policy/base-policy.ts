import {err, ok, Result} from 'neverthrow'



export type SpecificationUnit = (...args: any[]) => Result<boolean, any>


export class BasePolicy {
	merge(...args: Result<boolean, Error>[]): Result<boolean, Error> {
		let error: Error | undefined
		let result: boolean = false

		for (const result of args) {
			if (result.isErr()) {
				error = result.error
				break
			}
		}

		if (error) {
			return err(error)
		} else {
			return ok(true)
		}
	}
}